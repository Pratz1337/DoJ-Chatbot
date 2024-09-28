import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pymongo
from pymongo import MongoClient
import csv
import os
import json

# Configure Chrome options
chrome_options = Options()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Initialize WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# URL of the NJDG website
url = "https://njdg.ecourts.gov.in/scnjdg/"

# Open the website
driver.get(url)

# Explicit wait time
wait = WebDriverWait(driver, 15)

# Function to scrape a table by heading text
def table_scraper(heading_text, file_name):
    data = []
    
    try:
        heading_xpath = f"//span[contains(text(), '{heading_text}')]"
        heading_element = wait.until(EC.presence_of_element_located((By.XPATH, heading_xpath)))
        print(f"Heading found: {heading_element.text}")

        card_element = heading_element.find_element(By.XPATH, "./ancestor::div[contains(@class, 'card')]")
        print("Card found")

        table = card_element.find_element(By.CSS_SELECTOR, 'table')
        rows = table.find_elements(By.CSS_SELECTOR, 'tbody tr')

        print(f"Found {len(rows)} rows")

        case_numbers = [elem.text for elem in rows[0].find_elements(By.CSS_SELECTOR, 'span.h4 a')]
        case_labels = [elem.text for elem in rows[1].find_elements(By.TAG_NAME, 'td')]

        print(f"Case Numbers: {case_numbers}")
        print(f"Case Labels: {case_labels}")

        for case_number, case_label in zip(case_numbers, case_labels):
            print(f"Found {case_label}: {case_number}")
            data.append([heading_text, case_label, case_number])
    
    except Exception as e:
        print(f"Error occurred while scraping: {e}")
    
    if data:
        df = pd.DataFrame(data, columns=['Heading', 'Category', 'Cases'])
        df.to_csv(file_name, index=False)
        print(f"Data saved to {file_name}")
    else:
        print("No data found to write to CSV.")

def table2_scraper(heading_text, file_name):
   
    data = []
    
    try:
        # Locate the card by heading text (use XPath for matching the heading)
        heading_xpath = f"//span[contains(text(), '{heading_text}')]"
        heading_element = wait.until(EC.presence_of_element_located((By.XPATH, heading_xpath)))
        print(f"Heading found: {heading_element.text}")

        # Find the card by locating the closest parent with class 'card'
        card_element = heading_element.find_element(By.XPATH, "./ancestor::div[contains(@class, 'card')]")
        print("Card found")

        # Find the table within the card
        table = card_element.find_element(By.CSS_SELECTOR, 'table')
        rows = table.find_elements(By.CSS_SELECTOR, 'tbody tr')

        # DEBUG: Print row count
        print(f"Found {len(rows)} rows")

        # Extract case data from the first row (with numbers and percentages)
        case_data = [elem.text for elem in rows[0].find_elements(By.TAG_NAME, 'td')]
        # Extract labels from the second row
        case_labels = [elem.text for elem in rows[1].find_elements(By.TAG_NAME, 'td')]

        # DEBUG: Check extracted values
        print(f"Case Data (Numbers and Percentages): {case_data}")
        print(f"Case Labels: {case_labels}")

        # Combine the labels, numbers, and percentages
        for case_datum, case_label in zip(case_data, case_labels):
            # Split by new lines and get the number and percentage
            lines = case_datum.split('\n')
            if len(lines) == 3:
                case_number = lines[1]  # The case number
                percentage = lines[2]   # The percentage in parentheses
                print(f"Found {case_label}: {case_number} ({percentage})")
                data.append([heading_text, case_label, case_number, percentage])
    
    except Exception as e:
        print(f"Error occurred while scraping: {e}")
    
    # Save the data to a CSV file if data is found
    if data:
        df = pd.DataFrame(data, columns=['Heading', 'Category', 'Cases', 'Percentage'])
        df.to_csv(file_name, index=False)
        print(f"Data saved to {file_name}")
    else:
        print("No data found to write to CSV.")

# Scrape the "Disposal in current year" table
table2_scraper('Disposal in current year', 'disposal_current_year.csv')



# Function to extract data from a table by class name
def scrape_by_classname(card_classname, heading_text, file_name):
    data = []
    
    try:
        card_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, card_classname)))
        print(f"Card with class '{card_classname}' found")

        table = card_element.find_element(By.CSS_SELECTOR, 'table')
        rows = table.find_elements(By.CSS_SELECTOR, 'tbody tr')

        print(f"Found {len(rows)} rows")

        case_numbers = [elem.text for elem in rows[0].find_elements(By.CSS_SELECTOR, 'span.h4 a')]
        case_labels = [elem.text for elem in rows[1].find_elements(By.TAG_NAME, 'td')]

        print(f"Case Numbers: {case_numbers}")
        print(f"Case Labels: {case_labels}")

        for case_number, case_label in zip(case_numbers, case_labels):
            print(f"Found {case_label}: {case_number}")
            data.append([heading_text, case_label, case_number])
    
    except Exception as e:
        print(f"Error occurred while scraping: {e}")
    
    if data:    
        df = pd.DataFrame(data, columns=['Heading', 'Category', 'Cases'])
        df.to_csv(file_name, index=False)
        print(f"Data saved to {file_name}")
    else:
        print("No data found to write to CSV.")

# Scrape specific tables
table_scraper('Disposal in last month', 'disposal_last_month_cases.csv')
table_scraper('Instituted in last month', 'instituted_last_month_cases.csv')
scrape_by_classname('card.mb-2.mt-2.aos-init.aos-animate', 'Instituted in current year', 'instituted_current_year.csv')


# Scraping additional data from the main page
data_list = []
ac = []
heading_list = []
table1_data = []
table2_data = []

try:
    dropdown_triggers = driver.find_elements(By.CSS_SELECTOR, '.fa-ellipsis-v')
    case_elements = driver.find_elements(By.CSS_SELECTOR, "span.counter.float-end.h2.m-0")
    headings = driver.find_elements(By.CSS_SELECTOR, 'h4.card-title.mb-0.d-inline')
    
    tables = WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'table.table.table-hover.text-start.m-0'))
    )

    # Function to extract data from a table
    def extract_table_data(table):
        table_data = []
        rows = table.find_elements(By.TAG_NAME, 'tr')
        for row in rows[1:]:
            columns = row.find_elements(By.TAG_NAME, 'td')
            if len(columns) >= 6:
                judge_type = columns[0].text.strip()
                civil_cases = columns[1].text.strip()
                criminal_cases = columns[3].text.strip()
                total_cases = columns[5].text.strip()
                table_data.append([judge_type, civil_cases, criminal_cases, total_cases])
        return table_data

    # Extract data from tables
    if len(tables) >= 2:
        table1_data = extract_table_data(tables[0])
        table2_data = extract_table_data(tables[1])
    elif len(tables) == 1:
        table1_data = extract_table_data(tables[0])
        print("Only one table found.")
    else:
        print("No tables found.")

    for heading, case_element in zip(headings, case_elements):
        case_number = case_element.text
        heading_text = heading.text
        heading_list.append(heading_text)
        ac.append("" + heading_text + " Cases: " + case_number)
    
    for index, trigger in enumerate(dropdown_triggers):
        try:
            trigger.click()
            time.sleep(2)  # Wait for the dropdown to appear
            
            registered_unregistered_cases = driver.find_elements(By.CSS_SELECTOR, 'ul.dropdown-menu.mtpdropdown-menu.show span')
            
            if len(registered_unregistered_cases) >= 2:
                registered_cases = registered_unregistered_cases[0].text
                unregistered_cases = registered_unregistered_cases[1].text

                registered_cases_number = registered_cases.split('\n')[1]
                unregistered_cases_number = unregistered_cases.split('\n')[1]
                for i in range(2):
                    data_list.append({
                        'Category': heading_list[i],
                        'Registered Cases': registered_cases_number,
                        'Unregistered Cases': unregistered_cases_number
                    })
                
            driver.execute_script("document.body.click();")
            time.sleep(1)
        except Exception as e:
            print(f"Error occurred while scraping dropdown: {e}")

except Exception as e:
    print(f"Error occurred while scraping: {e}")

# Close the browser
driver.quit()



output_data = {
    "Overall Case Information" : ac, 
    "Registered and Unregistered Cases" : data_list
}

with open('ac_info.json', 'w') as file:
    json.dump(output_data, file, indent=4)

# Save table1_data to CSV
if table1_data:
    df1 = pd.DataFrame(table1_data, columns=['Judge Type', 'Civil Cases', 'Criminal Cases', 'Total Cases'])
    df1.to_csv('coram_wise_pending_cases_table1.csv', index=False)
    print("Data from Table 1 saved to 'coram_wise_pending_cases_table1.csv'.")
else:
    print("No data was extracted from Table 1. CSV file not created.")

# Save table2_data to CSV
if table2_data:
    df2 = pd.DataFrame(table2_data, columns=['Judge Type', 'Civil Cases', 'Criminal Cases', 'Total Cases'])
    df2.to_csv('coram_wise_pending_cases_table2.csv', index=False)
    print("Data from Table 2 saved to 'coram_wise_pending_cases_table2.csv'.")
else:
    print("No data was extracted from Table 2. CSV file not created.")


def csv_to_json(csv_file_path, json_file_path):
    # Create an empty list to store rows
    data = []
    
    # Open the CSV file for reading
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        # Convert each row into a dictionary and add it to the data list
        for row in csv_reader:
            data.append(row)
    
    # Write the list to a JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)  # Indent is for pretty printing

    print(f"Converted {csv_file_path} to {json_file_path}")

# List of CSV files to convert
csv_files = [
    'disposal_last_month_cases.csv',
    'instituted_last_month_cases.csv',
    'instituted_current_year.csv',
    'coram_wise_pending_cases_table1.csv',
    'coram_wise_pending_cases_table2.csv'
]

# Convert each CSV file to JSON
for csv_file in csv_files:
    # Generate JSON file path by replacing .csv extension with .json
    json_file = os.path.splitext(csv_file)[0] + '.json'
    csv_to_json(csv_file, json_file)

def push_json_to_mongodb(file_paths):
    # MongoDB connection string
    connection_string = "mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ"

    # Connect to MongoDB
    client = MongoClient(connection_string)

    # Select the database and collection
    db = client.DojChatbot
    collection = db.case_pendency.Documents

    # Iterate over each file and insert its content
    for file_path in file_paths:
        try:
            with open(file_path, 'r') as file:
                # Load JSON data
                data = json.load(file)
                
                # Check if the JSON data is a list (array of documents) or a single document
                if isinstance(data, list):
                    # Insert each document in the list
                    collection.insert_many(data)
                    print(f"Inserted list of documents from {file_path} successfully.")
                elif isinstance(data, dict):
                    # Insert single document
                    collection.insert_one(data)
                    print(f"Inserted document from {file_path} successfully.")
                else:
                    print(f"File {file_path} contains unsupported data structure.")
        except Exception as e:
            print(f"An error occurred while inserting data from {file_path}: {e}")

# List of file paths
file_paths = [
    'disposal_last_month_cases.json',
    'instituted_last_month_cases.json',
    'instituted_current_year.json',
    'coram_wise_pending_cases_table1.json',
    'coram_wise_pending_cases_table2.json',
    'ac_info.json'
]

# Call the function to push the data
push_json_to_mongodb(file_paths)

print("Scraping complete! Data saved to 'cases_info.txt' and CSV files.")


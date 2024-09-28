import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from bs4 import BeautifulSoup
import re

# Set up the LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    google_api_key="AIzaSyDIG-JhAjoTJPZV_M5CGzjhIX8klNbXm3I"
)

# Define the prompt template
prompt_template = """Extract important information from the following HTML content,DONT PRETTIFY THINGS JUST PUT WITH NEW LINES ALSO DONT PUT CASE DETAILS DIRECTLY START FROM CASE STATUS AND USE LESS WHITESPACE:

HTML:
{html_content}

Information:"""

prompt = PromptTemplate(template=prompt_template, input_variables=["html_content"])
chain = LLMChain(llm=llm, prompt=prompt)

# Function to parse the HTML content
def extract_important_info_from_html(html_content: str):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Extract key information (title, meta description, headers, and paragraphs)
    title = soup.title.string if soup.title else "No Title"
    meta_description = soup.find('meta', attrs={'name': 'description'})
    description = meta_description['content'] if meta_description else "No Meta Description"
    
    headers = [header.get_text() for header in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])]
    paragraphs = [p.get_text() for p in soup.find_all('p')]

    # Combine all extracted information
    important_info = f"Title: {title}\nDescription: {description}\nHeaders: {headers}\nParagraphs: {paragraphs}"
    return important_info

def CaseModel(id, html_file_path):
    config = {"configurable": {"thread_id": id}}

    # Step 1: Read the HTML content from the file
    try:
        with open(html_file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
    except Exception as e:
        return {"res": {"msg": f"Error reading HTML file: {str(e)}"}, "info": "File read error"}

    # Step 2: Extract important information using BeautifulSoup
    important_info = extract_important_info_from_html(html_content)

    # Step 3: Use the LLM (LangChain) to further process the extracted information
    result = chain.run(html_content=important_info)

    # Step 4: Format the response
    msg = result.replace("* **", "\n\n").replace(":**", ":").replace("\n", "\n\n")  # Ensure points start on new lines

    return {"res": {"msg": msg}, "info": important_info}

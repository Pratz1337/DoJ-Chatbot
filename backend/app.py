# Import necessary modules
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from io import BytesIO
import requests
from bs4 import BeautifulSoup
from chat_model import ChatModel
from keyword_map import find_tool_based_on_query
from tool_extractor import get_tool_info
from langchain_google_genai import ChatGoogleGenerativeAI
import re

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize the conversation history storage
conversation_history = []

# Create a Google Gemini LLM instance for summarization
summary_llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.5,  # Adjust the temperature for more creative summaries
    max_tokens=800,   # Adjust the token length for your summaries
    timeout=None,
    max_retries=2,
    google_api_key="AIzaSyDIG-JhAjoTJPZV_M5CGzjhIX8klNbXm3I"
)

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Department of Justice Chatbot!"

def clean_summary(raw_summary):
    # Replace headings '##' with a formatted title
    clean_text = re.sub(r"##\s*(.+)", r"\1\n", raw_summary)

    # Replace bold '**' with normal text
    clean_text = re.sub(r"\*\*(.+?)\*\*", r"\1", clean_text)

    # Replace bullet points '*' with '-' (optional) or leave them out for cleaner text
    clean_text = re.sub(r"\*\s*", "- ", clean_text)

    return clean_text

def format_summary_for_chat(summary):
    summary = clean_summary(summary)
    lines = summary.split('\n')
    formatted_content = []
    
    for line in lines:
        stripped_line = line.strip()
        if not stripped_line:
            continue
        
        if stripped_line.endswith(':'):
            if len(stripped_line) > 30:  # Longer lines as main headings
                formatted_content.append(f"\n### {stripped_line}\n")
            else:
                formatted_content.append(f"\n#### {stripped_line}\n")
        elif stripped_line.startswith('•') or stripped_line.startswith('-'):
            formatted_content.append(f"- {stripped_line[1:].strip()}")
        else:
            formatted_content.append(stripped_line)

    return "\n".join(formatted_content)

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'GET':
        return jsonify({"message": "Chat endpoint is working. Please use POST method to send messages."}), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        user_id = data.get("user_id", "user_1")
        user_message = data.get("message", "")
        
        if not user_message:
            return jsonify({"error": "Message is required!"}), 400

        # Find the tool name based on the user query
        tool_name = find_tool_based_on_query(user_message)
        
        # Get information about the selected tool, if applicable
        tool_info = get_tool_info(tool_name) if tool_name else {}
        print(tool_info)

        # Combine user message with tool information to create the enhanced prompt
        enhanced_prompt = f"User message: {user_message}\nTool information: {tool_info}"

        # Get the chatbot response
        response = ChatModel(user_id, enhanced_prompt)
        
        # Debugging: Print the response to see its structure
        print("Response:", response)
        
        # Use `.get()` method to handle missing keys
        formatted_response = format_summary_for_chat(response['res']['msg'])
        info = response.get('info', 'No additional information')  # Default value if 'info' is missing

        # Add the interaction to the conversation history
        conversation_history.append({"user": user_message, "bot": formatted_response})

        return jsonify({
            "res": {
                "msg": formatted_response
            },
            "info": info,
            "selected_tool": tool_name
        })


@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    data = request.json
    conversation_history = data.get('conversation', [])
    
    if not conversation_history:
        return jsonify({"error": "No conversation history available for summarization."}), 400

    # Format the entire conversation as a string for the prompt
    formatted_conversation = ""
    for message in conversation_history:
        formatted_conversation += f"User: {message['user']}\nBot: {message['bot']}\n\n"

    # Create the dramatic-style prompt for summarization
    prompt = f"""
As an AI specialized in Indian law and the Department of Justice (DoJ), create a structured summary of the following conversation in a style similar to an educational brief. Use the format below:

Conversation to summarize:
{formatted_conversation}

Please structure the summary as follows:

Introduction
• Briefly introduce the context of the conversation and the main topics discussed.

Main Topics Discussed
• List the primary subjects covered in bullet points.

Detailed Information
• For each main topic, provide sub-bullets with key information, data, or explanations.
• Use clear, concise language.
• Include numerical data where relevant.

Key Takeaways
• Summarize the most important points or conclusions from the conversation.

Next Steps (if applicable)
• List any recommended actions or further inquiries suggested during the conversation.

Conclusion
• Provide a brief closing statement about the overall conversation.

Notes:
- Use bullet points and sub-bullets for easy readability.
- Keep the language professional but accessible.
- Include specific numbers, ranks, or data points when mentioned in the conversation.
- Organize information in a logical flow, similar to an educational summary.
- Ensure all legal information is accurately represented.

Disclaimer: This summary is for informational purposes only and does not constitute legal advice.

Format: follow the format which is best suitable for React Markdown
"""

    # Call the Gemini LLM to generate the summary
    try:
        summary_response = summary_llm.invoke(prompt)

        # Assuming the response is an AIMessage object, extract the content appropriately
        if hasattr(summary_response, 'content'):
            summary_text = summary_response.content 
        else:
            summary_text = str(summary_response)  # Fallback to string conversion
        # Add the summary to the response
        return jsonify({
            "summary": summary_text,
            "status": "Summary generated successfully"
        })
    except Exception as e:
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500

def format_summary(summary):
    summary = clean_summary(summary)
    lines = summary.split('\n')
    formatted_content = []
    current_list = []
    list_level = 0
    styles = getSampleStyleSheet()
    
    # Custom styles with Times-Roman instead of Helvetica
    title_style = ParagraphStyle('Title', fontName="Times-Roman", fontSize=24, spaceAfter=30, textColor=HexColor("#000000"), alignment=1)
    h1_style = ParagraphStyle('Heading1', fontName="Times-Roman", fontSize=24, spaceBefore=30, spaceAfter=30, textColor=HexColor("#000000"), alignment=1)
    h2_style = ParagraphStyle('Heading2', fontName="Times-Roman", fontSize=18, spaceBefore=25, spaceAfter=10, textColor=HexColor("#000000"), alignment=0)
    h3_style = ParagraphStyle('Heading3', fontName="Times-Roman", fontSize=16, spaceBefore=20, spaceAfter=8, textColor=HexColor("#000000"), alignment=0)
    body_style = ParagraphStyle('BodyText', fontName="Times-Roman", fontSize=12, textColor=HexColor("#333333"), leading=18)
    bullet_style = ParagraphStyle('Bullet', fontName="Times-Roman", fontSize=12, textColor=HexColor("#333333"), leftIndent=36, bulletIndent=18)
    disclaimer_style = ParagraphStyle('Disclaimer', fontName="Times-Roman", fontSize=10, textColor=HexColor("#333333"), italic=True, spaceBefore=30, borderPadding=10, borderColor=HexColor("#cccccc"), borderWidth=1, borderStyle="solid")
    
    def close_list():
        nonlocal current_list, list_level
        if current_list:
            formatted_content.append(ListFlowable(current_list, bulletType='bullet', start='•', bulletFontSize=12, bulletOffsetY=2, bulletColor=HexColor("#000000")))
            current_list = []
            list_level = 0

    for line in lines:
        stripped_line = line.strip()
        if not stripped_line:
            continue
        
        if stripped_line.endswith(':'):
            close_list()
            if len(stripped_line) > 30:  # Longer lines as main headings
                formatted_content.append(Paragraph(stripped_line, h2_style))
            else:
                formatted_content.append(Paragraph(stripped_line, h3_style))
        elif stripped_line.startswith('•') or stripped_line.startswith('-'):
            content = stripped_line[1:].strip()
            if list_level == 0:
                close_list()
            current_list.append(ListItem(Paragraph(content, bullet_style), leftIndent=20, bulletColor=HexColor("#000000")))
            list_level = 1
        else:
            close_list()
            formatted_content.append(Paragraph(stripped_line, body_style))

    close_list()
    return formatted_content

@app.route('/download-summary', methods=['POST'])
def download_summary():
    data = request.json
    summary = data.get('summary', '')

    if not summary:
        return jsonify({"error": "No summary available for download."}), 400

    # Create a PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=1 * inch, leftMargin=1 * inch, topMargin=1 * inch, bottomMargin=1 * inch)
    
    # Format the summary
    formatted_summary = format_summary(summary)
    
    # Add title
    title = Paragraph("LawGPT Conversation Summary", ParagraphStyle('CustomTitle', fontName="Helvetica", fontSize=24, spaceAfter=30, textColor=HexColor("#000000"), alignment=1))  # Center aligned title
    
    # Build the PDF
    content = [title, Spacer(1, 0.3 * inch)] + formatted_summary
    doc.build(content)

    # Prepare the response
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='lawgpt_conversation_summary.pdf', mimetype='application/pdf')


# Configure logging

from casemodel import CaseModel  # Import the updated ChatModel

@app.route('/check-case-status', methods=['POST'])
def check_case_status():
    data = request.get_json()
    cino = data.get('cino')

    if not cino:
        return jsonify({"error": "CINO is required"}), 400

    try:
        url = 'https://services.ecourts.gov.in/ecourtindia_v6/?p=cnr_status/searchByCNR/'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        response_data = {'cino': cino}
        
        response = requests.post(url, headers=headers, data=response_data)
        
        if response.status_code == 200:
            # Parse and process the HTML content using the updated ChatModel
            chat_model_response = CaseModel(cino, response.text)

            # Get the final message from the ChatModel
            final_output = chat_model_response['res']['msg']

            # Print and return all information from the LLM
            return jsonify({
                "extracted_info": chat_model_response['info'],
                "llm_response": final_output
            }), 200
        
        else:
            return jsonify({"error": "Failed to fetch case details"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


   

if __name__ == '__main__':
    app.run(port=5000, debug=True)
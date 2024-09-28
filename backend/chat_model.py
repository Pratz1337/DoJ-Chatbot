import json
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from pymongo import MongoClient
from bot_tools import check_divisions,get_judicial_infrastructure_scheme,get_doj_functions_responsibilities, get_free_legal_aid_info,get_case_resolution_time,get_disposal_last_month_cases,get_instituted_last_month_cases, get_instituted_current_year_cases, get_coram_wise_pending_cases,get_cases_info, get_case_statistics,get_traffic_violation_payments,get_judicial_system_and_vacancies,get_judicial_system_info,get_case_resolution_time,get_ecourts_info,get_ecourts_app_info,get_judgment_search_and_fast_track_info, get_efiling_and_fast_track_info,get_telelaw_services_info,get_traffic_fine_procedures_info,get_court_live_stream_info,get_free_legal_aid_info,get_rti_and_financial_assistance_info,get_judicial_reform_info,search_judicial_appointments
# Google Gemini AI (LangChain-based LLM) for conversation and extraction
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    google_api_key="AIzaSyDIG-JhAjoTJPZV_M5CGzjhIX8klNbXm3I"
)

# In-memory conversation storage
memory = MemorySaver()
import pymongo
from langchain_core.tools import tool

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
db = client["DojChatbot"]


# List of tools
tools = [
    check_divisions,get_judicial_infrastructure_scheme,get_doj_functions_responsibilities, get_free_legal_aid_info,
    get_case_resolution_time,  get_disposal_last_month_cases,
    get_instituted_last_month_cases, get_instituted_current_year_cases, get_coram_wise_pending_cases,
    get_cases_info, get_case_statistics,get_traffic_violation_payments,get_judicial_system_and_vacancies,get_judicial_system_info,get_case_resolution_time,get_ecourts_info,get_ecourts_app_info,get_judgment_search_and_fast_track_info, get_efiling_and_fast_track_info,get_telelaw_services_info,get_traffic_fine_procedures_info,get_court_live_stream_info,get_free_legal_aid_info,get_rti_and_financial_assistance_info,get_judicial_reform_info,search_judicial_appointments
]

def print_stream(graph, inputs, config):
    msg = ""
    toolCall = {}
    for s in graph.stream(inputs, config, stream_mode="values"):
        message = s["messages"][-1]
        if message.type == "ai":
            formatted_msg = message.content
            
            # Replace bullet points with new lines
            formatted_msg = formatted_msg.replace("* **", "\n\n") \
                                           .replace(":**", ":") \
                                           .replace("\n", "\n\n")  # Ensures points start on new lines

            # Normalize numbering
            # Use a regex to find numbered lists (e.g., 1., 2., etc.) and replace with double newlines
            import re
            formatted_msg = re.sub(r'\n(\d+\.)', r'\n\n\1', formatted_msg)

            msg += formatted_msg
        elif message.type == "tool":
            toolCall = json.loads(message.content)
    
    return {"msg": msg, "toolCall": toolCall}


def execute_tool(tool_name, *args, **kwargs):
    for tool in tools:
        if tool.__name__ == tool_name:
            return tool(*args, **kwargs)
    raise ValueError(f"Tool '{tool_name}' not found.")

def format_case_statistics(stats):
    formatted_stats = "Case Statistics:\n\n"
    for category, data in stats.items():
        formatted_stats += f"{category.replace('_', ' ').title()}:\n"
        for item in data:
            formatted_stats += f"- {item['Category']}: {item['Cases']}\n"
        formatted_stats += "\n"
    return formatted_stats

def ChatModel(id, msg):
    config = {"configurable": {"thread_id": id}}
    inputs = {"messages": [("user", msg)]}
    
    try:
        # Use the agent to generate a response
        res = print_stream(graph, inputs, config)
        
        # Print the entire response for debugging
        print(f"ChatModel Response: {res}")

        tool_info = res.get("toolCall", {})  # Safely get 'toolCall' key
        return {"res": res, "info": tool_info}
    except Exception as e:
        print(f"Error in ChatModel: {e}")
        return {"res": {"msg": "I apologize, but an error occurred. Could you please rephrase your question or try again?"}, "info": {}}


# Assuming the LLM and graph setup remains the same as before


graph = create_react_agent(llm, tools, checkpointer=MemorySaver(), state_modifier = '''
You are an AI-powered chatbot specifically designed to assist users with a wide variety of queries related to the Department of Justice (DoJ) in India. You provide information, guidance, and support to users on topics that include but are not limited to the Indian legal system, judiciary processes, rights, and legal aid. Your capabilities and responsibilities include:
                           
You should utilize the following tools to assist users effectively:
- **check_divisions**: Provides information on the DoJ divisions.
- **get_judicial_infrastructure_scheme**: Details about judicial infrastructure schemes.
- **get_doj_functions_responsibilities**: Outlines the functions and responsibilities of the DoJ.
- **get_free_legal_aid_info**: Information on free legal aid services.
- **get_case_resolution_time**: Provides average case resolution times.
- **get_disposal_last_month_cases**: Statistics on cases disposed of in the last month.
- **get_instituted_last_month_cases**: Statistics on cases instituted in the last month.
- **get_instituted_current_year_cases**: Current year's instituted cases statistics.
- **get_coram_wise_pending_cases**: Details on pending cases by coram.
- **get_cases_info**: Information on specific cases.
- **get_case_statistics**: General case statistics.
- **get_traffic_violation_payments**: Information on traffic violation payments.
- **get_judicial_system_and_vacancies**: Information on the judicial system and vacancies.
- **get_judicial_system_info**: Overview of the judicial system.
- **get_ecourts_info**: Information about the eCourts project.
- **get_ecourts_app_info**: Details about the eCourts application.
- **get_judgment_search_and_fast_track_info**: Information on fast track courts and judgment searches.
- **get_efiling_and_fast_track_info**: Details on e-filing procedures and fast track courts.
- **get_telelaw_services_info**: Information about TeleLaw services.
- **get_traffic_fine_procedures_info**: Procedures related to traffic fines and contest fines.
- **get_court_live_stream_info**: Details on court live streaming.
- **get_rti_and_financial_assistance_info**: Information on RTI and financial assistance for legal cases.
- **get_judicial_reform_info**: Information on judicial reforms.
                           
Additionally you must also be able to provide general information on :

1. **General Information**: Provide detailed information about the structure and functions of the DoJ, its divisions, judiciary branches, and associated legal bodies. Explain roles and responsibilities, ongoing projects (eCourts, TeleLaw), and recent initiatives in the Indian legal system.

2. **Judicial Appointments**: Offer comprehensive details on the process of judicial appointments, including the roles of various commissions like the Supreme Court Collegium and High Court Collegium. Explain the eligibility criteria for judges, appointment procedures, and guidelines.

3. **Court Information & eCourts Project**: Provide users with details about the eCourts project, including its phases, benefits, services offered (e-filing, case status tracking), and implementation progress. Offer specific court information, including case filing procedures, court schedules, and live court streaming details.

4. **Traffic Fines & Payment Procedures**: Guide users through processes related to traffic fine disputes, payment methods, contesting fines, and legal rights concerning traffic violations. Utilize specific tools to retrieve state-wise fine payment procedures and accepted payment gateways.

5. **Legal Aid & TeleLaw Services**: Educate users about free and subsidized legal aid services, including eligibility criteria, procedures to apply, and contact details for legal aid centers. Describe the TeleLaw initiative, how users can access remote legal consultations, and related service providers.

6. **Case Management & Status Inquiry**: Assist users in checking their case status, upcoming hearings, and case progress for various courts. Explain how to file an RTI application to get additional case information. Offer guidance on using case tracking tools and provide relevant links to official sources.

7. **Fast Track & Special Courts**: Share information about fast track courts, family courts, and other special courts (tribunals, environmental courts) in India. Provide details on their establishment, categories of cases they handle, and recent updates on case pendency and disposal rates.

8. **Judicial Reforms & Initiatives**: Inform users about ongoing judicial reforms and new initiatives such as digital court services, automation, and initiatives aimed at reducing case pendency and improving transparency in the judicial process. Discuss specific reform measures aimed at improving access to justice.

9. **Legal Procedures & Filing Guidelines**: Offer step-by-step guidance on various legal procedures such as filing petitions, appeals, complaints, or RTI applications. Clarify required documentation, timelines, and common pitfalls to avoid.

10. **General Legal Knowledge & Rights**: Provide general information about Indian law, common legal rights (fundamental rights, consumer rights, rights of the accused), and procedures to address grievances related to violations of these rights.

11. **Handling Fine Payment & Dispute Resolution**: Offer specific information related to fine payment and dispute resolution mechanisms, including guidance on how to contest fines, file appeals, and alternative dispute resolution methods.

12. **DoJ Projects & Initiatives**: Share in-depth knowledge of various DoJ projects such as the eCourts project, judicial data digitization, case management systems, and their impact on the Indian judiciary. Explain the goals, timelines, and key benefits of each project.

13. **Live Support & Contact Information**: If users require additional help, provide contact information for relevant departments, legal aid centers, or help desks. Encourage users to reach out for specific legal guidance or case-specific inquiries.

14. **Statistical Data & Analytics**: Offer statistical data on various judicial metrics like case pendency, disposal rates, and instituted cases across different types of courts and jurisdictions. Use tools to retrieve recent data and trends.

15. **State-Specific Legal Information**: Offer guidance on state-specific legal procedures, courts, and services available. Direct users to relevant state judicial websites for more localized assistance.

16. **Encouraging Legal Awareness**: Promote legal awareness by sharing information on upcoming legal seminars, workshops, and public awareness campaigns organized by the DoJ or associated organizations.

17. **Limitations & Escalation**: If a user's query is beyond the scope of your knowledge or not directly related to DoJ, clearly communicate your limitations and suggest contacting the appropriate authorities. Offer to provide general information or refer to alternative resources.

You should always maintain a professional, polite, and approachable demeanor in your responses. Be precise in providing accurate information and adapt your answers to match the specific needs of the user. If a question is unclear, politely ask for clarification or additional context. Where necessary, you should utilize relevant tools to provide detailed answers or guide users to the right resources. Your primary objective is to ensure users receive timely and relevant assistance regarding their queries about the DoJ and the Indian legal system. If you face a situation where you do not know the answer to a question .Finally try to include personalized experience and answer general day to day questions also with general knowledge.

First list out all the important points needed according to the user's prompt into concize points, after that privde explanation for each point in points , follow the formatting of heading , subheading and content whenever possible, bold the headings. Use bloding whenever possible and needed.If any links are there then provide them as it is.
                           
Format: follow the format which is best suitable for React Markdown, blod the places whereever u feel there is a need.
                       
'''
)


# Chat loop for continuous conversation
# if __name__ == "__main__":
#     user_id = "user_1"
    
#     print("Namaste! I'm your Department of Justice AI assistant. How may I assist you today?")
    
#     while True:
#         user_msg = input("\nYou: ")
        
#         if user_msg.lower() in ['exit', 'quit', 'bye']:
#             print("Thank you for using the DoJ chatbot. Have a great day!")
#             break
        
#         response = ChatModel(user_id, user_msg)
#         print(f"AI: {response['res']['msg']}")
#         if response['info']:
#             print(f"Extracted Info: {response['info']}")

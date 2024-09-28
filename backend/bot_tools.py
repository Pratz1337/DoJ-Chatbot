import pymongo
from langchain_core.tools import tool
import requests
from langchain.document_loaders import UnstructuredHTMLLoader

# MongoDB connection

client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
db = client["DojChatbot"]
@tool
def check_case_with_CNR(CNR: str) -> str:
    '''Return information about a currntly active or disposed off case from the offical source by taking CNR or case number as input. Use this when user wants information about a particular case and ask to provide CNR number of that case'''
    data = {
        'cino': CNR
    }
    print(data)
    r = requests.post('https://services.ecourts.gov.in/ecourtindia_v6/?p=cnr_status/searchByCNR/', data=data)
    with open("casereport.html", "w") as file:
        file.write(r.text)
    loader = UnstructuredHTMLLoader("casereport.html")
    data = loader.load()
    return data
@tool
def get_disposal_last_month_cases() -> dict:
    """Retrieve information about cases disposed of in the last month."""
    collection = db["disposal_last_month_cases"]
    results = list(collection.find({}, {"_id": 0}))
    return {"disposal_last_month": results}

@tool
def get_instituted_last_month_cases() -> dict:
    """Retrieve information about cases instituted in the last month."""
    collection = db["instituted_last_month_cases"]
    results = list(collection.find({}, {"_id": 0}))
    return {"instituted_last_month": results}

@tool
def get_instituted_current_year_cases() -> dict:
    """Retrieve information about cases instituted in the current year."""
    collection = db["instituted_current_year"]
    results = list(collection.find({}, {"_id": 0}))
    return {"instituted_current_year": results}

@tool
def get_coram_wise_pending_cases() -> dict:
    """Retrieve information about coram-wise pending cases."""
    table1 = db["coram_wise_pending_cases_table1"]
    table2 = db["coram_wise_pending_cases_table2"]
    results_table1 = list(table1.find({}, {"_id": 0}))
    results_table2 = list(table2.find({}, {"_id": 0}))
    return {"coram_wise_pending_cases": {"table1": results_table1, "table2": results_table2}}

@tool
def get_cases_info() -> dict:
    """Retrieve comprehensive information about cases, including tables and headings."""
    collection = db["cases_info"]
    result = collection.find_one({}, {"_id": 0})
    return {"cases_info": result}

@tool
def get_case_statistics() -> dict:
    """Retrieve comprehensive case statistics including disposal, institution, and pending cases."""
    disposal = get_disposal_last_month_cases()["disposal_last_month"]
    instituted_month = get_instituted_last_month_cases()["instituted_last_month"]
    instituted_year = get_instituted_current_year_cases()["instituted_current_year"]
    pending = get_cases_info()["cases_info"]["headings"]
    
    return {
        "disposal_last_month": disposal,
        "instituted_last_month": instituted_month,
        "instituted_current_year": instituted_year,
        "pending_cases": pending
    }
# Tool to fetch divisions of DoJ
@tool
def check_divisions() -> dict:
    '''Return a list of divisions within the Department of Justice (DoJ) along with their functions.'''
    collection = db["Divisions"]
    divisions_data = collection.find_one({}, {"_id": 0, "divisions": 1})
    if not divisions_data:
        return {"error": "No divisions data found"}
    divisions_info = [{"name": division["name"], "description": division["description"], "functions": division["functions"]} for division in divisions_data["divisions"]]
    return {"divisions": divisions_info}
@tool
def get_doj_functions_responsibilities() -> dict:
    '''Return a list of functions and responsibilities of the Department of Justice (DoJ).'''
    collection = db["Doj_Functions_and_Responsibilities"]
    doj_data = collection.find_one({"DepartmentOfJustice": {"$exists": True}}, {"_id": 0, "DepartmentOfJustice": 1})
    if not doj_data:
        return {"error": "No Department of Justice data found"}
    return doj_data["DepartmentOfJustice"]
@tool
def get_judicial_infrastructure_scheme() -> dict:
    '''Return information about the Judicial Infrastructure Scheme.'''
    collection = db["Judicial_Infrastructure_Scheme"]
    scheme_data = collection.find_one({}, {"_id": 0, "JudicialInfrastructureScheme": 1})
    if not scheme_data:
        return {"error": "No Judicial Infrastructure Scheme data found"}
    return scheme_data["JudicialInfrastructureScheme"]

# List of tools for the chatbot
@tool
def get_traffic_violation_payments() -> dict:
    '''Return information about traffic violation payment processes.'''
    collection = db["trafficViolationPayments"]
    payment_data = collection.find_one({}, {"_id": 0, "trafficViolationPayments": 1})
    if not payment_data:
        return {"error": "No traffic violation payment information found"}
    return payment_data["trafficViolationPayments"]
@tool
def get_judicial_system_and_vacancies() -> dict:
    '''Return information about the Judicial System and its vacancies.'''
    collection = db["JudicialSystem_and_Vacancies"]
    judicial_data = collection.find_one({}, {"_id": 0, "JudicialSystem": 1, "JudiciaryVacancies": 1})
    if not judicial_data:
        return {"error": "No judicial system and vacancy information found"}
    return judicial_data
@tool
def search_judicial_appointments(query: str) -> dict:
    '''Search the Judicial Appointments collection by name or position.'''
    from pymongo import MongoClient

    # Connect to MongoDB
    client = MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client.DojChatbot
    collection = db.Judicial_Appointments

    # Search for appointments matching the query
    results = collection.find({
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"position": {"$regex": query, "$options": "i"}}
        ]
    })

    # Format results into a list of dictionaries
    appointments = [{"name": appointment["name"], "position": appointment["position"], "date": appointment["date"]} for appointment in results]

    return {"appointments": appointments}
@tool
def get_judicial_system_info() -> dict:
    '''Return detailed information about the judicial system in India, including steps to become a judge, eligibility criteria, and judicial positions.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["Becoming_a_Judge"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        return {
            "introduction": document["introduction"]["description"],
            "steps_to_become_judge": document["stepsToBecomeJudge"],
            "eligibility": document["eligibility"]["categories"],
            "judicial_positions": {
                "supreme_court": document["judicialPositions"]["supremeCourt"]["appointment"],
                "high_court": document["judicialPositions"]["highCourt"]["appointment"],
                "district_and_subordinate_courts": document["judicialPositions"]["districtAndSubordinateCourts"]["appointment"],
            },
            "conclusion": document["conclusion"]["message"]
        }
    else:
        return {"error": "Could not retrieve judicial system information."}
@tool
def get_case_resolution_time() -> dict:
    '''Return information about case resolution times in Karnataka and other states in India.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["Case_resolution_time"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        return {
            "high_court": {
                "state": document["CaseResolutionTime"]["HighCourt"]["State"],
                "average_time": document["CaseResolutionTime"]["HighCourt"]["AverageTime"],
                "ranking": document["CaseResolutionTime"]["HighCourt"]["Ranking"],
            },
            "lower_courts": {
                "state": document["CaseResolutionTime"]["LowerCourts"]["State"],
                "average_time": document["CaseResolutionTime"]["LowerCourts"]["AverageTime"],
                "ranking": document["CaseResolutionTime"]["LowerCourts"]["Ranking"],
            },
            "other_states": document["CaseResolutionTime"]["OtherStates"],
            "overall_judiciary_ranking": {
                "state": document["CaseResolutionTime"]["OverallJudiciaryRanking"]["State"],
                "position": document["CaseResolutionTime"]["OverallJudiciaryRanking"]["Position"],
            },
        }
    else:
        return {"error": "Could not retrieve case resolution time information."}
@tool
def get_ecourts_info() -> dict:
    '''Return information about eCourts Services App, eFiling process, and ePayment process.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["eFilling_and_ePayment"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        app_info = document["app_info"]
        e_filing = document["eFiling"]
        e_payment = document["ePaymentProcess"]
        
        return {
            "app_info": {
                "description": app_info["description"],
                "services": app_info["services"],
                "backup": app_info.get("backup")
            },
            "e_filing": {
                "general_steps": e_filing["generalSteps"],
                "supreme_court_steps": e_filing["supremeCourtSteps"],
                "guidelines": e_filing["guidelines"]
            },
            "e_payment": {
                "steps": e_payment["steps"]
            }
        }
    else:
        return {"error": "Could not retrieve eCourts information."}
@tool
def get_ecourts_app_info() -> dict:
    '''Return information about the eCourts Services Mobile App and the eCourts Mission Mode Project.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["eCourt_app_services"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        app_details = document["eCourtsServicesApp"]["appDetails"]
        mission_mode_project = document["eCourtsMissionModeProject"]
        
        return {
            "app_info": {
                "name": app_details["name"],
                "award": app_details["award"],
                "description": app_details["description"],
                "availability": app_details["availability"],
                "features": app_details["features"],
                "accessibility": app_details["accessibility"],
                "more_info_url": mission_mode_project["overview"]["url"]
            },
            "mission_mode_project": {
                "overview": mission_mode_project["overview"],
                "governance": mission_mode_project["governance"],
                "funding": mission_mode_project["funding"],
                "project_goals": mission_mode_project["projectGoals"],
                "phases": mission_mode_project["phases"],
                "national_portal": mission_mode_project["nationalPortal"],
                "data_analysis": mission_mode_project["dataAnalysis"],
                "ecommittee_composition": mission_mode_project["eCommitteeComposition"],
                "high_court_roles": mission_mode_project["highCourtRoles"]
            }
        }
    else:
        return {"error": "Could not retrieve eCourts information."}
@tool
def get_judgment_search_and_fast_track_info() -> dict:
    '''Return information about the Judgment Search feature and Fast Track Special Courts.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["judgmentSearch_and_fastTrackSpecialCourts"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        judgment_search = document["judgmentSearch"]
        fast_track_courts = document["fastTrackSpecialCourts"]
        
        return {
            "judgment_search": {
                "url": judgment_search["url"],
                "features": judgment_search["features"]
            },
            "fast_track_special_courts": {
                "objective": fast_track_courts["objective"],
                "legislation": fast_track_courts["legislation"],
                "scheme_details": fast_track_courts["schemeDetails"],
                "monitoring_framework": fast_track_courts["monitoringFramework"],
                "images": fast_track_courts["images"]
            }
        }
    else:
        return {"error": "Could not retrieve judgment search and fast track special courts information."}
@tool
def get_efiling_and_fast_track_info() -> dict:
    '''Return information about the eFiling System and Fast Track Courts.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["eFilingSystem_and_FastTrackCourts"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        e_filing_system = document["eFilingSystem"]
        fast_track_courts = document["FastTrackCourts"]
        
        return {
            "e_filing_system": {
                "description": e_filing_system["description"],
                "features": e_filing_system["features"],
                "department": e_filing_system["department"],
                "initiatives": e_filing_system["initiatives"],
                "prompt": e_filing_system["prompt"]
            },
            "fast_track_courts": {
                "timeline": fast_track_courts["timeline"],
                "process": fast_track_courts["process"]
            }
        }
    else:
        return {"error": "Could not retrieve eFiling System and Fast Track Courts information."}
@tool
def get_telelaw_services_info() -> dict:
    '''Return information about TeleLaw Services.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["TeleLawServices"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        telelaw_services = document["TeleLawServices"]
        telelaw = document["TeleLaw"]
        telelaw_contact_info = document["TeleLawContactInfo"]
        
        return {
            "telelaw_services": {
                "description": telelaw_services["description"],
                "launchYear": telelaw_services["launchYear"],
                "accessibility": telelaw_services["accessibility"],
                "process": telelaw_services["process"],
            },
            "telelaw": {
                "description": telelaw["description"],
                "connectingProcess": telelaw["connectingProcess"],
                "features": telelaw["features"],
                "launchYear": telelaw["launchYear"],
                "currentStatus": telelaw["currentStatus"],
            },
            "contact_info": telelaw_contact_info
        }
    else:
        return {"error": "Could not retrieve TeleLaw Services information."}
@tool
def get_traffic_fine_procedures_info() -> dict:
    '''Return information about Traffic Fine Procedures.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["TrafficFineProcedures"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        traffic_fine_procedures = document["TrafficFineProcedures"]
        
        return {
            "paying_fines_online": traffic_fine_procedures["PayingTrafficFinesOnline"],
            "contesting_fines": traffic_fine_procedures["ContestingTrafficChallanFines"],
            "consequences_of_non_payment": traffic_fine_procedures["ConsequencesOfNonPayment"],
        }
    else:
        return {"error": "Could not retrieve Traffic Fine Procedures information."}
@tool
def get_court_live_stream_info() -> dict:
    '''Return information about Courts and their live streaming cases.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["CourtsDesc_LiveStreams"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        courts_info = document["Courts"]
        live_stream_cases = document["Know about which cases are eligible for live streaming. (Send latest 5)"]
        
        # Get latest 5 live streaming cases
        latest_cases = sorted(live_stream_cases.items(), key=lambda x: x[0], reverse=True)[:5]
        
        return {
            "supreme_court": {
                "name": courts_info["SupremeCourt"]["Name"],
                "link": courts_info["SupremeCourt"]["Link"]
            },
            "high_courts": [
                {
                    "name": hc["Name"],
                    "link": hc["Link"]
                } for hc in courts_info["HighCourts"]
            ],
            "latest_live_stream_cases": [
                {"date": case[1]["date"], "link": case[1]["link"]} for case in latest_cases
            ]
        }
    else:
        return {"error": "Could not retrieve court live stream information."}
@tool
def get_free_legal_aid_info() -> dict:
    '''Return information about Free Legal Aid Services in India.'''

    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["FreeLegalAidServices"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        free_legal_aid_info = document["FreeLegalAidServices"]
        
        return {
            "overview": free_legal_aid_info["Overview"],
            "functions": free_legal_aid_info["Functions"]["MainFunctions"],
            "free_legal_services": free_legal_aid_info["FreeLegalServices"]["servicesIncluded"],
            "eligibility": free_legal_aid_info["FreeLegalServices"]["Eligibility"],
            "lok_adalats": free_legal_aid_info["LokAdalats"],
            "legal_awareness_programs": free_legal_aid_info["LegalAwarenessPrograms"],
            "grant_in_aid": free_legal_aid_info["GrantInAid"]
        }
    else:
        return {"error": "Could not retrieve information about free legal aid services."}
@tool
def get_rti_and_financial_assistance_info() -> dict:
    '''Return information about RTI application process and financial assistance for legal cases.'''

    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["RTI_Application_and_Financial_assistance"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        rti_info = document["RTIApplicationProcess"]
        financial_assistance_info = document["FinancialAssistanceForLegalCases"]
        
        return {
            "rti_filing_methods": rti_info["FilingMethods"],
            "financial_assistance": financial_assistance_info
        }
    else:
        return {"error": "Could not retrieve RTI application and financial assistance information."}
@tool
def get_judicial_reform_info() -> dict:
    '''Return information about judicial reforms in India.'''
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb+srv://ice:9EUFPlE499todrIr@doj.y9b1r.mongodb.net/?retryWrites=true&w=majority&appName=DOJ")
    db = client["DojChatbot"]
    collection = db["ComprehensiveJudicialReformsIndia"]
    
    # Fetch the document
    document = collection.find_one()
    
    if document:
        reforms_info = document["JudicialReforms"]
        centrally_sponsored_scheme = document["CentrallySponsoredScheme"]
        national_mission = document["NationalMission"]
        
        return {
            "judicial_reforms": reforms_info,
            "centrally_sponsored_scheme": centrally_sponsored_scheme,
            "national_mission": national_mission,
            "steps_for_timely_enforcement": document["StepsForTimelyEnforcement"],
            "action_research_scheme": document["ActionResearchScheme"],
            "rule_of_law_index": document["RuleOfLawIndex"],
            "data_governance_quality_index": document["DataGovernanceQualityIndex"]
        }
    else:
        return {"error": "Could not retrieve judicial reform information."}

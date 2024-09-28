from langchain_core.tools import tool
import inspect
from bot_tools import (
    check_divisions,
    get_judicial_infrastructure_scheme,
    get_doj_functions_responsibilities,
    get_free_legal_aid_info,
    get_case_resolution_time,
    get_disposal_last_month_cases,
    get_instituted_last_month_cases,
    get_instituted_current_year_cases,
    get_coram_wise_pending_cases,
    get_cases_info,
    get_ac_info,
    get_case_statistics,
    get_traffic_violation_payments,
    get_judicial_system_and_vacancies,
    get_judicial_system_info,
    get_ecourts_info,
    get_ecourts_app_info,
    get_judgment_search_and_fast_track_info,
    get_efiling_and_fast_track_info,
    get_telelaw_services_info,
    get_traffic_fine_procedures_info,
    get_court_live_stream_info,
    get_rti_and_financial_assistance_info,
    get_judicial_reform_info,
    search_judicial_appointments
)

def get_tool_info(tool_name: str):
    """Return information about a specific tool."""
    tool_functions = [
        check_divisions,
        get_judicial_infrastructure_scheme,
        get_doj_functions_responsibilities,
        get_free_legal_aid_info,
        get_case_resolution_time,
        get_disposal_last_month_cases,
        get_instituted_last_month_cases,
        get_instituted_current_year_cases,
        get_coram_wise_pending_cases,
        get_cases_info,
        get_ac_info,
        get_case_statistics,
        get_traffic_violation_payments,
        get_judicial_system_and_vacancies,
        get_judicial_system_info,
        get_ecourts_info,
        get_ecourts_app_info,
        get_judgment_search_and_fast_track_info,
        get_efiling_and_fast_track_info,
        get_telelaw_services_info,
        get_traffic_fine_procedures_info,
        get_court_live_stream_info,
        get_free_legal_aid_info,
        get_rti_and_financial_assistance_info,
        get_judicial_reform_info,
        search_judicial_appointments
    ]

    # Iterate through the tool functions to find the specific tool
    for tool in tool_functions:
        if tool.name == tool_name:
            func_doc = tool.description or "No description available."
            tool_input = {}  # Prepare input for the tool if needed

            # Attempt to invoke the tool
            try:
                func_data = tool.invoke(tool_input)  # Use invoke with appropriate input
                return {
                    "tool_name": tool_name,
                    "description": func_doc,
                    "data": func_data
                }
            except Exception as e:
                return {
                    "tool_name": tool_name,
                    "description": func_doc,
                    "error": f"Error retrieving data: {str(e)}"
                }
    
    # If the tool was not found, return a message
    return {"error": f"Tool '{tool_name}' not found."}

# Example usage
# if __name__ == "__main__":
#     specific_tool_name = "get_judicial_system_info"  # Replace with the desired tool name
#     tool_info = get_tool_info(specific_tool_name)
#     print(tool_info)

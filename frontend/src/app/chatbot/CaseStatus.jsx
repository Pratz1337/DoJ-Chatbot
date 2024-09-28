import React, { useState } from 'react';
import axios from 'axios';

function CaseStatusChecker() {
  const [cino, setCino] = useState('');
  const [caseDetails, setCaseDetails] = useState(null);
  const [llmResponse, setLlmResponse] = useState(null);  // For storing LLM response
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCaseDetails(null);
    setLlmResponse(null);  // Reset LLM response on new request

    try {
      const response = await axios.post('http://localhost:5000/check-case-status', { cino });
      setCaseDetails(response.data.extracted_info);  // Extracted details from the backend
      setLlmResponse(response.data.llm_response);  // LLM-generated response
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Case Status Checker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cino}
          onChange={(e) => setCino(e.target.value)}
          placeholder="Enter CINO"
          required
        />
        <button type="submit">Check Status</button>
      </form>
      
      {llmResponse && (
        <div>
          <h3>LLM Generated Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            {llmResponse}
          </pre>
        </div>
      )}
    </div>
  );
}

export default CaseStatusChecker;

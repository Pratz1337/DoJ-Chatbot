'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { Loader2 } from "lucide-react"

interface CaseStatusCheckerProps {
  isDarkMode: boolean
}

export default function CaseStatusChecker({ isDarkMode }: CaseStatusCheckerProps) {
  const [cino, setCino] = useState('')
  const [caseDetails, setCaseDetails] = useState<any>(null)
  const [llmResponse, setLlmResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCaseDetails(null)
    setLlmResponse(null)
    setIsLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/check-case-status', { cino })
      setCaseDetails(response.data.extracted_info)
      setLlmResponse(response.data.llm_response)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An error occurred')
      } else {
        setError('An error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`max-w-2xl mx-auto p-6 space-y-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className={`text-2xl font-bold text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Case Status Checker</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={cino}
          onChange={(e) => setCino(e.target.value)}
          placeholder="Enter CNR NUMBER"
          required
          className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700 text-black' : 'bg-white text-gray-800'}`}
        />
        <Button 
          type="submit" 
          className={`w-full ${
            isDarkMode 
              ? 'bg-indigo-700 hover:bg-blue-700 text-white' 
              : 'bg-indigo-700 hover:bg-blue-600 text-white'
          }`} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Checking Status...
            </>
          ) : (
            'Check Status'
          )}
        </Button>
      </form>
      
      {isLoading && (
        <div className="text-center">
          <Loader2 className={`h-8 w-8 animate-spin mx-auto ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Generating response...</p>
        </div>
      )}
      
      {llmResponse && !isLoading && (
        <div className="mt-6">
          <pre className={`whitespace-pre-wrap p-4 rounded-md ${
            isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
          }`}>
            {llmResponse}
          </pre>
        </div>
      )}
      
      {error && !isLoading && (
        <div className={`mt-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
          {error}
        </div>
      )}
    </div>
  )
}
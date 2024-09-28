'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { Loader2 } from "lucide-react"

export default function CaseStatusChecker() {
  const [cino, setCino] = useState('')
  const [caseDetails, setCaseDetails] = useState(null)
  const [llmResponse, setLlmResponse] = useState(null)
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Case Status Checker</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={cino}
          onChange={(e) => setCino(e.target.value)}
          placeholder="Enter CNR NUMBER"
          required
          className="w-full"
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              
              Checking Status...
            </>
          ) : (
            'Check Status'
          )}
        </Button>
      </form>
      
      {isLoading && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Generating response...</p>
        </div>
      )}
      
      {llmResponse && !isLoading && (
        <div className="mt-6">
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md">
            {llmResponse}
          </pre>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="mt-6 text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}
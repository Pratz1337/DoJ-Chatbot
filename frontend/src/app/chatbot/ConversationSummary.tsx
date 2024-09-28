"use client"

import React, { useState } from "react"
import { Button } from "@nextui-org/button"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { saveAs } from "file-saver"
import { Spinner } from "@nextui-org/react"

interface ConversationSummaryProps {
  conversationHistory: Array<{ user: string; bot: string }>
  isDarkMode: boolean
}

const ConversationSummary: React.FC<ConversationSummaryProps> = ({
  conversationHistory,
  isDarkMode,
}) => {
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateSummary = async () => {
    if (conversationHistory.length === 0) {
      toast.error("No conversation history available to summarize.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation: conversationHistory }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSummary(data.summary)
      toast.success("Summary generated successfully!")
    } catch (error) {
      console.error("Error generating summary:", error)
      toast.error("Failed to generate summary.")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadSummary = async () => {
    try {
      const response = await fetch("http://localhost:5000/download-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      saveAs(blob, "conversation_summary.pdf")
      toast.success("Summary downloaded successfully!")
    } catch (error) {
      console.error("Error downloading summary:", error)
      toast.error("Failed to download summary.")
    }
  }

  const formatSummary = (summaryText: string) => {
    const formatted = summaryText.split("\n").map((line, index) => {
      if (line.startsWith("##")) {
        return (
          <h2
            key={index}
            className={`text-2xl font-bold mt-4 mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {line.replace("##", "").trim()}
          </h2>
        )
      } else if (line.startsWith("**")) {
        return (
          <h3
            key={index}
            className={`text-xl font-semibold mb-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {line.replace("**", "").trim()}
          </h3>
        )
      } else if (line.startsWith("*")) {
        return (
          <p
            key={index}
            className={`ml-4 text-base ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {line.replace("*", "").trim()}
          </p>
        )
      } else {
        return (
          <p
            key={index}
            className={`text-base ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {line}
          </p>
        )
      }
    })
    return formatted
  }

  return (
    <div
      className={`p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-6 border ${
        isDarkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      <h2
        className={`text-3xl font-semibold mb-4 ${
          isDarkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Conversation Summary
      </h2>
      <Button
        onClick={generateSummary}
        disabled={isLoading}
        className={`${
          isDarkMode
            ? "bg-indigo-700 hover:bg-indigo-800"
            : "bg-indigo-600 hover:bg-indigo-700"
        } text-white rounded-md px-4 py-2`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Spinner size="sm" /> <span className="ml-2">Generating...</span>
          </span>
        ) : (
          "Generate Summary"
        )}
      </Button>
      {summary && (
        <div
          className={`mt-6 p-4 border rounded-lg ${
            isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-300"
          }`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${
              isDarkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            Summary:
          </h3>
          <div className="space-y-4">{formatSummary(summary)}</div>
          <Button
            onClick={downloadSummary}
            className={`mt-4 text-white rounded-md px-4 py-2 ${
              isDarkMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Download Summary
          </Button>
        </div>
      )}
      <ToastContainer
        theme={isDarkMode ? "dark" : "light"}
        position="bottom-right"
      />
    </div>
  )
}

export default ConversationSummary
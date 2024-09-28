"use client"

import { useState, useEffect } from 'react'
import { Card, CardBody } from "@nextui-org/card"

export default function LegalResources({ isDarkMode }: { isDarkMode: boolean }) {
  const [showLegalResources, setShowLegalResources] = useState(false)

  useEffect(() => {
    if (showLegalResources) {
      animateCount(65361, 2000, 'count1')
      animateCount(17813, 2000, 'count2')
      animateCount(83174, 2000, 'count3')
    }
  }, [showLegalResources])

  const animateCount = (target: number, duration: number, elementId: string) => {
    const start = 0
    const end = target
    const increment = Math.ceil(end / (duration / 100))
    let currentCount = start
    const countElement = document.getElementById(elementId)

    const interval = setInterval(() => {
      currentCount += increment
      if (currentCount >= end) {
        if (countElement) countElement.innerText = end.toString()
        clearInterval(interval)
      } else {
        if (countElement) countElement.innerText = currentCount.toString()
      }
    }, 100)
  }

  return (
    <div className={`space-y-4 ${isDarkMode ? 'dark' : ''}`}>
      <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Legal Resources</h2>
      {!showLegalResources ? (
        <button
          onClick={() => setShowLegalResources(true)}
          className={`px-4 py-2 bg-indigo-700 text-white rounded hover:bg-blue-600 transition-colors ${
            isDarkMode ? 'dark:bg-indigo-700 dark:hover:bg-blue-800' : ''
          }`}
        >
          Show Legal Resources
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {['Pending Civil Cases', 'Pending Criminal Cases', 'Total Pending Cases'].map((title, index) => (
            <Card key={index} className={isDarkMode ? 'dark:bg-gray-800' : 'bg-white'}>
              <CardBody className="p-4">
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {title}: <span id={`count${index + 1}`} className={isDarkMode ? 'text-blue-300' : 'text-blue-600'}>0</span>
                </h3>
                <svg width="100%" height="126" xmlns="http://www.w3.org/2000/svg" version="1.1" className="apexcharts-svg">
                  <defs>
                    <linearGradient id={`SvgjsLinearGradient${1678 + index}`} x1="1" y1="0" x2="0" y2="1">
                      <stop stopOpacity="1" stopColor={`rgba(${4 + index * 40},${204 - index * 20},${157 + index * 10},1)`} offset="0"></stop>
                      <stop stopOpacity="1" stopColor={`rgba(${104 + index * 20},${224 - index * 10},${196 + index * 5},1)`} offset="0.5"></stop>
                      <stop stopOpacity="1" stopColor={`rgba(${104 + index * 20},${224 - index * 10},${196 + index * 5},1)`} offset="0.53"></stop>
                      <stop stopOpacity="1" stopColor={`rgba(${4 + index * 40},${204 - index * 20},${157 + index * 10},1)`} offset="0.91"></stop>
                    </linearGradient>
                  </defs>
                  <g transform="translate(24.58333333333333, 5)">
                    <g className="apexcharts-radialbar">
                      <g className="apexcharts-tracks">
                        <g className="apexcharts-radialbar-track apexcharts-track">
                          <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 198.84146341463418 120.41666666666667" fill="none" fillOpacity="1" stroke={isDarkMode ? "rgba(75,75,75,0.85)" : "rgba(231,231,231,0.85)"} strokeOpacity="1" strokeLinecap="butt" strokeWidth="23.638821138211387" strokeDasharray="0" className="apexcharts-radialbar-area"></path>
                        </g>
                      </g>
                      <g className="apexcharts-series apexcharts-radial-series">
                        <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 80.46005912774442 57.47215747399677" fill="none" fillOpacity="0.85" stroke={`url(#SvgjsLinearGradient${1678 + index})`} strokeOpacity="1" strokeLinecap="butt" strokeWidth="24.369918699186996" strokeDasharray="0" className="apexcharts-radialbar-area apexcharts-radialbar-slice-0"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
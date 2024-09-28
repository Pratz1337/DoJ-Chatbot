"use client"

import { useState, useEffect } from 'react'
import { Card, CardBody} from "@nextui-org/card"

export default function LegalResources() {
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
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Legal Resources</h2>
      {!showLegalResources ? (
        <button
          onClick={() => setShowLegalResources(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Show Legal Resources
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-black">
          <Card>
            <CardBody className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-black">Pending Civil Cases: <span id="count1">0</span></h3>
              <svg width="100%" height="126" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" className="apexcharts-svg" transform="translate(0, -10)" style={{background: 'transparent'}}>
                <g className="apexcharts-inner apexcharts-graphical" transform="translate(24.58333333333333, 5)">
                  <defs>
                    <linearGradient id="SvgjsLinearGradient1678" x1="1" y1="0" x2="0" y2="1">
                      <stop id="SvgjsStop1679" stopOpacity="1" stopColor="rgba(4,204,157,1)" offset="0"></stop>
                      <stop id="SvgjsStop1680" stopOpacity="1" stopColor="rgba(104,224,196,1)" offset="0.5"></stop>
                      <stop id="SvgjsStop1681" stopOpacity="1" stopColor="rgba(104,224,196,1)" offset="0.53"></stop>
                      <stop id="SvgjsStop1682" stopOpacity="1" stopColor="rgba(4,204,157,1)" offset="0.91"></stop>
                    </linearGradient>
                  </defs>
                  <g className="apexcharts-radialbar">
                    <g className="apexcharts-tracks">
                      <g className="apexcharts-radialbar-track apexcharts-track">
                        <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 198.84146341463418 120.41666666666667" fill="none" fillOpacity="1" stroke="rgba(231,231,231,0.85)" strokeOpacity="1" strokeLinecap="butt" strokeWidth="23.638821138211387" strokeDasharray="0" className="apexcharts-radialbar-area" data-pathOrig="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 198.84146341463418 120.41666666666667"></path>
                      </g>
                    </g>
                    <g className="apexcharts-series apexcharts-radial-series" >
                      <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 80.46005912774442 57.47215747399677" fill="none" fillOpacity="0.85" stroke="url(#SvgjsLinearGradient1678)" strokeOpacity="1" strokeLinecap="butt" strokeWidth="24.369918699186996" strokeDasharray="0" className="apexcharts-radialbar-area apexcharts-radialbar-slice-0" dataAngle="56" dataValue="31.18" index="0" j="0" dataPathOrig="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 80.46005912774442 57.47215747399677"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-black">Pending Criminal Cases: <span id="count2">0</span></h3>
              <svg width="100%" height="126" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" className="apexcharts-svg" xmlnsData="ApexChartsNS" transform="translate(0, -10)" style={{background: 'transparent'}}>
                <g className="apexcharts-inner apexcharts-graphical" transform="translate(24.58333333333333, 5)">
                  <defs>
                    <linearGradient id="SvgjsLinearGradient1719" x1="1" y1="0" x2="0" y2="1">
                      <stop id="SvgjsStop1720" stopOpacity="1" stopColor="rgba(16,162,194,1)" offset="0"></stop>
                      <stop id="SvgjsStop1721" stopOpacity="1" stopColor="rgba(112,199,218,1)" offset="0.5"></stop>
                      <stop id="SvgjsStop1722" stopOpacity="1" stopColor="rgba(112,199,218,1)" offset="0.53"></stop>
                      <stop id="SvgjsStop1723" stopOpacity="1" stopColor="rgba(16,162,194,1)" offset="0.91"></stop>
                    </linearGradient>
                  </defs>
                  <g className="apexcharts-radialbar">
                    <g className="apexcharts-tracks">
                      <g className="apexcharts-radialbar-track apexcharts-track" >
                        <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 198.84146341463418 120.41666666666667" fill="none" fillOpacity="1" stroke="rgba(231,231,231,0.85)" strokeOpacity="1" strokeLinecap="butt" strokeWidth="23.638821138211387" strokeDasharray="0" className="apexcharts-radialbar-area" data-pathOrig="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 198.84146341463418 120.41666666666667"></path>
                      </g>
                    </g>
                    <g className="apexcharts-series apexcharts-radial-series">
                      <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 107.13101379980205 46.15100889144041" fill="none" fillOpacity="0.85" stroke="url(#SvgjsLinearGradient1719)" strokeOpacity="1" strokeLinecap="butt" strokeWidth="24.369918699186996" strokeDasharray="0" className="apexcharts-radialbar-area apexcharts-radialbar-slice-0" dataAngle="78" dataValue="43.39" index="0" j="0" dataPathOrig="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 107.13101379980205 46.15100889144041"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-black">Total Pending Cases: <span id="count3">0</span></h3>
              <svg width="100%" height="126" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsSvgjs="http://svgjs.com/svgjs" className="apexcharts-svg" xmlnsData="ApexChartsNS" transform="translate(0, -10)" style={{background: 'transparent'}}>
                <g className="apexcharts-inner apexcharts-graphical" transform="translate(24.58333333333333, 5)">
                  <defs>
                    <linearGradient id="SvgjsLinearGradient1760" x1="1" y1="0" x2="0" y2="1">
                      <stop id="SvgjsStop1761" stopOpacity="1" stopColor="rgba(80,88,171,1)" offset="0"></stop>
                      <stop id="SvgjsStop1762" stopOpacity="1" stopColor="rgba(150,155,205,1)" offset="0.5"></stop>
                      <stop id="SvgjsStop1763" stopOpacity="1" stopColor="rgba(150,155,205,1)" offset="0.53"></stop>
                      <stop id="SvgjsStop1764" stopOpacity="1" stopColor="rgba(80,88,171,1)" offset="0.91"></stop>
                    </linearGradient>
                  </defs>
                  <g className="apexcharts-radialbar">
                    <g className="apexcharts-tracks">   
                      <g className="apexcharts-radialbar-track apexcharts-track">
                        <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 198.84146341463418 120.41666666666667" fill="none" fillOpacity="1" stroke="rgba(231,231,231,0.85)" strokeOpacity="1" strokeLinecap="butt" strokeWidth="23.638821138211387" strokeDasharray="0" className="apexcharts-radialbar-area" data-pathOrig="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 198.84146341463418 120.41666666666667"></path>
                      </g>
                    </g>
                    <g className="apexcharts-series apexcharts-radial-series" >
                      <path d="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 86.10759478800423 54.01134317034119" fill="none" fillOpacity="0.85" stroke="url(#SvgjsLinearGradient1760)" strokeOpacity="1" strokeLinecap="butt" strokeWidth="24.369918699186996" strokeDasharray="0" className="apexcharts-radialbar-area apexcharts-radialbar-slice-0" dataAngle="61" dataValue="33.79" index="0" j="0" dataPathOrig="M 46.99186991869918 120.41666666666666 A 75.92479674796749 75.92479674796749 0 0 1 86.10759478800423 54.01134317034119"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
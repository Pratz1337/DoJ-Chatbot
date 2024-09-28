"use client"

import { useState } from "react"
import { Card, CardBody } from "@nextui-org/card"
import { Button } from "@nextui-org/button"

interface FineProcedure {
  title: string
  online: React.ReactNode
  offline: React.ReactNode
  documents: Array<{ name: string; link?: string }>
}

const fineProcedures: FineProcedure[] = [
  {
    title: "Traffic Violations",
    online: (
      <>
        1. Visit the{" "}
        <a
          href="https://echallan.parivahan.gov.in/index/accused-challan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          official E-Challan tracker & payment portal
        </a>
        .<br />
        2. Enter your Challan number / vehicle number / DL number and
        violation details. <br />
        3. Review the fine amount and details. <br />
        4. Proceed to payment using your preferred method (credit card, net
        banking). <br />
        5. Save the payment receipt for your records.
      </>
    ),
    offline: (
      <>
        1. Visit your local traffic police station with the necessary
        documents.
        <br />
        2. Fill out the Traffic Violation Form.
        <br />
        3. Submit the form along with any supporting documents (e.g., license,
        vehicle registration).
        <br />
        4. Make the payment at the station and obtain a receipt.
      </>
    ),
    documents: [
      {
        name: "Driving License",
        link: "https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do",
      },
      {
        name: "Vehicle Registration Certificate",
        link: "https://vahan.parivahan.gov.in/vahanservice/vahan/ui/onlineservice/form_print_Rc.xhtml",
      },
      {
        name: "Address and identity proof (Aadhar, Pan card etc...)",
        link: "https://www.digilocker.gov.in/",
      },
    ],
  },
  {
    title: "Corporate Fine / Penalty",
    online: (
      <>
        1. Visit the{" "}
        <a
          href="https://www.mca.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Ministry of Corporate Affairs (MCA) portal
        </a>
        .<br />
        2. Navigate to "Forms & Downloads" and choose the appropriate forms
        (e.g., GNL-1, AOC-4).
        <br />
        3. Fill out the required forms with details of the offense and
        supporting documents.
        <br />
        4. Submit the form online and make the payment via credit card, net
        banking, or debit card.
        <br />
        5. Save the acknowledgment and payment receipt for future reference.
      </>
    ),
    offline: (
      <>
        1. Visit the nearest Regional Director (RD) or Registrar of Companies
        (ROC) office.
        <br />
        2. Submit the relevant forms (e.g., GNL-1, AOC-4) along with required
        documents like board resolutions, AGM details, and violation notices.
        <br />
        3. Pay the fine/penalty in person at the office and collect a receipt.
        <br />
        4. Retain the receipt and filed documents for future reference.
      </>
    ),
    documents: [
      {
        name: "Form GNL-1 (for compounding offenses)",
        link: "https://www.mca.gov.in/",
      },
      {
        name: "Form AOC-4 (for financial statement filings)",
        link: "https://www.mca.gov.in/",
      },
      {
        name: "Board Resolution",
        link: "https://www.mca.gov.in/",
      },
      {
        name: "Annual General Meeting details",
        link: "https://www.mca.gov.in/",
      },
    ],
  },
  {
    title: "Individual Fines",
    online: (
      <>
        1. Visit the{" "}
        <a
          href="https://services.ecourts.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          eCourt Services portal
        </a>
        . Or you can proceed with an alternative{" "}
        <a
          href="https://pay.ecourts.gov.in/epay/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          payment portal
        </a>
        .<br />
        2. Select your state or district and enter details like CNR number,
        case registration number, or party name.
        <br />
        3. Follow the instructions to view the fine details and proceed with
        payment.
        <br />
        4. Choose a payment method such as net banking or UPI.
        <br />
        5. Download the payment receipt for your records.
      </>
    ),
    offline: (
      <>
        1. Visit your local court or government office. <br />
        2. Request the "Individual Fine Payment Form." <br />
        3. Fill in the form with required personal details and attach the
        necessary documents. <br />
        4. Make the payment at the designated counter and collect the receipt.
      </>
    ),
    documents: [
      {
        name: "None",
      },
    ],
  },
]

export default function FineProceduresTab({ isDarkMode }: { isDarkMode: boolean }) {
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null)

  const handleSelectProcedure = (procedure: string) => {
    setSelectedProcedure(procedure)
  }

  return (
    <div className={`space-y-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex flex-wrap justify-center gap-2 mb-4  ">
        {fineProcedures.map((fine) => (
          <Button
            key={fine.title}
            onClick={() => handleSelectProcedure(fine.title)}
            variant={selectedProcedure === fine.title ? "solid" : "bordered"}
            className={`px-4 py-2 text-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {fine.title}
          </Button>
        ))}
      </div>

      {selectedProcedure && (
        <Card className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}>
          <CardBody className="p-6">
            {fineProcedures
              .filter((fine) => fine.title === selectedProcedure)
              .map((fine) => (
                <div key={fine.title}>
                  <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    {fine.title}
                  </h2>

                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-200' : 'text-blue-500'} mt-4 mb-2`}>
                    Online Procedure:
                  </h3>
                  <div className="mb-4">{fine.online}</div>

                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-200' : 'text-blue-500'} mt-4 mb-2`}>
                    Offline Procedure:
                  </h3>
                  <div className="mb-4">{fine.offline}</div>

                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-200' : 'text-blue-500'} mt-4 mb-2`}>
                    Required Documents:
                  </h3>
                  <ul className="list-disc ml-6">
                    {fine.documents.map((doc, index) => (
                      <li key={index}>
                        {doc.name}
                        {doc.link && (
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-500 hover:underline"
                          >
                            (Link)
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </CardBody>
        </Card>
      )}
    </div>
  )
}
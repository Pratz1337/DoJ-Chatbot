import { useState, useEffect } from "react";

// Custom hook to detect dark mode preference
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the user has a dark mode preference set in their system
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDarkMode;
};

const FineProceduresTab = () => {
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(
    null
  );
  const isDarkMode = useDarkMode(); // Get the dark mode status

  const fineProcedures = [
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
  ];

  const handleSelectProcedure = (procedure: string) => {
    setSelectedProcedure(procedure);
  };

  return (
    <div>
      {/* Tabs for selecting procedures */}
      <div className="flex justify-center mb-4">
        {fineProcedures.map((fine) => (
          <button
            key={fine.title}
            onClick={() => handleSelectProcedure(fine.title)}
            className="mx-2 px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-all border-2 border-white"
          >
            {fine.title}
          </button>
        ))}
      </div>

      {/* Display the selected procedure */}
      {selectedProcedure && (
        <div
        className={`p-6 rounded-lg shadow-lg max-w-3xl mx-auto ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
          {fineProcedures
            .filter((fine) => fine.title === selectedProcedure)
            .map((fine) => (
              <div key={fine.title}>
                <h2 className="text-2xl font-bold mb-4 text-indigo-800">
                  {fine.title}
                </h2>

                <h3 className="text-xl font-semibold text-indigo-700">
                  Online Procedure:
                </h3>
                <div className="mb-4">{fine.online}</div>

                <h3 className="text-xl font-semibold text-indigo-700">
                  Offline Procedure:
                </h3>
                <div className="mb-4">{fine.offline}</div>

                <h3 className="text-xl font-semibold text-indigo-700">
                  Required Documents:
                </h3>
                <ul className="list-disc ml-6">
                  {fine.documents.map(
                    (doc: { name: string; link?: string }, index) => (
                      <li key={index}>
                      {doc.name}
                        {"link" in doc && doc.link && (
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
                    )
                  )}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FineProceduresTab;

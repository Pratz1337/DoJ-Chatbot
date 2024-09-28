'use client'
import { Button } from "@nextui-org/button"
import { useState} from "react"
import { Card, CardBody } from "@nextui-org/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import {Scale, Sun, Moon, Building, FileText, Upload, Book, Video, CreditCard} from "lucide-react"



export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

const toggleTheme = () => {
  setIsDarkMode(!isDarkMode)
}
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#003366] bg-opacity-95 text-white py-4 sticky top-0 z-50">
  <div className="container mx-auto px-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <Scale className="h-[30px] w-[30px]" />
      <span className="text-xl font-semibold px-3">Department of Justice</span>
    </div>
    <nav>
      <Button
        onClick={toggleTheme}
        className="ml-2 w-12 h-12 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 text-white"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun size={25} /> : <Moon size={25} />}
      </Button>
    </nav>
  </div>
</header>

      <main className="flex-grow">
        <section className={` bg-gradient-to-r from-blue-600 to-blue-800 ${isDarkMode?"text-white":"text-black"} py-20`}>
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-3/4 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 ml-10">Meet Your DoJ Virtual Assistant</h1>
              <p className="text-xl ml-10 mb-6">Experience a smarter, more efficient way to interact with the Department of Justice (DoJ). Our AI-powered virtual assistant is designed to simplify your access to legal services, information, and court-related queries.</p>
              <div className="flex justify-center">
                <Link href="/chatbot">
                  <Button size="lg" className="bg-white text-blue-600 font-bold hover:bg-blue-100">
                    Start chat now!
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image src="/images/the_bot.gif" alt="AI Chatbot Illustration" width={300} height={300} className="rounded-full bg-white p-2" />
            </div>
          </div>
        </section>

        <section className={`py-16 ${isDarkMode?"text-white bg-gray-900":"bg-gray-100 text-black"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "DoJ Divisions Info", icon: <Building className="w-10 h-10" /> },
                { title: "Case Updates", icon: <FileText className="w-10 h-10" /> },
                { title: "e-Filing Guidance", icon: <Upload className="w-10 h-10" /> },
                { title: "Legal Resources", icon: <Book className="w-10 h-10" /> },
                { title: "Court Streaming", icon: <Video className="w-10 h-10" /> },
                { title: "Fine Payments", icon: <CreditCard className="w-10 h-10" /> },
              ].map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardBody className={`pt-6 ${isDarkMode?"bg-gray-800":"bg-white"}`}>
                    <div className="rounded-full text-blue-600 p-3 w-12 h-12 mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 self-center ${isDarkMode?"text-white":"text-black"}`}>{feature.title}</h3>
                    <p className={`${isDarkMode?"text-gray-400":"text-gray-600"}`}>Access information quickly and easily through our AI assistant.</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className={`py-16 ${isDarkMode?"text-white bg-gray-900":"text-black bg-white"}`}>
          <div className={`container mx-auto px-4`}>
            <h2 className={`text-3xl ${isDarkMode?"text-white":"text-black"}  font-bold text-center mb-12`}>How It Works</h2>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
              {[
                { step: 1, title: "Ask Your Query", description: "Type your query or select from common questions." },
                { step: 2, title: "Get Instant Answers", description: "Our AI provides accurate and up-to-date information." },
                { step: 3, title: "Explore Additional Resources", description: "Get links to relevant forms, documents, and services." },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center max-w-xs">
                  <div className="rounded-full bg-blue-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`py-16 ${isDarkMode?"bg-gray-900 text-white":"bg-gray-100"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of Using Our AI Assistant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "24/7 Availability", description: "Get help anytime, day or night." },
                { title: "Instant Information", description: "No more waiting for answers to your queries." },
                { title: "Reduced Wait Times", description: "Skip long phone queues and get instant assistance." },
                { title: "Accurate & Up-to-date", description: "Our AI is constantly updated with the latest information." },
                { title: "Easy Navigation", description: "Find the right resources and services effortlessly." },
                { title: "Multilingual Support", description: "Get assistance in multiple languages." },
              ].map((benefit, index) => (
                <Card key={index}>
                  <CardBody className={`pt-6 ${isDarkMode?"bg-gray-800":"bg-white"}`}>
                    <h3 className={`font-semibold text-lg mb-2 self-center ${isDarkMode?"text-white ":"text-black "}`}>{benefit.title}</h3>
                    <p className={`self-center ${isDarkMode?"text-gray-400":"text-gray-600"}`}>{benefit.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={` py-8 ${isDarkMode?"bg-gray-800 text-gray-200":"bg-gray-100 text-black"}`}>
          
          <div className={`mt-8 pt-8 border-t border-gray-800 text-center`}>
            <p>&copy; {new Date().getFullYear()} Department of Justice. All rights reserved.</p>
          </div>
        </footer>
    </div>
  )
}

"use client";
import FineProceduresTab from "./FineProceduresTab"; // Adjust the import path as needed
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText, Sun, Moon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./page.module.css";
import ConversationSummary from "./ConversationSummary"; // Adjust the import path as needed

const renderMessageContent = (content: any): JSX.Element => {
  if (typeof content === "string") {
    // Split by new lines and format
    const lines = content.split("\n").map((line, index) => {
      // Check if line is a heading (you can adjust the criteria for headings as needed)
      if (line.startsWith("**") && line.endsWith("**")) {
        const heading = line.replace(/\*\*/g, ""); // Remove the asterisks
        return (
          <h3 key={index} className="font-bold">
            {heading}
          </h3>
        );
      }
      return <p key={index}>{line}</p>;
    });
    return <div>{lines}</div>;
  } else if (Array.isArray(content)) {
    return (
      <ul>
        {content.map((item, index) => (
          <li key={index}>{renderMessageContent(item)}</li>
        ))}
      </ul>
    );
  } else if (typeof content === "object" && content !== null) {
    return (
      <div>
        {Object.entries(content).map(([key, value], index) => (
          <div key={index}>
            <strong>{key}: </strong>
            {renderMessageContent(value)}
          </div>
        ))}
      </div>
    );
  }
  return <p>{String(content)}</p>;
};

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to the Department of Justice AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [info, setInfo] = useState({
    title: "",
    description: "",
    details: {} as { [key: string]: string },
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // Track connection status

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const checkConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/chat");
      if (response.ok) {
        setConnectionStatus("connected"); // Update state based on response
      } else {
        setConnectionStatus("disconnected");
      }
    } catch (error) {
      setConnectionStatus("disconnected");
    }
  };

  useEffect(() => {
    checkConnection(); // Check connection on load
    const intervalId = setInterval(checkConnection, 10000); // Check connection every 10 seconds
    return () => clearInterval(intervalId);
  }, []);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ user: string; bot: string }>
  >([]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMsg = input;
      setMessages([...messages, { role: "user", content: userMsg }]);
      setInput("");

      try {
        const response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "user_1",
            message: userMsg,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botMsg = data.res.msg;

        // Update messages
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: botMsg,
          },
        ]);

        // Update conversation history
        setConversationHistory((prev) => [
          ...prev,
          { user: userMsg, bot: botMsg },
        ]);

        if (data.info) {
          setInfo({
            title: "Additional Information",
            description: "Details from the Department of Justice",
            details: data.info,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I'm sorry, but I encountered an error while processing your request: ${
              error instanceof Error
                ? error.message
                : "An unknown error occurred"
            }`,
          },
        ]);
      }
    }
  };
  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <header className="bg-[#0047AB] text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold">DoJ AI Assistant</h1>
          {/* Connection Status Indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"
              }`}
              title={`Connection Status: ${connectionStatus}`}
            ></div>
            <span className="text-sm">{connectionStatus}</span>
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleTheme}
              className={`border-hidden ${
                isDarkMode ? "text-black" : "text-white"
              }`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <Sun size={25} /> : <Moon size={25} />}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className={`border-hidden ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              <Scale className="h-[30px] w-[30px]" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className={`border-hidden ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              <FileText className="h-[30px] w-[30px]" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden p-6 space-x-6">
        <div className="flex-grow flex flex-col space-y-4 w-2/3">
          <Card
            className={`flex-grow transition-colors ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <CardBody className="p-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg transition-colors ${
                        message.role === "user"
                          ? "bg-blue-100 text-blue-900"
                          : isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardBody>
          </Card>
          <div className="flex space-x-2">
            <Input
              className={`flex-grow rounded-full px-4 py-2 border-none focus:outline-none ${styles.inputField}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>

        {/* Right Container: Info Card */}
        <Card
          className={`w-1/3 p-4 m-4 bg-white rounded-lg shadow-md text-black ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          style={{
            width: "29%",
            height: "94%",
            marginTop: "15px",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "1.2rem",
          }}
        >
          <CardHeader>
            <CardHeader className="font-black text-[50px] text-center align-middle items-center">
              Information
            </CardHeader>
          </CardHeader>
          <CardBody>
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-2 mb-[50px]">
                <TabsTrigger
                  value="summary"
                  className="rounded-lg border border-gray-400 mr-1 mb-2"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="fine-procedures"
                  className="rounded-lg border border-gray-400 mb-2"
                >
                  Fine Procedures
                </TabsTrigger>
                <TabsTrigger
                  value="rights-awareness"
                  className="rounded-lg border mr-1 border-gray-400"
                >
                  Know Your Rights
                </TabsTrigger>
                <TabsTrigger
                  value="legal-resources"
                  className="rounded-lg border border-gray-400"
                >
                  Legal Resources
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <h2 className="text-xl font-semibold mb-2">Summary</h2>
                <ConversationSummary
                  conversationHistory={conversationHistory}
                />{" "}
                {/* Pass the conversation history here */}
              </TabsContent>

              <TabsContent value="fine-procedures">
                <FineProceduresTab />
              </TabsContent>

              <TabsContent value="rights-awareness">
                <h2 className="text-xl font-semibold mb-2">Know Your Rights</h2>
                <p className="text-sm">
                  Learn about your rights when interacting with law enforcement.
                  Click{" "}
                  <a
                    href="/rights-awareness"
                    className="text-blue-500 hover:underline"
                  >
                    here
                  </a>{" "}
                  for more.
                </p>
              </TabsContent>

              <TabsContent value="legal-resources">
                <h2 className="text-xl font-semibold mb-2">Legal Resources</h2>
                <p className="text-sm">
                  Access various legal resources and forms. Visit the{" "}
                  <a
                    href="/legal-resources"
                    className="text-blue-500 hover:underline"
                  >
                    Legal Resources Hub
                  </a>
                  .
                </p>
              </TabsContent>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      <footer
        className={`py-4 px-6 text-center text-sm ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-600"
        }`}
      >
        <p>
          Department of Justice AI Assistant &copy; {new Date().getFullYear()}.
          All rights reserved.
        </p>
        <p>
          This is an AI assistant. For official legal advice, please consult
          with a qualified attorney.
        </p>
      </footer>
    </div>
  );
}

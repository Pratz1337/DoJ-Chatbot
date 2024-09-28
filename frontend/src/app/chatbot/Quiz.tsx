import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For animations
import { Switch } from "@headlessui/react"; // For dark mode switch

const questions = [
  {
    question: "All citizens of India are entitled to free legal aid, regardless of their financial status.",
    answer: false,
    explanation: "Under Article 39A of the Constitution, free legal aid is provided to underprivileged sections of society through NALSA."
  },
  {
    question: "You can file complaints related to criminal activities or civil disputes online through portals like eCourts Services.",
    answer: true,
    explanation: "Platforms like eCourts Services and Tele-Law allow citizens to file complaints online for easier access to justice services."
  },
  {
    question: "After being arrested, a person must be produced before a magistrate within 48 hours.",
    answer: false,
    explanation: "A person must be produced before a magistrate within 24 hours of arrest, excluding travel time."
  },
  // Add other questions similarly...
];

// Descriptions for each question, tied to the answer:
const detailedDescriptions = [
  "Under Article 39A, free legal aid is provided through NALSA to the underprivileged, including women, children, SC/STs, and the financially weak.",
  "You can file complaints related to criminal activities online via eCourts Services or Tele-Law, offering convenience from remote areas.",
  "The Constitution mandates that an arrested person must be presented before a magistrate within 24 hours of arrest, as per Article 22.",
  // Add more detailed descriptions similarly...
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    setTimerProgress(100);
    setTimeout(() => {
      setShowExplanation(true);
    }, 3000); // Delay to show explanation after 3 seconds
  };

  const nextQuestion = () => {
    setUserAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion(currentQuestion + 1);
    setTimerProgress(0);
  };

  useEffect(() => {
    if (userAnswer !== null) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 33;
        setTimerProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 1000);
    }
  }, [userAnswer]);

  return (
    <div
      className={`p-6 rounded-lg shadow-md w-full max-w-xl mx-auto transition-colors duration-500 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Know Your Rights Quiz</h2>
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          className={`${
            darkMode ? "bg-teal-500" : "bg-gray-300"
          } relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span className="sr-only">Enable dark mode</span>
          <span
            className={`${
              darkMode ? "translate-x-6" : "translate-x-1"
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
      </div>

      {/* Question Card */}
      {!showExplanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg"
        >
          <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
          <div className="flex space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(true)}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                userAnswer === true
                  ? "bg-green-500"
                  : userAnswer === false
                  ? "bg-red-500"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              True
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(false)}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                userAnswer === false
                  ? "bg-green-500"
                  : userAnswer === true
                  ? "bg-red-500"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              False
            </motion.button>
          </div>
          {/* Time slider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${timerProgress}%` }}
            transition={{ duration: 3 }}
            className="mt-4 h-2 rounded bg-green-500"
          />
        </motion.div>
      )}

      {/* Explanation & Detailed Description */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-6"
        >
          <p className={`text-lg font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
            {userAnswer === questions[currentQuestion].answer ? "Correct!" : "Wrong!"}
          </p>
          <p className="mt-2">{questions[currentQuestion].explanation}</p>
          <p className="mt-4 italic">
            {detailedDescriptions[currentQuestion]}
          </p>
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Next Question
            </button>
          ) : (
            <p className="mt-4 text-blue-500">Quiz Completed!</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;

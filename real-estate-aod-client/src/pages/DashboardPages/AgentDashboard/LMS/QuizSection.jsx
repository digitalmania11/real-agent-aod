import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const quizData = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Management Language",
      "HyperTech Modern Layout"
    ],
    correctAnswer: "HyperText Markup Language",
    category: "Beginner"
  },
  {
    id: 2,
    question: "Which CSS property controls the text size?",
    options: ["font-size", "text-size", "size-text", "font-style"],
    correctAnswer: "font-size",
    category: "Beginner"
  },
  {
    id: 3,
    question: "What keyword is used to declare a variable in JavaScript?",
    options: ["var", "define", "create", "variable"],
    correctAnswer: "var",
    category: "Intermediate"
  },
  {
    id: 4,
    question: "Which HTML element is used to define a hyperlink?",
    options: ["<a>", "<link>", "<href>", "<hyperlink>"],
    correctAnswer: "<a>",
    category: "Beginner"
  }
];

function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizEnded, setQuizEnded] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  const currentQuestion = quizData[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft > 0 && !quizEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizEnded) {
      handleNextQuestion();
    }
  }, [timeLeft, quizEnded]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(60);
    } else {
      setQuizEnded(true);
      navigate('/quiz-results', { state: { score, total: quizData.length } }); // Navigate to ResultsPage with state
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Quiz</h2>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold">{timeLeft}s</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                {currentQuestion.category}
              </span>
              <h3 className="text-xl font-semibold mt-2">{currentQuestion.question}</h3>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                    selectedAnswer === option
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } border-2 ${
                    selectedAnswer
                      ? option === currentQuestion.correctAnswer
                        ? 'border-green-500'
                        : selectedAnswer === option
                        ? 'border-red-500'
                        : 'border-transparent'
                      : 'border-transparent'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-lg font-semibold">
            Score: <span className="text-blue-600">{score}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null && !quizEnded}
          >
            {quizEnded ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {quizEnded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg">
            Your final score: <span className="text-blue-600 font-semibold">{score}</span> out of {quizData.length}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default QuizSection;

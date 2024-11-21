import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Trophy, Star, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const quizResults = {
  score: 3,
  totalQuestions: 4,
  timeTaken: 180,
  categoryBreakdown: {
    Beginner: { correct: 2, total: 3 },
    Intermediate: { correct: 1, total: 1 },
  },
  averageScore: 2.5,
  questions: [
    {
      id: 1,
      question: "What does HTML stand for?",
      userAnswer: "HyperText Markup Language",
      correctAnswer: "HyperText Markup Language",
      category: "Beginner"
    },
    {
      id: 2,
      question: "Which CSS property controls the text size?",
      userAnswer: "font-size",
      correctAnswer: "font-size",
      category: "Beginner"
    },
    {
      id: 3,
      question: "What keyword is used to declare a variable in JavaScript?",
      userAnswer: "var",
      correctAnswer: "var",
      category: "Intermediate"
    },
    {
      id: 4,
      question: "Which HTML element is used to define a hyperlink?",
      userAnswer: "<link>",
      correctAnswer: "<a>",
      category: "Beginner"
    }
  ]
}

export default function ResultsPage() {
  const accuracy = (quizResults.score / quizResults.totalQuestions) * 100
  const minutes = Math.floor(quizResults.timeTaken / 60)
  const seconds = quizResults.timeTaken % 60
  const navigate = useNavigate();

  const handleBackToProfile = () => {
    navigate("/dashboard/profile"); // Navigate to the profile page
  };

  const getMotivationalMessage = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "Excellent Job!"
    if (percentage >= 60) return "Great Effort!"
    return "Keep Practicing!"
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">
            {getMotivationalMessage(quizResults.score, quizResults.totalQuestions)}
          </h1>
          <p className="text-xl text-gray-700">
            Your final score: <span className="font-bold text-indigo-600">{quizResults.score}</span> out of {quizResults.totalQuestions}
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Metrics</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Accuracy</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{accuracy.toFixed(1)}%</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Time Taken</h3>
              <p className="text-2xl font-bold text-indigo-600">{minutes}m {seconds}s</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Breakdown</h2>
          {Object.entries(quizResults.categoryBreakdown).map(([category, { correct, total }]) => (
            <div key={category} className="mb-4">
              <h4 className="text-lg font-semibold text-gray-700">{category}</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(correct / total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{correct} out of {total} correct</p>
            </div>
          ))}
        </div>

        {/* Score Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Score Comparison</h2>
          <div className="flex items-center justify-center space-x-12">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <p className="text-3xl font-bold text-indigo-600">{quizResults.score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-indigo-600">{quizResults.averageScore}</p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Question Review</h2>
          {quizResults.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-6 p-4 border border-gray-200 rounded-lg"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{question.question}</h4>
              <p className="mb-1 flex items-center">
                <span className="font-medium mr-2">Your answer:</span>
                <span className={question.userAnswer === question.correctAnswer ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {question.userAnswer}
                </span>
                {question.userAnswer === question.correctAnswer ? (
                  <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="ml-2 h-5 w-5 text-red-600" />
                )}
              </p>
              {question.userAnswer !== question.correctAnswer && (
                <p className="text-green-600 font-semibold flex items-center">
                  <span className="font-medium text-gray-800 mr-2">Correct answer:</span>
                  {question.correctAnswer}
                  <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">Category: {question.category}</p>
            </motion.div>
          ))}
        </div>

        {/* Encouragement/Call-to-Action Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Keep Improving!</h2>
          <p className="text-lg text-gray-700 mb-6">
            Great job on completing the quiz! Remember, consistent practice is the key to mastery. 
            Why not challenge yourself with another quiz or try to beat your score?
          </p>
          <div className="flex justify-center space-x-4">
            <button 
            onClick = {handleBackToProfile}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </button>
            <Link href="/quiz" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Try Another Quiz
              <Star className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}




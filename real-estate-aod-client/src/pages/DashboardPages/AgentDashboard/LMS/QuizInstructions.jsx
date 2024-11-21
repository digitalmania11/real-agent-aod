import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckSquare, AlertTriangle, Award } from 'lucide-react';

function QuizInstructions({ onStartQuiz }) {
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Quiz Instructions</h1>
        <p className="text-xl">Get ready to test your knowledge!</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">
          Make sure to read through the instructions before starting the quiz to ensure a smooth experience.
        </p>

        <ul className="space-y-4">
          {[
            { icon: <Clock className="h-6 w-6" />, text: "Each question is timed (60 seconds)." },
            { icon: <CheckSquare className="h-6 w-6" />, text: "Some questions may have multiple correct answers." },
            { icon: <AlertTriangle className="h-6 w-6" />, text: "Answer as many as you can before time runs out." },
            { icon: <Award className="h-6 w-6" />, text: "Points are based on correctness and time taken." },
          ].map((item, index) => (
            <li key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                {item.icon}
              </div>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quiz Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <p className="text-sm text-gray-600">0% completed</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStartQuiz} // Call the parent-provided function to start the quiz
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
      >
        Start Quiz
      </motion.button>
    </div>
  );
}

export default QuizInstructions;

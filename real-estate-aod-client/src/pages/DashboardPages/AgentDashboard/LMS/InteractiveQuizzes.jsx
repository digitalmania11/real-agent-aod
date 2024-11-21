'use client'

import { useState, useEffect } from 'react';
import QuizInstructions from './QuizInstructions';
import QuizSection from './QuizSection';

export default function InteractiveQuizzes({ quizzes }) {
  const [averageScore, setAverageScore] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false); // Track if quiz has started
  const [showInstructions, setShowInstructions] = useState(false); // Track if instructions are shown

  useEffect(() => {
    const scores = quizzes
      .filter((quiz) => quiz.score !== undefined)
      .map((quiz) => quiz.score)
      .slice(-3);
    const avg =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    setAverageScore(Math.round(avg));

    const completed = quizzes.filter(
      (quiz) => quiz.status.toLowerCase() === 'completed'
    ).length;
    setCompletedQuizzes(completed);
  }, [quizzes]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-purple-100 text-purple-800';
      case 'not started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const startQuiz = () => {
    setShowInstructions(true); // Show instructions first
  };

  const beginQuiz = () => {
    setShowInstructions(false); // Hide instructions
    setQuizStarted(true); // Start the quiz
  };

  if (quizStarted) {
    return <QuizSection />;
  }

  if (showInstructions) {
    return <QuizInstructions onStartQuiz={beginQuiz} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quiz Overview</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Average Score (Last 3 Quizzes)</p>
            <p className="text-3xl font-bold text-blue-600">{averageScore}</p>
          </div>
          <div className="flex-1 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {completedQuizzes} of {quizzes.length} quizzes completed ({Math.round((completedQuizzes / quizzes.length) * 100)}%)
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedQuizzes / quizzes.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                    quiz.difficulty
                  )}`}
                >
                  {quiz.difficulty}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    quiz.status
                  )}`}
                >
                  {quiz.status}
                </span>
                {quiz.score !== undefined && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(
                      quiz.score
                    )}`}
                  >
                    Score: {quiz.score}
                  </span>
                )}
              </div>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                onClick={startQuiz}
              >
                {quiz.status === 'Completed' ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

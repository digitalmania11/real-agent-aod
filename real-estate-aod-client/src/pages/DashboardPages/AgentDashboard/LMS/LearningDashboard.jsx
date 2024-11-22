'use client'

import { useState } from 'react'
import LearningModules from './LearningModules'
import InteractiveQuizzes from './InteractiveQuizzes'

const modules = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript.",
    progress: 80,
    subsections: [
      { 
        id: 101, 
        title: "HTML Basics", 
        description: "Learn the fundamental structure of web pages.",
        progress: 100,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML"
      },
      { 
        id: 102, 
        title: "CSS Essentials", 
        description: "Master the styling of web pages.",
        progress: 60,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps"
      },
      { 
        id: 103, 
        title: "Introduction to JavaScript", 
        description: "Get started with programming for the web.",
        progress: 80,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps"
      }
    ]
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into JavaScript ES6+ features and best practices.",
    progress: 40,
    subsections: [
      { 
        id: 201, 
        title: "ES6 Syntax", 
        description: "Explore modern JavaScript syntax and features.",
        progress: 20,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements"
      },
      { 
        id: 202, 
        title: "Async Programming", 
        description: "Master asynchronous JavaScript programming.",
        progress: 50,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous"
      }
    ]
  }
]

const quizzes = [
  { id: 1, title: "HTML Basics Quiz", difficulty: "Beginner", status: "Completed", score: 95 },
  { id: 2, title: "CSS Essentials Quiz", difficulty: "Beginner", status: "Not Started" },
  { id: 3, title: "JavaScript Concepts Quiz", difficulty: "Intermediate", status: "In Progress" },
  { id: 4, title: "Responsive Design Quiz", difficulty: "Intermediate", status: "Completed", score: 78 },
  { id: 5, title: "Web Accessibility Quiz", difficulty: "Advanced", status: "Completed", score: 88 }
]

export function LearningDashboard() {
  const [activeTab, setActiveTab] = useState('modules')

  const totalModules = modules.length
  const completedModules = modules.filter(module => module.progress === 100).length

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Learning Modules Dashboard</h1>
        <p className="text-xl">
          {completedModules} of {totalModules} modules completed
        </p>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-blue-200 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedModules / totalModules) * 100}%` }}
          ></div>
        </div>
      </header>

      <div className="mb-6">
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-md">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'modules'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('modules')}
          >
            Learning Modules
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'quizzes'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('quizzes')}
          >
            Interactive Quizzes
          </button>
        </div>
      </div>

      {activeTab === 'modules' ? (
        <LearningModules modules={modules} />
      ) : (
        <InteractiveQuizzes quizzes={quizzes} />
      )}
    </div>
  )
}

export default LearningDashboard;

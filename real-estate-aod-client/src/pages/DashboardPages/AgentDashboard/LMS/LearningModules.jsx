'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle, Play, FileText } from 'lucide-react'

export function LearningModules({ modules }) {
  const [expandedModules, setExpandedModules] = useState([])
  const [activeVideo, setActiveVideo] = useState(null)

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const openVideo = (videoUrl) => {
    setActiveVideo(videoUrl)
  }

  const closeVideo = () => {
    setActiveVideo(null)
  }

  return (
    <div className="space-y-6">
      {modules.map(module => (
        <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{module.title}</h2>
              <button
                onClick={() => toggleModule(module.id)}
                className="text-blue-500 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                aria-expanded={expandedModules.includes(module.id)}
                aria-controls={`module-content-${module.id}`}
              >
                {expandedModules.includes(module.id) ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </button>
            </div>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  Progress
                </span>
                <span className="text-xs font-semibold text-blue-600">{module.progress}%</span>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <motion.div
                  style={{ width: `${module.progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${module.progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                ></motion.div>
              </div>
            </div>
            <AnimatePresence>
              {expandedModules.includes(module.id) && (
                <motion.div
                  id={`module-content-${module.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  {module.subsections.map(subsection => (
                    <div
                      key={subsection.id}
                      className={`bg-gray-50 p-4 rounded-md ${subsection.progress === 100 ? 'bg-green-50' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          {subsection.progress === 100 && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                          {subsection.title}
                        </span>
                        <span className="text-xs font-semibold text-blue-600">{subsection.progress}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{subsection.description}</p>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <motion.div
                          style={{ width: `${subsection.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${subsection.progress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        ></motion.div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openVideo(subsection.videoUrl)}
                          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200"
                          aria-label={`Play video for ${subsection.title}`}
                        >
                          <Play className="h-4 w-4 mr-1" /> Play Video
                        </button>
                        <a
                          href={subsection.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                          aria-label={`Open article for ${subsection.title}`}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Open Article
                        </a>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        </div>
      ))}
      {activeVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <h3 className="text-xl font-semibold mb-4">Video Player</h3>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src={activeVideo}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={closeVideo}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              Close Video
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningModules

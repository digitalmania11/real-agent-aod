import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function QuizBuilder() {
  const [questions, setQuestions] = useState([])

  const addQuestion = () => {
    setQuestions([...questions, { type: 'multiple-choice', text: '', options: ['', ''], correctAnswer: 0 }])
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }

  return (
    <Card className="bg-white dark:bg-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-800 dark:text-blue-100">Quiz Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="flex items-center space-x-2">
            <Input placeholder="Quiz Title" className="flex-grow bg-blue-50 dark:bg-blue-700 text-blue-800 dark:text-blue-100" />
            <Select>
              <SelectTrigger className="w-[180px] bg-blue-50 dark:bg-blue-700 text-blue-800 dark:text-blue-100">
                <SelectValue placeholder="Time Limit" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-blue-700">
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="shuffle" className="text-blue-800 dark:text-blue-100">Shuffle Questions</Label>
            <Switch id="shuffle" />
          </div>
        </div>
        {questions.map((question, index) => (
          <Card key={index} className="mb-4 bg-blue-50 dark:bg-blue-700">
            <CardContent className="pt-6">
              <Select
                value={question.type}
                onValueChange={(value) => updateQuestion(index, 'type', value)}
              >
                <SelectTrigger className="bg-white dark:bg-blue-600 text-blue-800 dark:text-blue-100">
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-blue-600">
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Question text"
                value={question.text}
                onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                className="mt-2 bg-white dark:bg-blue-600 text-blue-800 dark:text-blue-100"
              />
              {question.type === 'multiple-choice' && (
                <div className="mt-2 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options]
                          newOptions[optionIndex] = e.target.value
                          updateQuestion(index, 'options', newOptions)
                        }}
                        className="bg-white dark:bg-blue-600 text-blue-800 dark:text-blue-100"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = question.options.filter((_, i) => i !== optionIndex)
                          updateQuestion(index, 'options', newOptions)
                        }}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...question.options, '']
                      updateQuestion(index, 'options', newOptions)
                    }}
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
                  >
                    Add Option
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <Button onClick={addQuestion} className="bg-blue-600 hover:bg-blue-700 text-white">Add Question</Button>
      </CardContent>
    </Card>
  )
}


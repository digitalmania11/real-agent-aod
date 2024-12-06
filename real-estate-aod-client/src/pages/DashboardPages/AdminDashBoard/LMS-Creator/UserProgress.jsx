import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart } from 'lucide-react'

export function UserProgress() {
  const users = [
    { id: 1, name: "John Doe", progress: 75, modules: [
      { name: "Introduction", progress: 100 },
      { name: "Advanced Techniques", progress: 50 },
    ]},
    { id: 2, name: "Jane Smith", progress: 90, modules: [
      { name: "Introduction", progress: 100 },
      { name: "Advanced Techniques", progress: 80 },
    ]},
  ]

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="bg-white dark:bg-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-100">{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <BarChart className="text-blue-600" />
              <div className="font-medium text-blue-800 dark:text-blue-100">Overall Progress</div>
              <Progress value={user.progress} className="w-1/2" />
              <div className="text-blue-800 dark:text-blue-100">{user.progress}%</div>
            </div>
            <div className="space-y-2">
              {user.modules.map((module, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1/4 text-blue-800 dark:text-blue-100">{module.name}</div>
                  <Progress value={module.progress} className="w-1/2" />
                  <div className="text-blue-800 dark:text-blue-100">{module.progress}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
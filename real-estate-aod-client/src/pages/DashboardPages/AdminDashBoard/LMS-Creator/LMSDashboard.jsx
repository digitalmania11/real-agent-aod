import { useState } from 'react'
import { BarChart, PieChart, Users, BookOpen, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { DataTable } from './DataTable.jsx'
import { ModuleManager } from './ModuleManager.jsx'
import { QuizBuilder } from './QuizBuilder.jsx'
import { StatCard } from './StatCard.jsx'
import { UserProgress } from './UserProgress.jsx'

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen bg-blue-50 dark:bg-blue-900 ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-blue-100">LMS Admin Dashboard</h1>
          {/* 
          <Button onClick={toggleDarkMode} variant="outline" className="bg-white dark:bg-blue-800">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button> */}
        </header>

        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value="1,234" icon={<Users className="h-8 w-8 text-blue-600" />} />
          <StatCard title="Active Learners" value="789" icon={<BookOpen className="h-8 w-8 text-blue-600" />} />
          <StatCard title="Modules Completed" value="456" icon={<Award className="h-8 w-8 text-blue-600" />} />
          <StatCard title="Avg. Quiz Score" value="85%" icon={<BarChart className="h-8 w-8 text-blue-600" />} />
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-white dark:bg-blue-800">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="modules">Modules & Submodules</TabsTrigger>
            <TabsTrigger value="quizzes">Quiz Builder</TabsTrigger>
            <TabsTrigger value="progress">User Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-4">
            <Card className="bg-white dark:bg-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-100">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <Input placeholder="Search users..." className="max-w-sm bg-blue-50 dark:bg-blue-700" />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add New User</Button>
                </div>
                <DataTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="modules">
            <ModuleManager />
          </TabsContent>
          <TabsContent value="quizzes">
            <QuizBuilder />
          </TabsContent>
          <TabsContent value="progress">
            <UserProgress />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


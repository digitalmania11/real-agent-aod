import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatCard({ title, value, icon }) {
  return (
    <Card className="bg-white dark:bg-blue-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-100">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-900 dark:text-blue-50">{value}</div>
      </CardContent>
    </Card>
  )
}


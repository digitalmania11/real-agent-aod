import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", progress: "75%", lastActive: "2 days ago" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", progress: "90%", lastActive: "1 hour ago" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", progress: "60%", lastActive: "1 week ago" },
  ]
  
  export function DataTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-100 dark:bg-blue-700">
            <TableHead className="text-blue-800 dark:text-blue-100">Name</TableHead>
            <TableHead className="text-blue-800 dark:text-blue-100">Email</TableHead>
            <TableHead className="text-blue-800 dark:text-blue-100">Progress</TableHead>
            <TableHead className="text-blue-800 dark:text-blue-100">Last Active</TableHead>
            <TableHead className="text-blue-800 dark:text-blue-100">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-blue-50 dark:hover:bg-blue-700">
              <TableCell className="text-blue-800 dark:text-blue-100">{user.name}</TableCell>
              <TableCell className="text-blue-800 dark:text-blue-100">{user.email}</TableCell>
              <TableCell className="text-blue-800 dark:text-blue-100">{user.progress}</TableCell>
              <TableCell className="text-blue-800 dark:text-blue-100">{user.lastActive}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600">View</Button>
                <Button variant="outline" size="sm" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600">Reset</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  };  
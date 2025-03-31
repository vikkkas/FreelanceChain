"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Clock, Search, Calendar, Filter } from "lucide-react"
import { format } from "date-fns"

interface CompletedTask {
  id: number
  taskId: number
  title: string
  reward: number
  completedAt: string
  status: "completed" | "pending" | "rejected"
  imageUrl: string
}

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState<CompletedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const mockTasks: CompletedTask[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        taskId: 1000 + i,
        title: [
          "Image Classification: Identify Objects",
          "Text Sentiment Analysis",
          "Product Categorization",
          "Logo Design Feedback",
          "UI/UX Evaluation",
        ][Math.floor(Math.random() * 5)],
        reward: Number.parseFloat((0.05 + Math.random() * 0.45).toFixed(2)),
        completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: ["completed", "completed", "completed", "pending", "rejected"][Math.floor(Math.random() * 5)] as any,
        imageUrl: `/placeholder.svg?height=80&width=80`,
      }))

      setTasks(mockTasks)
      setLoading(false)
    }, 1500)
  }, [])

  const filteredTasks = tasks.filter((task) => {
    // Apply status filter
    if (filter !== "all" && task.status !== filter) return false

    // Apply search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false

    return true
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Completed Tasks</h1>
          <p className="text-muted-foreground mt-2">View your task history and completion status</p>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Task History</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      className="border-0 p-0 focus-visible:ring-0 h-auto"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="border-0 p-0 h-auto w-[120px] focus:ring-0">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Reward</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-md" />
                              <Skeleton className="h-4 w-[250px]" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-[60px] ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                                <img
                                  src={task.imageUrl || "/placeholder.svg"}
                                  alt={task.title}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-xs text-muted-foreground">Task #{task.taskId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{format(new Date(task.completedAt), "MMM d, yyyy")}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.status === "completed"
                                  ? "default"
                                  : task.status === "pending"
                                    ? "outline"
                                    : "destructive"
                              }
                              className="flex w-fit items-center gap-1"
                            >
                              {task.status === "completed" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : task.status === "pending" ? (
                                <Clock className="h-3 w-3" />
                              ) : (
                                <span className="h-3 w-3">×</span>
                              )}
                              <span className="capitalize">{task.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">{task.reward} SOL</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No tasks found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


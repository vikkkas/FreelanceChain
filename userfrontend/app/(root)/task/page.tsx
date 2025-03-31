"use client"
import { Appbar } from "@/components/Appbar"
import { Footer } from "@/components/Footer"
import { BACKEND_URL } from "@/utils"
import axios from "axios"
import { useEffect, useState } from "react"
import { Loader2, Clock, CheckCircle, AlertCircle, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

type Task = {
  id: string
  title: string
  description?: string
  status: "pending" | "active" | "completed"
  createdAt: string
  totalVotes: number
  imageCount: number
}

async function getUserTasks() {
  try {
    const response = await axios.get(`${BACKEND_URL}/v1/user/taskList`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    console.log("response", response)
    return response
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "completed">("all")
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    if (isAuthenticated) {
        setLoading(true)
        getUserTasks()
          .then((data) => {
            console.log("data", data)
            // Mock data for development - remove in production
            //   if (!data.data || data.length === 0) {
            //   const mockTasks: Task[] = [
            //     {
            //       id: "1",
            //       title: "Image Classification for AI Training",
            //       description: "Classify these images into categories: cat, dog, or other animal",
            //       status: "active",
            //       createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            //       totalVotes: 24,
            //       imageCount: 3,
            //     },
            //     {
            //       id: "2",
            //       title: "Logo Design Feedback",
            //       description: "Which logo design do you prefer for our brand?",
            //       status: "completed",
            //       createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            //       totalVotes: 156,
            //       imageCount: 4,
            //     },
            //     {
            //       id: "3",
            //       title: "UI Color Scheme Selection",
            //       status: "pending",
            //       createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            //       totalVotes: 0,
            //       imageCount: 2,
            //     },
            //   ]
            //   setTasks(mockTasks)
            // } else {
            // }
            console.log("data", data)
            setTasks(data.data)
            setLoading(false)
          })
          .catch((err) => {
            console.error(err)
            setError("Failed to load your tasks. Please try again later.")
            setLoading(false)
          })}
      }, [isAuthenticated, isLoading, router])

  const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => task.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "active":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "active":
        return "Active"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (isLoading || loading) {
    return (
      <div>
        <Appbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Appbar />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-4">Your Tasks</h1>
          <p className="text-muted-foreground">Manage and monitor all the tasks you've created</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by status:</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "pending" ? "bg-yellow-500 text-white" : "bg-muted hover:bg-muted/80"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "active" ? "bg-blue-500 text-white" : "bg-muted hover:bg-muted/80"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "completed" ? "bg-green-500 text-white" : "bg-muted hover:bg-muted/80"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {filteredTasks.length === 0 ? (
          <div className="bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">No tasks found with the selected filter.</p>
            {filter !== "all" && (
              <button onClick={() => setFilter("all")} className="text-primary hover:underline">
                View all tasks
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTasks.map((task, index) => (
              <Link
                href={`/task/${task?.id}`}
                key={task?.id}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(task?.status)}
                      <span className="text-sm font-medium">{getStatusText(task?.status)}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{task?.title}</h2>
                    {task?.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{task?.description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <span className="mr-2">Created:</span>
                        <span>{formatDate(task?.date_created)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">Images:</span>
                        <span>{task?.imageCount}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">Votes:</span>
                        <span>{task?.totalVotes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center self-end md:self-center">
                    <span className="text-sm font-medium mr-2">View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            Create New Task
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}


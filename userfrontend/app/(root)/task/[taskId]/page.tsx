"use client"
import { Appbar } from "@/components/Appbar"
import { Footer } from "@/components/Footer"
import { BACKEND_URL } from "@/utils"
import axios from "axios"
import { useEffect, useState } from "react"
import { Loader2, Share2, Clock, CheckCircle, AlertCircle, Calendar, ImageIcon, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

type TaskStatus = "pending" | "active" | "completed"

type TaskDetail = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
  totalVotes: number
  result: Record<
    string,
    {
      count: number
      option: {
        imageUrl: string
      }
    }
  >
}

async function getTaskDetails(taskId: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/v1/user/task?taskId=${taskId}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching task details:", error)
    throw error
  }
}

export default function TaskDetailPage({ params: { taskId } }: { params: { taskId: string } }) {
  const [taskDetails, setTaskDetails] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      getTaskDetails(taskId)
        .then((data) => {
          // Mock data for development - remove in production
          if (!data || !data.result) {
            const mockData: TaskDetail = {
              id: taskId,
              title: "Image Classification Task",
              description: "Help us classify these images for our AI training dataset",
              status: "active",
              createdAt: new Date().toISOString(),
              totalVotes: 24,
              result: {
                "1": {
                  count: 12,
                  option: {
                    imageUrl: "/placeholder.svg?height=400&width=600",
                  },
                },
                "2": {
                  count: 8,
                  option: {
                    imageUrl: "/placeholder.svg?height=400&width=600",
                  },
                },
                "3": {
                  count: 4,
                  option: {
                    imageUrl: "/placeholder.svg?height=400&width=600",
                  },
                },
              },
            }
            setTaskDetails(mockData)
          } else {
            // Transform the API response to match our TaskDetail type
            const transformedData: TaskDetail = {
              id: taskId,
              title: data.taskDetails?.title || "Untitled Task",
              description: data.taskDetails?.description || "",
              status: data.taskDetails?.status || "active",
              createdAt: data.taskDetails?.createdAt || new Date().toISOString(),
              totalVotes: Object.values(data.result || {}).reduce((sum: number, item: any) => sum + item.count, 0),
              result: data.result || {},
            }
            setTaskDetails(transformedData)
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setError("Failed to load task details. Please try again later.")
          setLoading(false)
        })
    }
  }, [taskId, isAuthenticated, isLoading, router])

  const getStatusIcon = (status: TaskStatus) => {
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

  const getStatusText = (status: TaskStatus) => {
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const copyShareLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
  }

  if (isLoading || loading) {
    return (
      <div>
        <Appbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (error || !taskDetails) {
    return (
      <div>
        <Appbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-lg max-w-md">
            <p>{error || "Task not found"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Appbar />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/task"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to all tasks</span>
          </Link>
        </div>

        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(taskDetails.status)}
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-muted">
              {getStatusText(taskDetails.status)}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{taskDetails.title}</h1>

          {taskDetails.description && <p className="text-muted-foreground mb-6 max-w-3xl">{taskDetails.description}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-lg p-4 flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(taskDetails.createdAt)}</p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 flex items-center">
              <ImageIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="font-medium">{Object.keys(taskDetails.result).length}</p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="font-medium">{taskDetails.totalVotes}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={copyShareLink}
              className="flex items-center px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              <span>Share Task</span>
            </button>

            {taskDetails.status === "active" && (
              <button className="flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Mark as Completed</span>
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Results</h2>

          <div className="bg-card rounded-xl p-6 shadow-md mb-8">
            <h3 className="text-lg font-medium mb-4">Vote Distribution</h3>
            <div className="h-64 flex items-end justify-around gap-2 mb-6">
              {Object.keys(taskDetails.result).map((itemId) => {
                const item = taskDetails.result[itemId]
                const percentage = taskDetails.totalVotes > 0 ? (item.count / taskDetails.totalVotes) * 100 : 0

                return (
                  <div key={itemId} className="flex flex-col items-center">
                    <div
                      className="w-16 sm:w-24 gradient-bg rounded-t-md transition-all duration-1000 ease-out"
                      style={{
                        height: `${Math.max(percentage, 5)}%`,
                        opacity: percentage > 0 ? 1 : 0.5,
                      }}
                    />
                    <div className="mt-2 text-center">
                      <div className="font-semibold">{Math.round(percentage)}%</div>
                      <div className="text-sm text-muted-foreground">Option {Number.parseInt(itemId) + 1}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.keys(taskDetails.result).map((itemId, index) => {
              const item = taskDetails.result[itemId]
              const percentage =
                taskDetails.totalVotes > 0 ? Math.round((item.count / taskDetails.totalVotes) * 100) : 0

              return (
                <div
                  key={itemId}
                  className="bg-card rounded-xl overflow-hidden shadow-md card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      className="w-full h-64 object-cover"
                      src={item.option.imageUrl || "/placeholder.svg"}
                      alt={`Option ${index + 1}`}
                    />
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Option {index + 1}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.count} votes</span>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>

                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-bg transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


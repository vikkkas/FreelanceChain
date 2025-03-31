"use client"
import { BACKEND_URL } from "@/utils"
import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface Task {
  id: number
  amount: number
  title: string
  options: {
    id: number
    image_url: string
    task_id: number
  }[]
}

export const NextTask = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const fetchNextTask = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      setCurrentTask(res.data.task)
    } catch (e) {
      console.error(e)
      setError("Failed to load tasks. Please try again later.")
      setCurrentTask(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNextTask()
  }, [])

  const handleSubmission = async (optionId: number) => {
    setSubmitting(true)
    setError(null)
    try {
      const response = await axios.post(
        `${BACKEND_URL}/v1/worker/submission`,
        {
          taskId: currentTask?.id.toString(),
          selection: optionId.toString(),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      )

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        const nextTask = response.data.nextTask
        if (nextTask) {
          setCurrentTask(nextTask)
        } else {
          setCurrentTask(null)
        }
      }, 1500)
    } catch (e) {
      console.error(e)
      setError("Failed to submit your answer. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <div className="space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={fetchNextTask} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!currentTask) {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>No Tasks Available</CardTitle>
            <CardDescription>There are no pending tasks at the moment. Please check back later.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={fetchNextTask} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-12">
      {success && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300">
          <Alert className="bg-green-500 text-white border-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Your answer has been submitted successfully.</AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="mb-8 task-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{currentTask.title}</CardTitle>
          <CardDescription>Select the best option to complete this task and earn SOL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTask.options.map((option) => (
              <Option
                key={option.id}
                imageUrl={option.image_url}
                disabled={submitting}
                onSelect={() => handleSubmission(option.id)}
              />
            ))}
          </div>
        </CardContent>
        {submitting && (
          <CardFooter className="justify-center">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting your answer...</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

function Option({
  imageUrl,
  onSelect,
  disabled,
}: {
  imageUrl: string
  onSelect: () => void
  disabled?: boolean
}) {
  return (
    <div className="option-card">
      <Card className="overflow-hidden cursor-pointer border-2 hover:border-primary transition-colors">
        <CardContent className="p-0">
          <Button
            variant="ghost"
            className="w-full h-full p-0 overflow-hidden rounded-none"
            onClick={onSelect}
            disabled={disabled}
          >
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Task option"
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


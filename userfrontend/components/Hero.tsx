"use client"
import { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      <div
        className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome to <span className="gradient-text">FreelanceChain</span>
        </h1>

        <p className="mt-6 text-xl sm:text-2xl max-w-3xl mx-auto text-muted-foreground">
          Your one-stop destination for high-quality data labeling powered by blockchain technology
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#create-task"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Create a Task
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-3 rounded-full bg-muted text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            How It Works
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </div>
  )
}


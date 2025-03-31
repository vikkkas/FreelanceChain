"use client"
import { Appbar } from "@/components/Appbar"
import { Hero } from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks"
import { Upload } from "@/components/Upload"
import { Footer } from "@/components/Footer"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ListChecks } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Appbar />
      <Hero />
      <HowItWorks />
      <Upload />

      {isAuthenticated && (
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-6">View Your Existing Tasks</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Check the status of your existing tasks, view results, and manage your data labeling projects.
            </p>
            <Link
              href="/task"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <ListChecks className="mr-2 h-5 w-5" />
              View My Tasks
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}


import { Appbar } from "@/components/Appbar"
import { NextTask } from "@/components/NextTask"
import { Coins, ArrowRight, History, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Appbar />

      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Decentralized Freelancing</div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Complete Tasks, Earn <span className="text-primary">SOL</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                FreelanceChain connects workers with tasks on the Solana blockchain. Complete simple tasks and get paid
                instantly in SOL.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href="/completed"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <History className="h-4 w-4" />
                  View Completed Tasks
                </Link>
                <Link
                  href="/earnings"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  Track Your Earnings
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-card border rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Task Rewards</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Powered by Solana</div>
                    </div>
                    <div className="space-y-4">
                      {[0.05, 0.1, 0.2, 0.5].map((amount, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium">Task #{i + 1}</div>
                          <div className="flex items-center gap-1 text-primary font-bold">
                            {amount} <span className="text-xs font-normal">SOL</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NextTask />
    </div>
  )
}


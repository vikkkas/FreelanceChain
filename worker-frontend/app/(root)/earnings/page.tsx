"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Wallet,
  ArrowRight,
  Download,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"

// Simple chart component using div heights
//@ts-ignore
function SimpleBarChart({ data, maxValue, color = "bg-primary" }) {
  return (
    <div className="flex items-end h-36 gap-1">
        
      {
        //@ts-ignore
      data.map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group">
          <div className="relative w-full">
            <div
              className={`w-full rounded-t-sm ${color} transition-all duration-500 ease-out`}
              style={{
                height: `${Math.max(4, (value / maxValue) * 100)}%`,
                maxHeight: "100%",
              }}
            ></div>
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
              {value.toFixed(2)} SOL
            </div>
          </div>
          <span className="text-xs text-muted-foreground mt-2">{i + 1}</span>
        </div>
      ))}
    </div>
  )
}

function SimpleLineChart({ data, maxValue, color = "bg-primary" }) {
  return (
    <div className="relative h-36 mt-6">
      <div className="absolute inset-0 flex items-end">
        {data.map((point, i) => {
          const height = `${Math.max(4, (point.value / maxValue) * 100)}%`
          const nextPoint = data[i + 1]

          return (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <div className="relative w-full h-full flex items-end justify-center">
                <div className={`w-2 h-2 rounded-full ${color} z-10`}></div>
                {nextPoint && (
                  <div
                    className={`absolute h-0.5 ${color}`}
                    style={{
                      width: "100%",
                      bottom: height,
                      transform: `rotate(${Math.atan2(
                        (nextPoint.value / maxValue) * 100 - (point.value / maxValue) * 100,
                        100,
                      )}rad)`,
                      transformOrigin: "left bottom",
                    }}
                  ></div>
                )}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                  {point.value.toFixed(2)} SOL
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-2 absolute bottom-0 transform -translate-x-1/2">
                {point.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function EarningsPage() {
  const [period, setPeriod] = useState("week")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingPayout: 0,
    tasksCompleted: 0,
    averagePerTask: 0,
    weeklyData: [] as number[],
    monthlyData: [] as { label: string; value: number }[],
    recentPayouts: [] as { date: string; amount: number }[],
  })

  // Generate mock data
  useEffect(() => {
    setTimeout(() => {
      const totalEarned = Number.parseFloat((Math.random() * 10 + 5).toFixed(2))
      const pendingPayout = Number.parseFloat((Math.random() * 2 + 0.5).toFixed(2))
      const tasksCompleted = Math.floor(Math.random() * 50 + 30)

      // Generate weekly data (last 7 days)
      const weeklyData = Array.from({ length: 7 }, () => Number.parseFloat((Math.random() * 0.8 + 0.1).toFixed(2)))

      // Generate monthly data (last 30 days)
      const today = new Date()
      const monthStart = startOfMonth(today)
      const monthEnd = endOfMonth(today)
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

      const monthlyData = daysInMonth.map((day) => ({
        label: format(day, "d"),
        value: Number.parseFloat((Math.random() * 0.5 + 0.05).toFixed(2)),
      }))

      // Generate recent payouts
      const recentPayouts = Array.from({ length: 5 }, (_, i) => ({
        date: format(subDays(new Date(), i * 5 + Math.floor(Math.random() * 3)), "MMM d, yyyy"),
        amount: Number.parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
      }))

      setStats({
        totalEarned,
        pendingPayout,
        tasksCompleted,
        averagePerTask: Number.parseFloat((totalEarned / tasksCompleted).toFixed(3)),
        weeklyData,
        monthlyData,
        recentPayouts,
      })

      setLoading(false)
    }, 1500)
  }, [])

  const chartData = period === "week" ? stats.weeklyData : stats.monthlyData.map((d) => d.value)

  const maxValue = Math.max(...chartData) * 1.2

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your earnings, payouts, and performance metrics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Total Earned</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {loading ? (
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                ) : (
                  <>
                    {stats.totalEarned} SOL
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Lifetime earnings from all completed tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Pending Payout</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {loading ? (
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                ) : (
                  <>
                    {stats.pendingPayout} SOL
                    <Wallet className="h-4 w-4 text-blue-500" />
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Available for withdrawal to your wallet</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Tasks Completed</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {loading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                ) : (
                  <>
                    {stats.tasksCompleted}
                    <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Total number of successfully completed tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Average Per Task</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {loading ? (
                  <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                ) : (
                  <>
                    {stats.averagePerTask} SOL
                    <DollarSign className="h-4 w-4 text-purple-500" />
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Average earnings per completed task</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Earnings Overview</CardTitle>
                <Tabs defaultValue="week" className="w-[200px]" onValueChange={setPeriod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Your earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-36 w-full bg-muted animate-pulse rounded"></div>
              ) : period === "week" ? (
                <SimpleBarChart data={stats.weeklyData} maxValue={maxValue} />
              ) : (
                <SimpleLineChart data={stats.monthlyData} maxValue={maxValue} color="bg-blue-500" />
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {period === "week" ? "Last 7 days" : "This month"}
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Your latest withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))
                ) : stats.recentPayouts.length > 0 ? (
                  stats.recentPayouts.map((payout, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{payout.date}</span>
                      </div>
                      <div className="font-medium">{payout.amount} SOL</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-6">No payouts yet</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" size="sm" className="w-full gap-1">
                View All Transactions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle>Earnings Potential</CardTitle>
            <CardDescription>Complete more tasks to increase your earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border">
                <div className="text-4xl font-bold text-primary mb-2">5+</div>
                <div className="text-center text-sm text-muted-foreground">Tasks per day for optimal earnings</div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border">
                <div className="text-4xl font-bold text-blue-500 mb-2">0.5</div>
                <div className="text-center text-sm text-muted-foreground">Average SOL per task completion</div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border">
                <div className="text-4xl font-bold text-emerald-500 mb-2">15+</div>
                <div className="text-center text-sm text-muted-foreground">SOL potential monthly earnings</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button className="w-full gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Start Earning Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


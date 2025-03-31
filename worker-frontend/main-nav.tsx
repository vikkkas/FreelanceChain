"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coins, CheckSquare, LayoutDashboard, History } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Completed",
    href: "/completed",
    icon: History,
  },
  {
    name: "Earnings",
    href: "/earnings",
    icon: Coins,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}


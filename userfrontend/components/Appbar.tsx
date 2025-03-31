"use client"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState, useEffect } from "react"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "./theme-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export const Appbar = () => {
  const { publicKey } = useWallet()
  const { isAuthenticated, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleDisconnect = () => {
    signOut()
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold gradient-text">FreelanceChain</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/task"
                className={`text-sm font-medium transition-colors ${
                  isActive("/task") || pathname.startsWith("/task/")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                My Tasks
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="hidden md:block wallet-adapter-button-container">
              {publicKey ? (
                <WalletDisconnectButton className="wallet-adapter-button" onClick={handleDisconnect} />
              ) : (
                <WalletMultiButton className="wallet-adapter-button" />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border mt-2 animate-fade-in">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/"
              className={`block text-sm font-medium transition-colors ${
                isActive("/") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/task"
                className={`block text-sm font-medium transition-colors ${
                  isActive("/task") || pathname.startsWith("/task/")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={closeMenu}
              >
                My Tasks
              </Link>
            )}

            <div className="pt-4 border-t border-border">
              <div className="wallet-adapter-button-container">
                {publicKey ? (
                  <WalletDisconnectButton className="wallet-adapter-button" onClick={handleDisconnect} />
                ) : (
                  <WalletMultiButton className="wallet-adapter-button" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


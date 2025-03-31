"use client"

import { BACKEND_URL } from "@/utils"
import { useWallet } from "@solana/wallet-adapter-react"
import axios from "axios"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { publicKey, signMessage, connected } = useWallet()

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  // Auto sign in when wallet connects
  useEffect(() => {
    if (connected && publicKey && !isAuthenticated && !isLoading) {
      signIn()
    }
  }, [connected, publicKey, isAuthenticated, isLoading])

  const signIn = async () => {
    if (!publicKey || !signMessage) {
      return
    }

    try {
      setIsLoading(true)
      const message = new TextEncoder().encode("Sign into mechanical turks")
      const signature = await signMessage(message)

      const response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
        signature,
        publicKey: publicKey.toString(),
      })

      localStorage.setItem("token", response.data.token)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}


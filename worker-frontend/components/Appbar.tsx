"use client"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/utils"
import { ModeToggle } from "./mode-toggle"
import { Coins, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const Appbar = () => {
  const { publicKey, signMessage } = useWallet()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [payoutLoading, setPayoutLoading] = useState(false)

  async function signAndSend() {
    if (!publicKey) {
      return
    }
    try {
      setLoading(true)
      const message = new TextEncoder().encode("Sign into mechanical turks as a worker")
      const signature = await signMessage?.(message)

      const response = await axios.post(`${BACKEND_URL}/v1/worker/signin`, {
        signature,
        publicKey: publicKey?.toString(),
      })

      setBalance(response.data.amount)
      localStorage.setItem("token", response.data.token)
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePayout() {
    try {
      setPayoutLoading(true)
      await axios.post(
        `${BACKEND_URL}/v1/worker/payout`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      )
      setBalance(0)
    } catch (error) {
      console.error("Payout error:", error)
    } finally {
      setPayoutLoading(false)
    }
  }

  useEffect(() => {
    if (publicKey) {
      signAndSend()
    }
  }, [publicKey])

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold logo-text">FreelanceChain</h1>
        </div>

        <div className="flex items-center gap-4">
          {publicKey && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary balance-pill">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="font-medium">{balance} SOL</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your current balance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {publicKey && (
            <Button
              onClick={handlePayout}
              variant="default"
              className="rounded-full"
              disabled={balance <= 0 || payoutLoading}
            >
              {payoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Withdraw {balance} SOL</>
              )}
            </Button>
          )}

          <ModeToggle />

          <div className="wallet-adapter-dropdown">
            {loading ? (
              <Button disabled className="rounded-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </Button>
            ) : publicKey ? (
              <WalletDisconnectButton />
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


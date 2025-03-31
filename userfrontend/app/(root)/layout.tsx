"use client"
import type React from "react"
import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { AuthProvider } from "@/context/auth-context"

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css")

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const network = WalletAdapterNetwork.Mainnet

  // You can also provide a custom RPC endpoint.
  const endpoint = "https://solana-mainnet.g.alchemy.com/v2/QSQzkvNoEfi5bWAxEOgec1QNqjFqH-d5"

  const wallets = useMemo(() => [], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}


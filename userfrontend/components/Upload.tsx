"use client"
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { UploadImage } from "@/components/UploadImage"
import { BACKEND_URL } from "@/utils"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export const Upload = () => {
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [txSignature, setTxSignature] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  async function onSubmit() {
    if (!isAuthenticated) {
      setError("Please connect your wallet and sign in first")
      return
    }

    if (!title) {
      setError("Please enter a task title")
      return
    }

    if (images.length === 0) {
      setError("Please upload at least one image")
      return
    }

    if (!txSignature) {
      setError("Please make a payment first")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axios.post(
        `${BACKEND_URL}/v1/user/task`,
        {
          options: images.map((image) => ({
            imageUrl: image,
          })),
          title,
          description,
          signature: txSignature,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      )

      router.push(`/task/${response.data.id}`)
    } catch (err) {
      console.error(err)
      setError("Failed to create task. Please try again.")
      setIsSubmitting(false)
    }
  }

  async function makePayment() {
    if (!isAuthenticated) {
      setError("Please connect your wallet and sign in first")
      return
    }

    if (!publicKey) {
      setError("Please connect your wallet first")
      return
    }

    // setPaymentStatus("processing")
    // setError(null)

    // try {
    //   const transaction = new Transaction().add(
    //     SystemProgram.transfer({
    //       fromPubkey: publicKey,
    //       toPubkey: new PublicKey(""),
    //       lamports: 100000000,
    //     }),
    //   )

    //   const {
    //     context: { slot: minContextSlot },
    //     value: { blockhash, lastValidBlockHeight },
    //   } = await connection.getLatestBlockhashAndContext()

    //   const signature = await sendTransaction(transaction, connection, { minContextSlot })

    //   await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
    //   setTxSignature(signature)
    //   setPaymentStatus("success")
    // } catch (err) {
    //   console.error(err)
    //   setPaymentStatus("error")
    //   setError("Payment failed. Please try again.")
    // }
    setPaymentStatus("success")
    setTxSignature("mock-signature for testing purposes")
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <section id="create-task" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text inline-block mb-4">Create a Task</h2>
          <p className="text-xl text-muted-foreground">Upload your images and create a new labeling task</p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-6 md:p-8 animate-fade-in">
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-800 dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-400">Please connect your wallet to create a task.</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="What is your task?"
                disabled={!isAuthenticated}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Task Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Provide additional details about your task..."
                disabled={!isAuthenticated}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Images <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {images.map((image, index) => (
                  <UploadImage key={index} image={image} onImageAdded={() => {}} onRemove={() => removeImage(index)} />
                ))}
              </div>

              {images.length < 4 && (
                <UploadImage
                  onImageAdded={(imageUrl) => {
                    setImages((prev) => [...prev, imageUrl])
                  }}
                  disabled={!isAuthenticated}
                />
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <button
                    onClick={makePayment}
                    disabled={paymentStatus === "processing" || paymentStatus === "success" || !isAuthenticated}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                      !isAuthenticated
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : paymentStatus === "success"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : paymentStatus === "processing"
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    }`}
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : paymentStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Payment Complete
                      </>
                    ) : (
                      "Make Payment (0.1 SOL)"
                    )}
                  </button>
                </div>

                <button
                  onClick={onSubmit}
                  disabled={isSubmitting || paymentStatus !== "success" || !isAuthenticated}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center justify-center ${
                    isSubmitting || paymentStatus !== "success" || !isAuthenticated
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


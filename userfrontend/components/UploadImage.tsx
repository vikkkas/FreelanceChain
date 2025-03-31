"use client"
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils"
import axios from "axios"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Loader2 } from "lucide-react"

export function UploadImage({
  onImageAdded,
  image,
  onRemove,
  disabled = false,
}: {
  onImageAdded: (image: string) => void
  image?: string
  onRemove?: () => void
  disabled?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    await uploadFile(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: uploading || disabled,
  })

  async function uploadFile(file: File) {
    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)

      const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      const presignedUrl = response.data.preSignedUrl
      const formData = new FormData()
      formData.set("bucket", response.data.fields["bucket"])
      formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"])
      formData.set("X-Amz-Credential", response.data.fields["X-Amz-Credential"])
      formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"])
      formData.set("key", response.data.fields["key"])
      formData.set("Policy", response.data.fields["Policy"])
      formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"])
      formData.append("file", file)

      await axios.post(presignedUrl, formData)
      clearInterval(progressInterval)
      setUploadProgress(100)

      onImageAdded(`${CLOUDFRONT_URL}/${response.data.fields["key"]}`)
    } catch (e) {
      console.error(e)
    } finally {
      setTimeout(() => {
        setUploading(false)
      }, 500)
    }
  }

  if (image) {
    return (
      <div className="relative group">
        <img
          className="w-full h-64 object-cover rounded-lg shadow-md"
          src={image || "/placeholder.svg"}
          alt="Uploaded image"
        />
        {onRemove && !disabled && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-foreground/80 text-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full h-64 rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center ${
        disabled
          ? "border-muted-foreground/20 bg-muted/20 cursor-not-allowed"
          : isDragActive
            ? "border-primary bg-primary/5 cursor-pointer"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
      }`}
    >
      <input {...getInputProps()} disabled={disabled} />

      {uploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <div className="text-sm text-muted-foreground mb-2">Uploading...</div>
          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{Math.round(uploadProgress)}%</div>
        </div>
      ) : (
        <>
          <Upload className={`h-10 w-10 mb-2 ${disabled ? "text-muted-foreground/50" : "text-muted-foreground"}`} />
          <p className={`text-sm text-center mb-1 ${disabled ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
            {disabled
              ? "Connect wallet to upload images"
              : isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
          </p>
          {!disabled && <p className="text-xs text-center text-muted-foreground">Supports JPG, PNG, GIF up to 10MB</p>}
        </>
      )}
    </div>
  )
}


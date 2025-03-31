import { toast } from "@/components/ui/use-toast"

export const BACKEND_URL = "https://freelancechain-do9x.onrender.com"
// export const BACKEND_URL = "http://localhost:3000";
export const CLOUDFRONT_URL = "https://d2szwvl7yo497w.cloudfront.net"
  
export const handleApiError = (error: any) => {
  console.error("API Error:", error)

  let message = "An unexpected error occurred"

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    message = error.response.data.message || `Error: ${error.response.status}`
  } else if (error.request) {
    // The request was made but no response was received
    message = "No response from server. Please check your connection."
  } else {
    // Something happened in setting up the request that triggered an Error
    message = error.message
  }

  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  })

  return message
}


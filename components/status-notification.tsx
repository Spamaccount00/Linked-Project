"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusNotificationProps {
  message: string
  status: "success" | "error" | "info"
  onClose: () => void
  duration?: number
}

export function StatusNotification({ message, status, onClose, duration = 5000 }: StatusNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 max-w-md p-4 rounded-lg shadow-lg transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        status === "success" && "bg-green-100 border-l-4 border-green-500 text-green-700",
        status === "error" && "bg-red-100 border-l-4 border-red-500 text-red-700",
        status === "info" && "bg-blue-100 border-l-4 border-blue-500 text-blue-700",
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">{message}</div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}


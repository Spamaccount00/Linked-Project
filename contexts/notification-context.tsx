"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { StatusNotification } from "@/components/status-notification"

type NotificationType = "success" | "error" | "info"

interface Notification {
  id: string
  message: string
  type: NotificationType
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type: NotificationType) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { id, message, type }])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      {notifications.map((notification) => (
        <StatusNotification
          key={notification.id}
          message={notification.message}
          status={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}


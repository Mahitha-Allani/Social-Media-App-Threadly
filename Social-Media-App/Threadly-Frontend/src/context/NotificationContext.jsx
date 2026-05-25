import { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { notificationApi } from '../api/notificationApi'
import { io } from 'socket.io-client'

export const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return
    try {
      const res = await notificationApi.getNotifications()
      setNotifications(res.data)
      const unread = res.data.filter(n => !n.read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }, [user])

  useEffect(() => {
    fetchNotifications()
  }, [user, fetchNotifications])

  // Establish socket.io connection
  useEffect(() => {
    if (!user?._id) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
    // Extract socket URL from VITE_API_BASE_URL (removing '/api' if it ends with it)
    const socketUrl = apiUrl.replace(/\/api$/, '')

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('Socket.io connected:', newSocket.id)
      newSocket.emit('register_user', user._id)
    })

    newSocket.on('new_notification', (notification) => {
      console.log('Real-time notification received via Socket.io:', notification)
      
      // Update notifications list and unread count
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)

      // Native browser notification helper
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
        const getNotifText = (n) => {
          const name = n.senderId?.name || n.senderId?.username || 'Someone'
          switch(n.type) {
            case 'like': return `${name} liked your post`
            case 'follow': return `${name} started following you`
            case 'comment': return `${name} replied to your post`
            case 'reply': return `${name} replied to your comment`
            case 'message': return `${name} sent you a message`
            default: return `${name} interacted with you`
          }
        }
        
        new window.Notification("Threadly", {
          body: getNotifText(notification),
          icon: notification.senderId?.profileImage || '/default-avatar.png'
        })
      }
    })

    setSocket(newSocket)

    // Request desktop notification permission if not yet decided
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission()
    }

    return () => {
      newSocket.disconnect()
    }
  }, [user])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markReadAll()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark notifications as read:", error)
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, refreshNotifications: fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

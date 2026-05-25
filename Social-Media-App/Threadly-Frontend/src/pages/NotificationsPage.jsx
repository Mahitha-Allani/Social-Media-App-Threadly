// NotificationsPage.jsx - Page that displays the user's notifications,
//  allowing them to see interactions such as likes, follows, comments, and messages.
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Spinner from '../components/common/Spinner'
import { card } from '../styles/common'
import { useNotifications } from '../context/NotificationContext'

const TYPE_BG = { like:'bg-red-50', follow:'bg-accent-light', comment:'bg-brand-blue-light', reply:'bg-brand-blue-light', message:'bg-cream-dark' }
const TYPE_ICON = { like:'❤️', follow:'👤', comment:'💬', reply:'💬', message:'✉️' }
//
function formatTime(ts) {
  const d = new Date(ts), now = new Date()  // Calculate time difference in seconds and return a human-readable string like "now", "5m", "2h", or a date for older notifications.
  const diff = Math.floor((now - d) / 1000)    // in seconds
  if (diff < 60) return 'now'              // less than a minute
  if (diff < 3600) return Math.floor(diff / 60) + 'm'   // less than an hour
  if (diff < 86400) return Math.floor(diff / 3600) + 'h'  // less than a day
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })  // else show date
}

export default function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotifications()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    markAllAsRead()
  }, [markAllAsRead])
// Helper to generate notification text based on type and sender info
  const getNotifText = (n) => {
    const name = n.senderId?.displayName || n.senderId?.name || n.senderId?.username || 'Someone'
    switch(n.type) {
      case 'like': return `${name} liked your post`
      case 'follow': return `${name} started following you`
      case 'comment': return `${name} commented on your post`
      case 'reply': return `${name} replied to your comment`
      case 'message': return `${name} sent you a message`
      default: return `${name} interacted with you`
    }
  }
// Main render
  return (
    <div>
      <Navbar title="Notifications" />
      {loading ? (
        <Spinner center />
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-muted">
          <span className="text-5xl opacity-20">🔔</span>
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        notifications.map(n => (
          <div key={n._id} className={n.read ? card.notifRead : card.notifUnread}>
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg shrink-0 ${TYPE_BG[n.type] || 'bg-cream-dark'}`}>
              {TYPE_ICON[n.type] || '🔔'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="text-[13px] sm:text-[14px] text-ink leading-snug font-medium">
                  {getNotifText(n)}
                </p>
                <span className="text-xs text-ink-muted shrink-0">{formatTime(n.createdAt)}</span>
              </div>
              {n.text && <p className="text-[12px] sm:text-[13px] text-ink-muted mt-0.5 truncate italic">{n.text}</p>}
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1" />}
          </div>
        ))
      )}
    </div>
  )
}

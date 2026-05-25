// This context manages direct message conversations, including fetching conversations, sending messages,
//  marking messages as read, and keeping track of friends for initiating new conversations.
import { createContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { messageApi } from '../api/messageApi'

export const DMContext = createContext(null)
// The DMProvider component wraps the app and provides DM-related state and functions to its children.
export function DMProvider({ children }) {
  const { user } = useAuth()
  const [convos, setConvos] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [friends, setFriends] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return // No user, no data
      try {
        const [profileRes, convosRes] = await Promise.all([ // Fetch user profile to get friends list
          userApi.getUserByUsername(user.username),
          messageApi.getConversations()
        ])
        // Extract friends from followers and following lists, ensuring uniqueness
        const profile = profileRes.data?.user
        // We use a Map to ensure uniqueness of friends from both followers and following lists
        //map is used to store unique friends by their ID, ensuring we don't have duplicates from followers and following lists. 
        if (profile) {
          const uniqueFriends = new Map()
          if (Array.isArray(profile.followers)) { // Check if followers is an array before iterating
              profile.followers.forEach(f => {
               if (typeof f === 'object' && f._id) uniqueFriends.set(f._id, { ...f, name: f.displayName || f.name || f.username || 'Unknown' })
             })
          }
          // similarly for following list, we check if it's an array and then iterate to add unique friends to the map. This way, we combine both lists without duplicates.
          if (Array.isArray(profile.following)) {
             profile.following.forEach(f => {
               if (typeof f === 'object' && f._id) uniqueFriends.set(f._id, { ...f, name: f.displayName || f.name || f.username || 'Unknown' })
             })
          }
          setFriends(Array.from(uniqueFriends.values()))
        }
// If conversations are successfully fetched, we set them in state. Each conversation includes the ID of the other user and the messages exchanged.
        if (convosRes.data) {
          setConvos(convosRes.data)
        }
      } catch (error) {
        console.error("Failed to fetch DM data", error)
      }
    }
    fetchData()
  }, [user])

//
  const getUser = (id) => friends.find(u => u._id === id) || { _id: id, name: 'Unknown User', username: 'unknown' }

  const getOrCreate = useCallback((withUserId) => {
    const existing = convos.find(c => c.with === withUserId)
    if (existing) { setActiveId(existing.id); return existing.id }
    
    // For new conversations, we use the other user's ID as the convo ID
    // so it matches the backend pattern where `with` and `id` are the other user's ID
    const newConvo = { id: withUserId, with: withUserId, messages: [] }
    setConvos(prev => [...prev, newConvo])
    setActiveId(newConvo.id)
    return newConvo.id
  }, [convos])
//
  const sendMessage = useCallback(async (convoId, senderId, text) => {
    // optimistic update
    const tempId = 'm' + Date.now()
    setConvos(prev => prev.map(c =>
      c.id !== convoId ? c : {
        ...c,
        messages: [...c.messages, {
          id: tempId, senderId, text,
          ts: new Date().toISOString(), read: false
        }]
      }
    ))
// API request
    try {
      const res = await messageApi.sendMessage(convoId, text)
      // update with actual DB payload
      setConvos(prev => prev.map(c =>
        c.id !== convoId ? c : {
          ...c,
          messages: c.messages.map(m => m.id === tempId ? { ...m, id: res.data.id, ts: res.data.ts } : m)
        }
      ))
    } catch (err) {
      console.error("Failed to send message", err)
    }
  }, [])

  const markRead = useCallback(async (convoId) => {
    // Optimistic UI update
    setConvos(prev => prev.map(c =>
      c.id !== convoId ? c : {
        ...c, messages: c.messages.map(m => m.senderId !== user?._id ? { ...m, read: true } : m)
      }
    ))
    
    // API request
    try {
      await messageApi.markRead(convoId)
    } catch (err) {
      console.error("Failed to mark read", err)
    }
  }, [user])
// The refreshConvos function can be called to re-fetch the conversations from the backend, useful for syncing state after certain actions or on app focus.
  const refreshConvos = useCallback(async () => {
    try {
      const convosRes = await messageApi.getConversations()
      if (convosRes.data) {
        setConvos(convosRes.data)
      }
    } catch (err) {
      console.error("Failed to refresh conversations", err)
    }
  }, [])
//
  const unreadCount = convos.reduce((acc, c) =>
    acc + c.messages.filter(m => m.read === false && m.senderId !== user?._id).length, 0)//

  return (
    <DMContext.Provider value={{ convos, activeId, setActiveId, getUser, getOrCreate, sendMessage, markRead, unreadCount, friends, refreshConvos }}>
      {children}
    </DMContext.Provider>
  )
}
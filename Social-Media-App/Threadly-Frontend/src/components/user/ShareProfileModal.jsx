import { useEffect, useState, useContext } from 'react'
import { createPortal } from 'react-dom'
import Spinner from '../common/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { DMContext } from '../../context/DMContext'
import axiosInstance from '../../api/axiosInstance'
import { userApi } from '../../api/userApi'

const AVATAR_COLORS = [
  { bg: '#EEF2FF', color: '#4F46E5' },
  { bg: '#F0FDF4', color: '#16A34A' },
  { bg: '#FFF7ED', color: '#EA580C' },
  { bg: '#FDF2F8', color: '#DB2777' },
  { bg: '#EFF6FF', color: '#2563EB' },
  { bg: '#F0FDFA', color: '#0D9488' },
]

function getInitials(name) {
  return (name || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const SHARE_OPTIONS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    bg: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )
  },
  {
    id: 'instagram',
    label: 'Instagram',
    bg: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )
  },
  {
    id: 'x',
    label: 'X',
    bg: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    id: 'facebook',
    label: 'Facebook',
    bg: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    id: 'gmail',
    label: 'Gmail',
    bg: '#EA4335',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.907 1.528-1.148C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    )
  },
  {
    id: 'copy',
    label: 'Copy link',
    bg: '#6B7280',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="22" height="22">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    )
  },
  {
    id: 'more',
    label: 'More',
    bg: '#E5E7EB',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="5" cy="12" r="2" fill="#374151"/>
        <circle cx="12" cy="12" r="2" fill="#374151"/>
        <circle cx="19" cy="12" r="2" fill="#374151"/>
      </svg>
    )
  }
]

function ShareProfileModalContent({ profileUser, onClose }) {
  const { user } = useAuth()
  const { refreshConvos } = useContext(DMContext)

  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [sent, setSent] = useState(false)
  const [visible, setVisible] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const profileUrl = `${window.location.origin}/profile/${profileUser?.username}`
  const shareText = `Check out ${profileUser?.name || 'this profile'} on Threadly!\n${profileUrl}`

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true))
    )
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  useEffect(() => {
    async function fetchFriends() {
      try {
        if (!user?.username) return
        const res = await userApi.getUserByUsername(user.username)
        const profile = res.data?.user
        
        if (profile) {
          const uniqueFriends = new Map()
          if (Array.isArray(profile.followers)) {
            profile.followers.forEach(f => {
              if (typeof f === 'object' && f._id) {
                uniqueFriends.set(f._id, {
                  ...f,
                  name: f.name || f.username || 'Unknown'
                })
              }
            })
          }
          if (Array.isArray(profile.following)) {
            profile.following.forEach(f => {
              if (typeof f === 'object' && f._id) {
                uniqueFriends.set(f._id, {
                  ...f,
                  name: f.name || f.username || 'Unknown'
                })
              }
            })
          }
          setUsers(Array.from(uniqueFriends.values()))
        }
      } catch (err) {
        console.error('fetchFriends error:', err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) fetchFriends()
  }, [user])

  function toggleUser(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function handleSend() {
    if (!selected.length) return
    try {
      await Promise.all(
        selected.map(recipientId =>
          axiosInstance.post('/messages', { receiverId: recipientId, text: '', profileId: profileUser._id })
        )
      )
      setSent(true)
      // Refresh DM conversations so the shared profile link appears
      refreshConvos()
      setTimeout(() => { setSent(false); setSelected([]); handleClose() }, 1800)
    } catch (err) {
      console.error('Failed to send profile link in DM', err)
    }
  }

  async function handleShareOption(id) {
    if (id === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
    } else if (id === 'instagram') {
      await navigator.clipboard.writeText(profileUrl)
      window.open('https://www.instagram.com/', '_blank')
    } else if (id === 'x') {
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')
    } else if (id === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank')
    } else if (id === 'gmail') {
      window.open(`mailto:?subject=${encodeURIComponent('Check out this profile')}&body=${encodeURIComponent(shareText)}`, '_blank')
    } else if (id === 'copy') {
      await navigator.clipboard.writeText(profileUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } else if (id === 'more') {
      if (navigator.share) {
        navigator.share({ title: `${profileUser?.name}'s Profile`, text: shareText, url: profileUrl }).catch(() => {})
      }
    }
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute', inset: 0,
          background: visible ? 'rgba(0,0,0,0.52)' : 'rgba(0,0,0,0)',
          transition: 'background 0.3s ease',
        }}
      />

      {/* Sent toast */}
      {sent && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.82)', borderRadius: 20,
            padding: '24px 44px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#F97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: 'white', fontWeight: 700
            }}>✓</div>
            <span style={{ color: 'white', fontWeight: 600, fontSize: 15, letterSpacing: 0.3 }}>Sent!</span>
          </div>
        </div>
      )}

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 1,
          display: 'flex', justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%', maxWidth: 560,
            background: '#ffffff',
            borderRadius: '22px 22px 0 0',
            paddingBottom: 32,
            transform: visible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
            maxHeight: '88vh',
            overflowY: 'auto',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.18)',
          }}
        >
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 6 }}>
            <div style={{ width: 38, height: 4, background: '#D1D5DB', borderRadius: 9999 }} />
          </div>

          <div style={{ padding: '6px 22px 0' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>Share Profile</span>
              <button
                onClick={handleClose}
                style={{
                  border: 'none', background: '#F3F4F6', borderRadius: '50%',
                  width: 32, height: 32, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, color: '#4B5563',
                }}
              >✕</button>
            </div>

            {/* Search Input for followers */}
            {users.length > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#F3F4F6', borderRadius: 12,
                padding: '8px 12px', marginBottom: 16
              }}>
                <span style={{ color: '#9CA3AF', fontSize: 14 }}>◎</span>
                <input
                  type="text"
                  placeholder="Search followers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    outline: 'none', fontSize: 14, color: '#111827'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF', fontSize: 12 }}
                  >✕</button>
                )}
              </div>
            )}

            {/* Send to */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Send to Followers
            </p>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 22px' }}>
                <Spinner />
              </div>
            ) : users.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 22, textAlign: 'center' }}>
                Followers and following list is empty. Follow people to share profiles.
              </p>
            ) : filteredUsers.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 22, textAlign: 'center' }}>
                No followers found matching "{searchQuery}"
              </p>
            ) : (
              <>
                <div style={{ overflowX: 'auto', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 20, paddingBottom: 10, paddingTop: 4, minWidth: 'max-content' }}>
                    {filteredUsers.map((u, i) => {
                      const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
                      const active = selected.includes(u._id)
                      return (
                        <button
                          key={u._id || u.username}
                          onClick={() => toggleUser(u._id)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 7, background: 'none', border: 'none', cursor: 'pointer',
                            padding: 0, minWidth: 68
                          }}
                        >
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              width: 66, height: 66, borderRadius: '50%',
                              padding: active ? 2.5 : 0,
                              background: active
                                ? 'linear-gradient(135deg, #F97316, #FB923C)'
                                : 'transparent',
                              border: active ? 'none' : '2.5px solid #E5E7EB',
                              boxSizing: 'border-box',
                              transition: 'all 0.15s ease',
                            }}>
                              <div style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                border: active ? '2.5px solid white' : 'none',
                                overflow: 'hidden',
                                background: u.profileImage ? 'transparent' : color.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 16, color: color.color,
                              }}>
                                {u.profileImage
                                  ? <img src={
                                      u.profileImage.startsWith('http') || u.profileImage.startsWith('blob:')
                                        ? u.profileImage
                                        : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''}${u.profileImage}`
                                    } alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  : getInitials(u.name)
                                }
                              </div>
                            </div>
                            {active && (
                              <div style={{
                                position: 'absolute', bottom: 1, right: 1,
                                width: 22, height: 22, borderRadius: '50%',
                                background: '#F97316', border: '2.5px solid white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: 11, fontWeight: 700
                              }}>✓</div>
                            )}
                          </div>
                          <span style={{
                            fontSize: 12, color: active ? '#F97316' : '#374151',
                            fontWeight: active ? 600 : 400,
                            maxWidth: 68, overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center',
                            transition: 'color 0.15s'
                          }}>
                            {u.username || u.name || 'User'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!selected.length}
                  style={{
                    width: '100%', padding: '14px 0',
                    borderRadius: 14, border: 'none',
                    cursor: selected.length ? 'pointer' : 'default',
                    background: selected.length ? '#F97316' : '#E5E7EB',
                    color: selected.length ? 'white' : '#9CA3AF',
                    fontWeight: 700, fontSize: 15,
                    marginBottom: 22,
                    transition: 'background 0.2s, color 0.2s'
                  }}
                >
                  {selected.length
                    ? `Send to ${selected.length} ${selected.length === 1 ? 'person' : 'people'}`
                    : 'Select followers to send'}
                </button>
              </>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: '#F3F4F6', marginBottom: 22 }} />

            {/* Share via */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
              Share via
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px 0', marginBottom: 8 }}>
              {SHARE_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleShareOption(opt.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0'
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: 18,
                    background: opt.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {opt.icon}
                  </div>
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>
                    {opt.id === 'copy' && copiedLink ? '✓ Copied!' : opt.label}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShareProfileModal({ profileUser, onClose }) {
  return createPortal(
    <ShareProfileModalContent profileUser={profileUser} onClose={onClose} />,
    document.body
  )
}

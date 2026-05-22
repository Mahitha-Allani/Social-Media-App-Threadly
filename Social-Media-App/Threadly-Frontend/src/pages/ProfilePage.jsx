import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Avatar from '../components/common/Avatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import PostCard from '../components/post/PostCard'
import FollowButton from '../components/user/FollowButton'
import UserCard from '../components/user/UserCard'
import ShareProfileModal from '../components/user/ShareProfileModal'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { postApi } from '../api/postApi'
import { profile, text, btn, input, misc } from '../styles/common'

export default function ProfilePage() {
  const { username } = useParams()
  const { user: currentUser, updateUser } = useAuth()
  const { posts, loading, toggleLike, toggleBookmark, sharePost, addComment, deletePost } = usePosts()
  const [profileUser, setProfileUser] = useState(null)
  const [profilePosts, setProfilePosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [profileLoading, setProfileLoading] = useState(true)
  const [likedLoading, setLikedLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: currentUser?.name || '', bio: currentUser?.bio || '' })
  const [activeTab, setActiveTab] = useState('posts')
  const [followModal, setFollowModal] = useState({ isOpen: false, type: 'followers' })
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setFollowModal(prev => ({ ...prev, isOpen: false }))
    setActiveTab('posts')
    setLikedPosts([])

    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        const response = await userApi.getUserByUsername(username)
        const { user } = response.data
        setProfileUser(user)

        if (user._id) {
          const postsResponse = await postApi.getUserPosts(user._id)
          const formattedPosts = (postsResponse.data || []).map(p => ({
            ...p,
            userId: {
              _id: p.author?._id || p.author,
              name: p.author?.displayName || p.author?.username || 'Unknown',
              username: p.author?.username,
              verified: p.author?.verified || false,
              profileImage: p.author?.profileImage || p.author?.profilePicture,
              profilePicture: p.author?.profileImage || p.author?.profilePicture
            }
          }))
          setProfilePosts(formattedPosts)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfileUser(null)
        setProfilePosts([])
      } finally {
        setProfileLoading(false)
      }
    }

    if (username) fetchProfile()
  }, [username])

  // Fetch liked posts when Likes tab is clicked
  const handleTabChange = async (tab) => {
    setActiveTab(tab)

    if (tab === 'likes' && likedPosts.length === 0 && profileUser?._id) {
      try {
        setLikedLoading(true)

        // Try dedicated liked posts endpoint first
        let fetchedLiked = []
        try {
          const res = await postApi.getLikedPosts(profileUser._id)
          fetchedLiked = res.data || []
        } catch {
          // Fallback: filter all posts where likes includes this user's id
          const allPostsRes = await postApi.getAllPosts?.()
          const allPosts = allPostsRes?.data || []
          fetchedLiked = allPosts.filter(p =>
            Array.isArray(p.likes) && p.likes.includes(profileUser._id)
          )
        }

        const formatted = fetchedLiked.map(p => ({
          ...p,
          userId: {
            _id: p.author?._id || p.userId?._id || p.author,
            name: p.author?.displayName || p.author?.name || p.userId?.name || 'Unknown',
            username: p.author?.username || p.userId?.username,
            verified: p.author?.verified || p.userId?.verified || false,
            profileImage: p.author?.profileImage || p.author?.profilePicture || p.userId?.profileImage || p.userId?.profilePicture,
            profilePicture: p.author?.profileImage || p.author?.profilePicture || p.userId?.profileImage || p.userId?.profilePicture
          }
        }))
        setLikedPosts(formatted)
      } catch (err) {
        console.error('Error fetching liked posts:', err)
        setLikedPosts([])
      } finally {
        setLikedLoading(false)
      }
    }
  }

  const isOwn = profileUser?._id === currentUser?._id || profileUser?.username === currentUser?.username

  const handleLike = async (postId) => {
    const toggle = (list) => list.map(p => {
      if (p._id !== postId) return p
      const isLiked = p.likes?.includes(currentUser?._id)
      return {
        ...p,
        likes: isLiked
          ? p.likes.filter(id => id !== currentUser?._id)
          : [...(p.likes || []), currentUser?._id]
      }
    })
    setProfilePosts(toggle)
    setLikedPosts(toggle)
    try {
      if (currentUser) await postApi.likePost(postId)
    } catch (err) { }
  }

  const handleBookmark = async (postId) => {
    const toggle = (list) => list.map(p => {
      if (p._id !== postId) return p
      const isBookmarked = p.bookmarks?.includes(currentUser?._id)
      return {
        ...p,
        bookmarks: isBookmarked
          ? p.bookmarks.filter(id => id !== currentUser?._id)
          : [...(p.bookmarks || []), currentUser?._id]
      }
    })
    setProfilePosts(toggle)
    setLikedPosts(toggle)
    try {
      if (currentUser) await postApi.bookmarkPost(postId)
    } catch (err) { }
  }

  const handleShare = async (postId) => {
    const toggle = (list) => list.map(p => {
      if (p._id !== postId) return p
      const isShared = p.shares?.includes(currentUser?._id)
      return {
        ...p,
        shares: isShared
          ? p.shares.filter(id => id !== currentUser?._id)
          : [...(p.shares || []), currentUser?._id]
      }
    })
    setProfilePosts(toggle)
    setLikedPosts(toggle)
    try {
      if (currentUser) await postApi.sharePost(postId)
    } catch (err) { }
  }

  const handleAddComment = async (postId, comment) => {
    const newComment = {
      _id: Date.now().toString(),
      user: {
        _id: currentUser?._id,
        name: currentUser?.name || 'User',
        username: currentUser?.username,
        profileImage: currentUser?.profileImage || currentUser?.profilePicture,
        profilePicture: currentUser?.profileImage || currentUser?.profilePicture
      },
      content: comment,
      createdAt: new Date().toISOString()
    }
    const update = (list) => list.map(p =>
      p._id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
    )
    setProfilePosts(update)
    setLikedPosts(update)
    try {
      await postApi.addComment(postId, comment)
    } catch (err) { }
  }

  const handleDeletePost = async (postId) => {
    setProfilePosts(prev => prev.filter(p => p._id !== postId))
    setLikedPosts(prev => prev.filter(p => p._id !== postId))
    try {
      await postApi.deletePost(postId)
    } catch (err) { }
  }

  const PALETTE = ['#c2603b', '#3b7ac2', '#3b8c5a', '#8c3b7a', '#7a8c3b']
  const bannerColor = PALETTE[(profileUser?._id?.charCodeAt?.(1) || 0) % PALETTE.length]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEditSave = async () => {
    setUploadingImage(true)
    try {
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        const imgRes = await userApi.uploadProfilePicture(formData)
        const newImageUrl = imgRes.data.profileImage
        updateUser({ name: editForm.name, bio: editForm.bio, profileImage: newImageUrl })
        setProfileUser(prev => ({ ...prev, name: editForm.name, bio: editForm.bio, profileImage: newImageUrl }))
      } else {
        updateUser({ name: editForm.name, bio: editForm.bio })
        setProfileUser(prev => ({ ...prev, name: editForm.name, bio: editForm.bio }))
      }
      await userApi.updateProfile({ name: editForm.name, bio: editForm.bio })
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setUploadingImage(false)
      setImageFile(null)
      setImagePreview(null)
      setEditOpen(false)
    }
  }

  const handleShareProfile = () => {
    setShareModalOpen(true)
  }

  if (profileLoading) return <div><Navbar title="Profile" showBack /><Spinner center /></div>
  if (!profileUser) return <div><Navbar title="Profile" showBack /><div className={misc.emptyState}>User not found</div></div>

  const displayPosts = activeTab === 'posts' ? profilePosts : likedPosts

  return (
    <div>
      <Navbar title={profileUser?.name || 'Profile'} showBack />

      {/* Banner */}
      <div className={profile.banner} style={{ background: `linear-gradient(135deg,${bannerColor}28,${bannerColor}55)` }}>
        <div className="absolute -bottom-7 left-4 sm:left-5">
          <Avatar user={profileUser} size="lg" className="border-[3px] border-cream" />
        </div>
        <div className="absolute top-3 right-3 sm:right-4 flex items-center gap-2">
          <button className={btn.secondarySm} onClick={handleShareProfile} title="Share Profile">
            {shareCopied ? '✓ Copied!' : '↗ Share'}
          </button>
          {isOwn
            ? <button className={btn.secondarySm} onClick={() => setEditOpen(true)}>Edit Profile</button>
            : <FollowButton targetUserId={profileUser?._id} size="sm" />}
        </div>
      </div>

      {/* Info */}
      <div className={profile.info}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-display text-[19px] sm:text-[22px] font-bold text-ink flex items-center gap-1.5 flex-wrap">
              {profileUser?.name}
              {profileUser?.verified && <VerifiedBadge />}
            </h2>
            <div className={`${text.username} mb-2`}>@{profileUser?.username}</div>
          </div>
        </div>
        {profileUser?.bio && <p className={`${text.bodyMd} mb-3`}>{profileUser.bio}</p>}
        <div className="flex gap-4 sm:gap-6 flex-wrap">
          <span className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setFollowModal({ isOpen: true, type: 'following' })}>
            <strong className={text.stat}>{profileUser?.following?.length || 0}</strong> <span className={text.statLabel}>Following</span>
          </span>
          <span className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setFollowModal({ isOpen: true, type: 'followers' })}>
            <strong className={text.stat}>{profileUser?.followers?.length || 0}</strong> <span className={text.statLabel}>Followers</span>
          </span>
          <span>
            <strong className={text.stat}>{profilePosts.length}</strong> <span className={text.statLabel}>Posts</span>
          </span>
        </div>
      </div>
{/* Tabs — likes tab only visible on own profile */}
<div className={profile.tabBar}>
  {(isOwn ? ['posts', 'likes'] : ['posts']).map(tab => (
    <button
      key={tab}
      className={activeTab === tab ? profile.tabActive : profile.tab}
      onClick={() => handleTabChange(tab)}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  ))}
</div>

      {/* Posts / Likes */}
      {(activeTab === 'likes' && likedLoading) ? (
        <Spinner center />
      ) : displayPosts.length === 0 ? (
        <div className={misc.emptyState}>
          <span className={misc.emptyIcon}>◻</span>
          <span className="text-[15px]">
            {activeTab === 'posts' ? 'No posts yet' : 'No liked posts yet'}
          </span>
        </div>
      ) : displayPosts.map(p => (
        <PostCard
          key={p._id}
          post={p}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onShare={handleShare}
          onAddComment={handleAddComment}
          onDeletePost={isOwn && activeTab === 'posts' ? handleDeletePost : null}
          onEditPost={isOwn && activeTab === 'posts' ? async (postId, content) => {
            setProfilePosts(prev => prev.map(post => post._id === postId ? { ...post, content } : post))
            setLikedPosts(prev => prev.map(post => post._id === postId ? { ...post, content } : post))
            try {
              await postApi.updatePost(postId, content)
            } catch (err) {
              console.error('Error updating post:', err)
            }
          } : null}
        />
      ))}

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => { setEditOpen(false); setImageFile(null); setImagePreview(null) }} title="Edit Profile">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <Avatar user={profileUser} size="xl" />
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-lg">📷</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <span className="text-xs text-ink-muted">Click to change photo</span>
          </div>
          {[{ key: 'name', label: 'Display Name' }, { key: 'bio', label: 'Bio', multi: true }].map(f => (
            <div key={f.key}>
              <label className={text.label}>{f.label}</label>
              {f.multi
                ? <textarea value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} rows={3} className={input.textarea} />
                : <input type="text" value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} className={input.base} />}
            </div>
          ))}
          <div className="flex gap-2.5 mt-1">
            <button className={btn.secondaryLg} onClick={() => { setEditOpen(false); setImageFile(null); setImagePreview(null) }}>Cancel</button>
            <button className={btn.primaryLg} onClick={handleEditSave} disabled={uploadingImage}>
              {uploadingImage ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Followers/Following Modal */}
      <Modal isOpen={followModal.isOpen} onClose={() => setFollowModal(p => ({ ...p, isOpen: false }))} title={followModal.type === 'followers' ? 'Followers' : 'Following'}>
        <div className="flex flex-col max-h-[60vh] overflow-y-auto no-scrollbar">
          {followModal.type === 'followers' ? (
            profileUser?.followers?.length > 0
              ? profileUser.followers.map(u => <UserCard key={u._id} user={u} compact />)
              : <div className="p-4 text-center text-ink-light">No followers yet</div>
          ) : (
            profileUser?.following?.length > 0
              ? profileUser.following.map(u => <UserCard key={u._id} user={u} compact />)
              : <div className="p-4 text-center text-ink-light">Not following anyone yet</div>
          )}
        </div>
      </Modal>

      {/* Share Profile Modal */}
      {shareModalOpen && (
        <ShareProfileModal profileUser={profileUser} onClose={() => setShareModalOpen(false)} />
      )}
    </div>
  )
}
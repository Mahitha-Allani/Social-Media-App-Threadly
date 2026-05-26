// HomePage.jsx - Main feed page that displays the user's feed, allows creating new posts, and shows suggested users and trending posts in the sidebar.
// This page uses the usePosts hook to manage post-related actions and the useAuth hook to access user information.
//  It also fetches suggested users and trending posts to display in the right sidebar.     
import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import CreatePostForm from '../components/post/CreatePostForm'
import PostCard from '../components/post/PostCard'
import Spinner from '../components/common/Spinner'
import UserCard from '../components/user/UserCard'
import Avatar from '../components/common/Avatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../api/userApi'
import { card, text } from '../styles/common'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
    posts,
    loading,
    createPost,
    updatePost,
    toggleLike,
    toggleBookmark,
    sharePost,
    addComment,
    addReply,
    deletePost
  } = usePosts()

  const [searchParams] = useSearchParams()
  const shouldFocus = searchParams.get('new_post')

  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [trendingSeed, setTrendingSeed] = useState(0)

  // Shuffle helper
  const shuffleArray = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5)
  }

  // Trending posts with refresh mix
  const trendingPosts = useMemo(() => {
    if (!posts.length) return []

    const otherPosts = posts.filter(
      p => p.userId?._id !== user?._id && p.content
    )

    return shuffleArray(otherPosts).slice(0, 8)
  }, [posts, user?._id, trendingSeed])

  // Fetch + shuffle suggested users
  const fetchSuggestedUsers = async () => {
    try {
      const res = await userApi.getSuggestedUsers()
      const shuffled = shuffleArray(res.data)
      setSuggestedUsers(shuffled.slice(0, 8))
    } catch (error) {
      console.error('Failed to fetch suggested users:', error)
    }
  }

  useEffect(() => {
    fetchSuggestedUsers()
  }, [])

  const handleCreatePost = async (content, image) => {
    if (user) {
      createPost(content, image, user)
    }
  }

  // Refresh handlers
  const refreshUsers = () => {
    fetchSuggestedUsers()
  }

  const refreshTrending = () => {
    setTrendingSeed(prev => prev + 1)
  }

  return (
    <div className="flex min-h-screen">
      
      {/* Main Feed */}
      <div className="flex-1 min-w-0 border-r border-cream-border">
        <Navbar title="Home" />

        <CreatePostForm
          onPost={handleCreatePost}
          shouldFocus={shouldFocus}
        />

        {loading ? (
          <Spinner center />
        ) : (
          posts.map((p, i) => (
            <div
              key={p._id}
              style={{
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`
              }}
            >
              <PostCard
                post={p}
                onLike={id => toggleLike(id, user?._id)}
                onBookmark={id => toggleBookmark(id, user?._id)}
                onShare={id => sharePost(id, user?._id)}
                onAddComment={(postId, comment) =>
                  addComment(postId, comment, user)
                }
                onAddReply={(postId, commentId, txt) =>
                  addReply(postId, commentId, txt, user)
                }
                onDeletePost={deletePost}
                onEditPost={updatePost}
              />
            </div>
          ))
        )}
      </div>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex w-80 shrink-0 p-5 flex-col gap-5">

        {/* Suggested Users */}
        <div className={card.section}>
          
          <div className="px-4 py-3 border-b border-cream-border flex items-center justify-between">
            <h3 className={text.h3}>Who to follow</h3>

            <button
              onClick={refreshUsers}
              className="text-xs px-2 py-1 rounded-md bg-cream-dark hover:bg-cream-border transition"
            >
              Refresh
            </button>
          </div>

          {/* Individually Scrollable */}
          <div className="px-4 max-h-95 overflow-y-auto custom-scrollbar">
            {suggestedUsers.length === 0 ? (
              <div className="py-4 text-sm text-ink-muted text-center">
                No suggestions
              </div>
            ) : (
              suggestedUsers.map(u => (
                <UserCard
                  key={u._id}
                  user={u}
                  compact
                />
              ))
            )}
          </div>
        </div>

        {/* Trending Posts */}
        <div className={card.section}>
          
          <div className="px-4 py-3 border-b border-cream-border flex items-center justify-between">
            <h3 className={text.h3}>Trending Posts</h3>

            <button
              onClick={refreshTrending}
              className="text-xs px-2 py-1 rounded-md bg-cream-dark hover:bg-cream-border transition"
            >
              Refresh
            </button>
          </div>

          {/* Individually Scrollable */}
          <div className="max-h-95 overflow-y-auto custom-scrollbar">

            {trendingPosts.length === 0 ? (
              <div className="px-4 py-5 text-center text-ink-muted text-sm">
                No posts yet
              </div>
            ) : (
              trendingPosts.map((p) => (
                <div
                  key={p._id}
                  className="px-4 py-3 hover:bg-cream-dark transition-colors cursor-pointer border-b border-cream-border last:border-0"
                  onClick={() => navigate(`/post/${p._id}`)}
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Avatar user={p.userId} size="xs" />

                    <span className="font-semibold text-[13px] text-ink truncate">
                      {p.userId?.name || 'Unknown'}
                    </span>
                    {p.userId?.verified && <VerifiedBadge size={11} />}

                    <span className="text-[11px] text-ink-muted truncate">
                      @{p.userId?.username}
                    </span>
                  </div>

                  <p
                    className="text-[13px] text-ink-light leading-snug line-clamp-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {p.content}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-ink-muted flex items-center gap-0.5">
                      ♡ {p.likes?.length || 0}
                    </span>

                    <span className="text-[11px] text-ink-muted flex items-center gap-0.5">
                      💬 {p.comments?.length || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
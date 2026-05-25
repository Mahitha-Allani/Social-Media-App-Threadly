// PostDetailPage.jsx - Page that shows the details of a single post, including its content, likes, bookmarks, and comments.
// This page uses the usePosts hook to manage post-related actions and the useAuth hook to access user information.
// It also uses the useParams hook from react-router-dom to get the post ID from the URL and fetch the corresponding post details from the list of posts in state.
import { useParams } from 'react-router-dom'

import Navbar from '../components/layout/Navbar'
import PostCard from '../components/post/PostCard'
import Spinner from '../components/common/Spinner'

import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'

import { text, misc } from '../styles/common'

export default function PostDetailPage() {

  const { id } = useParams()

  const { user } = useAuth()

  const {
    posts,
    loading,
    toggleLike,
    toggleBookmark,
    addComment,
    addReply,
    deletePost,
    updatePost
  } = usePosts()

  const post =
    posts.find(p => p._id === id)
// If the posts are still loading, display a spinner to indicate that the content is being fetched from the server.
  if (loading) {

    return (
      <>
        <Navbar title="Post" showBack />
        <Spinner center />
      </>
    )
  }
// If no post is found with the given ID, display an empty state message to the user indicating that the post was not found.
  if (!post) {

    return (
      <>
        <Navbar title="Post" showBack />

        <div className={misc.emptyState}>

          <span className={misc.emptyIcon}>
            ◻
          </span>

          <span className="text-[16px]">
            Post not found.
          </span>

        </div>
      </>
    )
  }
// If the post is found and loaded, render the post details using the PostCard component, along with the list of comments and replies.
  return (
    <div>

      <Navbar
        title="Post"
        showBack
      />

      <PostCard
        post={post}

        onLike={id =>
          toggleLike(id, user?._id)
        }

        onBookmark={id =>
          toggleBookmark(id, user?._id)
        }

        onAddComment={(postId, comment) =>
          addComment(postId, comment, user)
        }

        onAddReply={(postId, commentId, txt) =>
          addReply(postId, commentId, txt, user)
        }

        onDeletePost={deletePost}

        onEditPost={updatePost}

        compact
      />

      {/* REPLIES */}
      <div className="px-3 sm:px-5 pt-3 pb-2 border-b border-cream-border">

        <h3 className={`${text.h3} text-ink-muted`}>
          Replies ({post.comments?.length || 0})
        </h3>

      </div>

      {
        (!post.comments || post.comments.length === 0)

        ? (

          <div className="px-4 sm:px-5 py-8 text-center text-ink-muted text-[13px] sm:text-[14px]">

            No replies yet. Be the first!

          </div>

        )

        : post.comments.map(c => (

          <div
            key={c._id}
            className="flex gap-2.5 sm:gap-3 px-3 sm:px-5 py-3 sm:py-3.5 border-b border-cream-border"
          >

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent-light border-2 border-accent/30 flex items-center justify-center font-bold text-xs text-accent shrink-0">

              {
                c.userId?.name
                  ?.split(' ')
                  .map(w => w[0])
                  .join('') || 'U'
              }

            </div>

            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-1.5 mb-1 flex-wrap">

                <span className="font-bold text-[13px] sm:text-[14px] text-ink">
                  {c.userId?.name || 'User'}
                </span>

                <span className={text.metaSm}>
                  @{c.userId?.username || 'user'}
                </span>

              </div>

              <p className="text-[13px] sm:text-[14px] text-ink-light">
                {c.content}
              </p>

            </div>

          </div>
        ))
      }

    </div>
  )
}
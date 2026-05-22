import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Avatar from '../common/Avatar'
import VerifiedBadge from '../common/VerifiedBadge'
import PostActions from './PostActions'
import CommentList from './CommentList'
import ShareModal from './ShareModal'

import { formatDate } from '../../utils/formatDate'
import { useAuth } from '../../hooks/useAuth'
import { post as P, text } from '../../styles/common'

export default function PostCard({
  post,
  onLike,
  onBookmark,
  onAddComment,
  onAddReply,
  onDeletePost,
  onEditPost,
  compact = false
}) {

  const { user } = useAuth()

  const navigate = useNavigate()

  const [showComments, setShowComments] =
    useState(false)

  const [showShare, setShowShare] =
    useState(false)

  const [showMenu, setShowMenu] =
    useState(false)

  const [editing, setEditing] =
    useState(false)

  const [editText, setEditText] =
    useState(post.content)

  // IMPORTANT
  // Update textarea value whenever post content changes
  useEffect(() => {
    setEditText(post.content)
  }, [post.content])

  const author = post.userId

  const isOwn =
    user?._id === (author?._id || author)

  const handleClick = e => {

    if (
      e.target.closest('button') ||
      e.target.closest('input') ||
      e.target.closest('textarea')
    ) return

    if (!compact) {
      navigate(`/post/${post._id}`)
    }
  }

  const imageUrl =
    !post.image
      ? ''
      : post.image.startsWith('http') ||
        post.image.startsWith('blob:')
      ? post.image
      : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${post.image}`

  return (
    <>
      <article
        onClick={handleClick}
        className={
          compact
            ? P.wrapperStatic
            : P.wrapper
        }
      >

        <div className={P.body}>

          {/* AVATAR */}
          <div
            onClick={e => {
              e.stopPropagation()
              navigate(`/profile/${author?.username}`)
            }}
            className="cursor-pointer shrink-0"
          >

            <Avatar
              user={author}
              size="md"
            />

          </div>

          <div className="flex-1 min-w-0">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-1 mb-1">

              <div className="flex items-center gap-1 flex-wrap min-w-0">

                <span
                  className={P.authorName}
                  onClick={e => {
                    e.stopPropagation()
                    navigate(`/profile/${author?.username}`)
                  }}
                >
                  {author?.name || 'Unknown'}
                </span>

                {author?.verified && (
                  <VerifiedBadge size={13} />
                )}

                <span className="hidden xs:inline text-[12px] sm:text-[13px] text-ink-muted truncate">
                  @{author?.username}
                </span>

                <span className="text-sand text-xs">
                  ·
                </span>

                <span className={text.metaSm}>
                  {formatDate(post.createdAt)}
                </span>

              </div>

              {/* 3 DOT MENU */}
              {isOwn && (

                <div className="relative">

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setShowMenu(prev => !prev)
                    }}
                    className="shrink-0 text-ink-muted hover:text-black text-xl px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    ⋯
                  </button>

                  {showMenu && (

                    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 w-40">

                      {/* EDIT */}
                      <button
                        onClick={e => {
                          e.stopPropagation()

                          setEditing(true)

                          setEditText(post.content)

                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm border-0 bg-transparent cursor-pointer"
                      >
                        ✏️ Edit Post
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={e => {
                          e.stopPropagation()

                          setShowMenu(false)

                          const confirmDelete =
                            window.confirm(
                              'Delete this post?'
                            )

                          if (confirmDelete) {
                            onDeletePost?.(post._id)
                          }
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm border-0 bg-transparent cursor-pointer"
                      >
                        🗑 Delete Post
                      </button>

                    </div>

                  )}

                </div>

              )}

            </div>

            {/* CONTENT */}
            {editing ? (

              <div className="mt-2">

                <textarea
                  value={editText}
                  onChange={e =>
                    setEditText(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 outline-none"
                  rows={4}
                />

                <div className="flex gap-2 mt-2">

                  <button
                    onClick={async e => {

                      e.stopPropagation()

                      if (!editText.trim()) return

                      try {

                        await onEditPost?.(
                          post._id,
                          editText.trim()
                        )

                        // CLOSE EDIT MODE
                        setEditing(false)

                      } catch (err) {

                        console.log(err)
                      }
                    }}
                    className="bg-black text-white px-4 py-2 rounded-lg border-0 cursor-pointer"
                  >
                    Save
                  </button>

                  <button
                    onClick={e => {

                      e.stopPropagation()

                      setEditing(false)

                      setEditText(post.content)
                    }}
                    className="bg-gray-200 px-4 py-2 rounded-lg border-0 cursor-pointer"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              <p className={text.postContent}>
                {post.content}
              </p>

            )}

            {/* IMAGE */}
            {post.image && (

              <div className={P.image}>

                <img
                  src={imageUrl}
                  alt="post"
                  loading="lazy"
                  className="w-full max-h-64 sm:max-h-80 object-cover rounded-2xl"
                  onError={(e) => {

                    console.log(
                      'Image failed:',
                      imageUrl
                    )

                    e.target.style.display = 'none'
                  }}
                />

              </div>

            )}

            {/* ACTIONS */}
            <PostActions
              post={post}
              currentUserId={user?._id}
              onLike={onLike}
              onBookmark={onBookmark}
              onShare={() => setShowShare(true)}
              onComment={() =>
                setShowComments(v => !v)
              }
            />

            {/* COMMENTS */}
            {showComments && (

              <CommentList
                comments={post.comments}
                postId={post._id}
                onAddComment={onAddComment}
                onAddReply={onAddReply}
              />

            )}

          </div>

        </div>

      </article>

      {/* SHARE MODAL */}
      {showShare && (

        <ShareModal
          post={post}
          onClose={() => setShowShare(false)}
        />

      )}

    </>
  )
}
// This component renders a list of comments for a post, along with the ability to add new comments and replies.
import { useState } from 'react'
import Avatar from '../common/Avatar'
import VerifiedBadge from '../common/VerifiedBadge'
import { formatDate } from '../../utils/formatDate'
import { useAuth } from '../../hooks/useAuth'
import { input, btn, text } from '../../styles/common'
// Props:
// - comments: Array of comment objects to display.
// - postId: ID of the post these comments belong to.
// - onAddComment: Function to call when adding a new comment.
// - onAddReply: Function to call when adding a reply to a comment.
export default function CommentList({ comments = [], postId, onAddComment, onAddReply }) {
  const { user } = useAuth()
  const [txt, setTxt] = useState('')
  const [sub, setSub] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyTxt, setReplyTxt] = useState('')
// Handles submitting a new comment to the post.
  const handle = async e => {
    e.preventDefault()
    if (!txt.trim() || sub) return
    setSub(true)
    await onAddComment?.(postId, txt.trim())
    setTxt(''); setSub(false)
  }
// Handles submitting a reply to a specific comment.
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault()
    if (!replyTxt.trim() || sub) return
    setSub(true)
    await onAddReply?.(postId, commentId, replyTxt.trim(), user)
    setReplyTxt(''); setReplyingTo(null); setSub(false)
  }
// Renders the list of comments and their replies, along with input fields for adding new comments and replies.
  return (
    <div className="mt-3">
      {comments.map(c => {
        const commentUser = c.user || c.userId || { name: 'User', username: 'user' }
        return (
          <div key={c._id} className="flex gap-2 sm:gap-2.5 py-2.5 border-b border-cream-border">
            <Avatar user={commentUser} size="xs" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="font-semibold text-[13px] text-ink">{commentUser?.name || 'User'}</span>
                {commentUser?.verified && <VerifiedBadge size={12} />}
                <span className={text.metaSm}>· {formatDate(c.createdAt)}</span>
              </div>
            <p className="text-[13px] sm:text-[14px] text-ink-light mb-1">{c.content}</p>
            
            <div className="flex items-center gap-3">
              <button 
                className="text-[12px] font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer"
                onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
              >
                Reply
              </button>
            </div>

            {/* Replies List */}
            {c.replies?.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 pl-2 border-l-2 border-cream">
                {c.replies.map(r => {
                  const replyUser = r.user || r.userId || { name: 'User' }
                  return (
                    <div key={r._id || Math.random()} className="flex gap-2">
                      <Avatar user={replyUser} size="xs" className="w-5 h-5 text-[9px]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="font-semibold text-[12px] text-ink">{replyUser?.name || 'User'}</span>
                          {replyUser?.verified && <VerifiedBadge size={11} />}
                          <span className="text-[11px] text-ink-muted">· {formatDate(r.createdAt)}</span>
                        </div>
                        <p className="text-[12px] text-ink-light">{r.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Reply Input */}
            {replyingTo === c._id && user && (
              <form onSubmit={(e) => handleReplySubmit(e, c._id)} className="flex gap-2 mt-2 items-center pl-2 border-l-2 border-cream">
                <Avatar user={user} size="xs" className="w-5 h-5" />
                <input 
                  value={replyTxt} 
                  onChange={e => setReplyTxt(e.target.value)}
                  placeholder="Write a reply..." 
                  className={`${input.comment} py-1 px-2 text-[12px]`} 
                  autoFocus
                />
                <button type="submit" disabled={!replyTxt.trim() || sub}
                  className={`${btn.primarySm} py-1 px-2 text-[12px] ${(!replyTxt.trim() || sub) ? 'opacity-50' : ''} shrink-0`}>
                  Reply
                </button>
              </form>
            )}
          </div>
        </div>
      )})}

      {/* Main Comment Input */}
      {user && (
        <form onSubmit={handle} className="flex gap-2 mt-3 items-center">
          <Avatar user={user} size="xs" />
          <input value={txt} onChange={e => setTxt(e.target.value)}
            placeholder="Write a comment..." className={input.comment} />
          <button type="submit" disabled={!txt.trim() || sub}
            className={`${btn.primarySm} ${(!txt.trim() || sub) ? 'opacity-50' : ''} shrink-0`}>Post</button>
        </form>
      )}
    </div>
  )
}

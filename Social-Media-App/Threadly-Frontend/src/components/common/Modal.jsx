// Modal component for displaying content in a centered overlay with a backdrop
// It handles opening and closing logic, including preventing background scrolling when open and allowing 
// dismissal by clicking outside or pressing the Escape key. 
// The modal is responsive, appearing as a full-width sheet on mobile and a centered card on larger screens, with a drag handle for mobile users.
import { useEffect } from 'react'
import { modal, text } from '../../styles/common'

export default function Modal({ isOpen, onClose, title, children, width = 520 }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])
// Add event listener for Escape key to close the modal when it's open
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
// If the modal is not open, don't render anything
  if (!isOpen) return null
// Render the modal overlay and panel. The overlay covers the entire screen and listens for clicks to close the modal, while the panel contains the modal content and prevents click events from propagating to the overlay.
  return (
    <div className={modal.overlay} onClick={onClose}>
      {/* On mobile: full-width sheet from bottom. On sm+: centered card */}
      <div className={modal.panel}
        style={{ maxWidth: window.innerWidth >= 640 ? width : '100%' }}
        onClick={e => e.stopPropagation()}>
        {/* Drag handle on mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-sand" />
        </div>
        <div className={modal.header}>
          <h2 className={text.h3}>{title}</h2>
          <button className={modal.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={modal.body}>{children}</div>
      </div>
    </div>
  )
}
//share popup , login popup etc
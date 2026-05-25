// Avatar component to display user profile picture or initials with a consistent color scheme
//it is done with a simple hashing function to generate a color from the username or user ID, 
// ensuring that each user has a unique and consistent avatar color across the app. The component also handles different sizes and allows for additional styling through className props.
import { av } from '../../styles/common'
const PALETTE = ['#c2603b','#3b7ac2','#3b8c5a','#8c3b7a','#7a8c3b','#3b6e8c']
function getColor(str='') { let h=0; for(let i=0;i<str.length;i++) h=str.charCodeAt(i)+((h<<5)-h); return PALETTE[Math.abs(h)%PALETTE.length] }
function getInitials(name='') { return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() }
export default function Avatar({ user, size='md', className='' }) {
  const color = getColor(user?.username || user?._id || '')
  const profileImg = user?.profileImage || user?.profilePicture
  // If a profile image exists, display it with a border color derived from the user's name or ID
  if (profileImg) {
    return (
      <div className={`${av[size]||av.md} ${className}`}
        style={{ borderColor: color+'44', padding: 0, overflow: 'hidden' }}>
        <img src={profileImg} alt={user?.name || ''}
          className="w-full h-full object-cover rounded-full" />
      </div>
    )
  }
// If no profile image is available, display the user's initials with a background color derived from the same hashing function
  return (
    <div className={`${av[size]||av.md} ${className}`}
      style={{ backgroundColor:color+'18', borderColor:color+'44', color, fontFamily:'var(--font-family-sans)' }}>
      {getInitials(user?.name||'')}
    </div>
  )
}

// Navbar component for displaying a page title with optional back button and right-aligned element. 
// The back button uses the useNavigate hook from react-router-dom to navigate back in the history stack when clicked. 
// The title is displayed prominently in the center, and any additional right-aligned element can be passed as a prop to be rendered on the right side of the navbar.
import { useNavigate } from 'react-router-dom'
import { navbar, text } from '../../styles/common'
export default function Navbar({ title, showBack = false, rightElement }) {
  const navigate = useNavigate()
  return (
    <div className={navbar.wrapper}>
      {showBack && (
        <button className={navbar.backBtn} onClick={() => navigate(-1)}>←</button>
      )}
      <h1 className={`${text.pageTitle} flex-1 truncate`}>{title}</h1>
      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </div>
  )
}

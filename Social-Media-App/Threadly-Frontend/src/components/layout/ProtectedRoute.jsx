// ProtectedRoute component for guarding routes that require authentication. 
// It checks the user's authentication status using a custom useAuth hook,
//  and conditionally renders the child components if the user is authenticated,
//  or redirects to the login page if not. While the authentication status is being determined (loading), 
// it displays a spinner to indicate that the app is processing.
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../common/Spinner'
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner center/>
  if (!user) return <Navigate to="/login" replace/>
  return children
}

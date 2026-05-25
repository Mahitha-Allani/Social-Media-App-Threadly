// useAuth.js - Custom hook for accessing authentication context, providing user information and authentication functions.
// This hook allows components to easily access the authentication state and functions provided by AuthContext.

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

// This context manages user authentication state, including login, registration, and logout functionality.
//  It also provides the current user information to the rest of the app.
import { createContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'

export const AuthContext = createContext(null)
// The AuthProvider component wraps the app and provides authentication state and functions to its children.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('threadly_token')
    if (token) {
      // Try to get current user info
      authApi.getMe()
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem('threadly_token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])
// Handles user login by calling the API and storing the token and user info on success.
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      const { user, token } = response.data

      // Store token in localStorage
      localStorage.setItem('threadly_token', token)
      setUser(user)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (name, username, email, password) => {
    try {
      const response = await authApi.register(name, username, email, password)
      // Registration successful, but user needs to login
      return { success: true, message: response.data.message }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }
// Handles user logout by clearing the user state and removing the token from localStorage.
  const logout = () => {
    setUser(null)
    localStorage.removeItem('threadly_token')
  }
// Allows updating the user information in the context, which also updates localStorage to keep it in sync.
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('threadly_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

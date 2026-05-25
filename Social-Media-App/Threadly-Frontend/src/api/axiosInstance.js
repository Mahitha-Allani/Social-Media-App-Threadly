// axiosInstance.js - Configures a reusable Axios instance for making API calls with a base URL, 
// JSON content type, and interceptors for handling authentication tokens and unauthorized responses.
import axios from 'axios'
// Determine the base URL based on the environment (development or production)
const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_BASE_URL
// Create an Axios instance with the base URL and default headers
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})
// Request interceptor to add the authentication token to headers if it exists in localStorage
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('threadly_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
// Response interceptor to handle 401 Unauthorized responses by clearing the token and redirecting to login
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('threadly_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
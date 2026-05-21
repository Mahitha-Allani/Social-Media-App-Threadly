import axios from 'axios'

const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('threadly_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

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
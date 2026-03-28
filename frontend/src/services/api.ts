import axios from "axios"

// ✅ Base URL from env (best practice)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/"

// ✅ Create instance
const api = axios.create({
  baseURL: BASE_URL,
})

// ✅ REQUEST INTERCEPTOR (Attach Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ✅ RESPONSE INTERCEPTOR (Handle Errors)
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // 🔴 Auto logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token")

      // redirect to login
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default api
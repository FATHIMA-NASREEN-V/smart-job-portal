import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { logout } from "../../features/auth/authSlice"
import { useEffect, useRef, useState } from "react"
import api from "../../services/api"

interface Notification {
  id: string | number
  message: string
  is_read: boolean
  created_at?: string
}

const WS_BASE_URL =
  import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000"

const Topbar = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const username = user?.username || "User"
  const initial = username.charAt(0).toUpperCase()

  // Logout
  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/")
      setNotifications(res.data)
    } catch (error) {
      console.error("Fetch notifications error:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // WebSocket
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const ws = new WebSocket(
      `${WS_BASE_URL}/ws/notifications/?token=${token}`
    )

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          message: data.message,
          is_read: false,
          created_at: new Date().toISOString()
        },
        ...prev
      ])
    }

    return () => ws.close()
  }, [])

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAsRead = async (id: string | number) => {
    try {
      await api.put(`/notifications/${id}/read/`)
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all/")
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 shadow relative">

      <h1 className="text-xl font-semibold text-gray-700">
        Dashboard
      </h1>

      <div className="flex items-center space-x-6">

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative text-gray-600 hover:text-blue-600 text-xl"
          >
            🔔

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50">

              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold text-gray-700">
                  Notifications
                </h2>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id)
                        setShowDropdown(false)
                      }}
                      className={`p-4 border-b cursor-pointer ${
                        !n.is_read
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <p className="text-sm">{n.message}</p>

                      {n.created_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))
                )}

              </div>

            </div>
          )}

        </div>

        {/* User */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {initial}
          </div>
          <span className="text-sm font-medium">{username}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  )
}

export default Topbar
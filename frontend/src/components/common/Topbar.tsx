import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { logout } from "../../features/auth/authSlice"
import { useEffect, useRef, useState } from "react"
import axios from "axios"

const Topbar = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user } = useAppSelector((state) => state.auth)

  const username = user?.username || "User"
  const initial = username.charAt(0).toUpperCase()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("token")
    navigate("/login")
  }

  // ✅ WebSocket (Realtime)
  useEffect(() => {
    const token = localStorage.getItem("token")

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      setNotifications(prev => [
        {
          id: Date.now(), // temp id
          message: data.message,
          is_read: false,
          created_at: new Date().toISOString()
        },
        ...prev
      ])
    }

    return () => ws.close()
  }, [])

  // ✅ Fetch old notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token")

    const res = await axios.get(
      "http://127.0.0.1:8000/api/notifications/",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setNotifications(res.data)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  // ✅ Mark single as read
  const markAsRead = async (id: number) => {

    const token = localStorage.getItem("token")

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/notifications/${id}/read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      )

    } catch (error) {
      console.error("Mark read error", error)
    }
  }

  // ✅ Mark all as read
  const markAllAsRead = async () => {

    const token = localStorage.getItem("token")

    try {
      await axios.put(
        "http://127.0.0.1:8000/api/notifications/read-all/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      )

    } catch (error) {
      console.error("Mark all read error", error)
    }
  }

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 shadow relative">

      {/* Left */}
      <h1 className="text-xl font-semibold text-gray-700">
        Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center space-x-6">

        {/* 🔔 Notification */}
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

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50">

              {/* Header */}
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

              {/* List */}
              <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b cursor-pointer transition ${
                        !n.is_read
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <p className="text-sm text-gray-800">
                        {n.message}
                      </p>

                      {/* Optional time */}
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

        {/* 👤 User */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {initial}
          </div>

          <span className="text-gray-700 text-sm font-medium">
            {username}
          </span>
        </div>

        {/* 🚪 Logout */}
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
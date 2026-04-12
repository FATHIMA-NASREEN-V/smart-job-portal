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

const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000"

const Topbar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const notifsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const username = user?.username || "User"
  const initial = username.charAt(0).toUpperCase()
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/")
      setNotifications(res.data)
    } catch (error) {
      console.error("Fetch notifications error:", error)
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    const ws = new WebSocket(`${WS_BASE_URL}/ws/notifications/?token=${token}`)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setNotifications((prev) => [{
        id: crypto.randomUUID(), message: data.message,
        is_read: false, created_at: new Date().toISOString()
      }, ...prev])
    }
    return () => ws.close()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markAsRead = async (id: string | number) => {
    try {
      await api.put(`/notifications/${id}/read/`)
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    } catch (error) { console.error(error) }
  }

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all/")
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) { console.error(error) }
  }

  return (
    <header style={{
      height: "64px",
      background: "white",
      borderBottom: "1px solid #f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>

      {/* Left — page title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "4px", height: "20px", borderRadius: "2px", background: "linear-gradient(180deg, #0ea5e9, #6366f1)" }} />
        <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", letterSpacing: "-0.01em" }}>
          Dashboard
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {/* Notification bell */}
        <div style={{ position: "relative" }} ref={notifsRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: showNotifs ? "#f0f9ff" : "transparent",
              border: "1px solid",
              borderColor: showNotifs ? "#bae6fd" : "#e2e8f0",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", position: "relative",
              transition: "all 0.15s ease",
            }}
          >
            <svg width="17" height="17" fill="none" stroke="#475569" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-4px", right: "-4px",
                background: "#ef4444", color: "white",
                fontSize: "10px", fontWeight: "700",
                width: "17px", height: "17px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid white",
              }}>{unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              width: "360px", background: "white",
              borderRadius: "14px", border: "1px solid #e2e8f0",
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)", zIndex: 50, overflow: "hidden",
            }}>
              <div style={{
                padding: "14px 16px", borderBottom: "1px solid #f1f5f9",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>
                  Notifications {unreadCount > 0 && (
                    <span style={{
                      background: "#fef3c7", color: "#d97706", fontSize: "11px",
                      padding: "1px 7px", borderRadius: "999px", marginLeft: "6px",
                    }}>{unreadCount} new</span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} style={{
                    fontSize: "12px", color: "#0ea5e9", background: "none",
                    border: "none", cursor: "pointer", fontWeight: "500",
                  }}>Mark all read</button>
                )}
              </div>
              <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔔</div>
                    No notifications yet
                  </div>
                ) : notifications.map((n) => (
                  <div key={n.id} onClick={() => { markAsRead(n.id); setShowNotifs(false) }}
                    style={{
                      padding: "12px 16px", cursor: "pointer",
                      background: !n.is_read ? "#f0f9ff" : "white",
                      borderBottom: "1px solid #f8fafc",
                      display: "flex", gap: "10px", alignItems: "flex-start",
                      transition: "background 0.1s",
                    }}
                  >
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%", marginTop: "5px", flexShrink: 0,
                      background: !n.is_read ? "#0ea5e9" : "#e2e8f0",
                    }} />
                    <div>
                      <p style={{ fontSize: "13px", color: "#1e293b", margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                      {n.created_at && (
                        <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px" }}>
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 4px" }} />

        {/* User menu */}
        <div style={{ position: "relative" }} ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "5px 10px 5px 5px", borderRadius: "10px",
              border: "1px solid", borderColor: showUserMenu ? "#bae6fd" : "#e2e8f0",
              background: showUserMenu ? "#f0f9ff" : "white",
              cursor: "pointer", transition: "all 0.15s ease",
            }}
          >
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: "13px", fontWeight: "700",
            }}>{initial}</div>
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#334155" }}>{username}</span>
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showUserMenu && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              width: "180px", background: "white",
              borderRadius: "12px", border: "1px solid #e2e8f0",
              boxShadow: "0 8px 30px rgba(0,0,0,0.10)", zIndex: 50, overflow: "hidden",
              padding: "6px",
            }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", padding: "9px 12px", border: "none",
                  background: "none", cursor: "pointer", borderRadius: "8px",
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "13px", color: "#ef4444", fontWeight: "500",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff1f2")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default Topbar
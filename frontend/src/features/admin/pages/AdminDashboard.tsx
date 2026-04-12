import { useEffect, useState } from "react"
import api from "../../../services/api"

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [u, j, a] = await Promise.all([api.get("/admin/users/"), api.get("/jobs/"), api.get("/applications/")])
        setStats({
          users:        u.data.length,
          jobs:         (j.data.results || j.data).length,
          applications: (a.data.results || a.data).length,
        })
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const cards = [
    { label: "Total Users",        value: stats.users,        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" },
    { label: "Total Jobs",         value: stats.jobs,         icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "#0ea5e9", bg: "#f0f9ff", border: "#e0f2fe" },
    { label: "Total Applications",  value: stats.applications, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#10b981", bg: "#f0fdf4", border: "#d1fae5" },
  ]

  const quickLinks = [
    { label: "Manage Users",    path: "/admin/users",        desc: "View, activate and deactivate user accounts", color: "#6366f1", bg: "#eef2ff" },
    { label: "Manage Jobs",     path: "/admin/jobs",         desc: "Approve or reject employer job postings",      color: "#0ea5e9", bg: "#f0f9ff" },
    { label: "All Applications",path: "/admin/applications", desc: "Browse all applications across all jobs",      color: "#10b981", bg: "#f0fdf4" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>Admin Dashboard</h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Platform overview and management</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {cards.map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "22px", border: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" fill="none" stroke={s.color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d={s.icon} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>{loading ? "–" : s.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", fontWeight: "500" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #f8fafc" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>Quick Actions</h2>
        </div>
        <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {quickLinks.map((q) => (
            <a key={q.label} href={q.path} style={{
              padding: "16px", borderRadius: "12px", background: q.bg,
              textDecoration: "none", display: "block", transition: "opacity 0.15s",
              border: "1px solid transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <div style={{ fontSize: "14px", fontWeight: "700", color: q.color, marginBottom: "4px" }}>{q.label}</div>
              <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>{q.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
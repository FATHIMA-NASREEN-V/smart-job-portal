import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../../services/api"

interface Job { id: number; title: string; location: string; salary?: number; status?: string }
interface Application { id: number; status: string }
interface Stats { totalJobs: number; totalApplications: number; accepted: number; pending: number }

const statusStyle: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#fffbeb", color: "#d97706" },
  approved: { bg: "#f0fdf4", color: "#16a34a" },
  rejected: { bg: "#fff1f2", color: "#e11d48" },
}

const EmployerDashboard = () => {
  const [stats, setStats]           = useState<Stats>({ totalJobs: 0, totalApplications: 0, accepted: 0, pending: 0 })
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [jobsRes, appsRes] = await Promise.all([api.get("/jobs/"), api.get("/applications/employer/")])
        const jobs = jobsRes.data?.results || jobsRes.data
        const apps = appsRes.data?.results || appsRes.data
        setStats({
          totalJobs: jobs.length, totalApplications: apps.length,
          accepted: apps.filter((a: Application) => a.status === "accepted").length,
          pending:  apps.filter((a: Application) => a.status === "pending").length,
        })
        setRecentJobs(jobs.slice(0, 5))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const cards = [
    { label: "Total Jobs",     value: stats.totalJobs,         icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "#0ea5e9", bg: "#f0f9ff", border: "#e0f2fe" },
    { label: "Applications",   value: stats.totalApplications, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" },
    { label: "Accepted",       value: stats.accepted,          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "#10b981", bg: "#f0fdf4", border: "#d1fae5" },
    { label: "Pending Review", value: stats.pending,           icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Manage your job posts and applicants</p>
        </div>
        <Link to="/employer/post-job" style={{ padding: "9px 18px", borderRadius: "10px", textDecoration: "none", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "white", fontSize: "13px", fontWeight: "600" }}>
          + Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {cards.map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "20px", border: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" fill="none" stroke={s.color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d={s.icon} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>{loading ? "–" : s.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px", fontWeight: "500" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent jobs table */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>Recent Job Posts</h2>
          <Link to="/employer/jobs" style={{ fontSize: "12px", color: "#0ea5e9", fontWeight: "600", textDecoration: "none" }}>View all</Link>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Loading…</div>
        ) : recentJobs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📋</div>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>No jobs posted yet</p>
            <Link to="/employer/post-job" style={{ display: "inline-block", marginTop: "12px", padding: "8px 18px", borderRadius: "8px", background: "#f0f9ff", color: "#0ea5e9", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>Post your first job</Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Job Title", "Location", "Salary", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job, i) => {
                  const st = statusStyle[job.status || ""] || { bg: "#f8fafc", color: "#64748b" }
                  return (
                    <tr key={job.id} style={{ borderTop: "1px solid #f8fafc", transition: "background 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                      onMouseLeave={e => (e.currentTarget.style.background = "white")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #e0f2fe, #ddd6fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#4f46e5" }}>{job.title.charAt(0)}</div>
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a" }}>{job.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#64748b" }}>{job.location}</td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: "600", color: "#16a34a" }}>
                        {job.salary ? `₹${Number(job.salary).toLocaleString()}` : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", background: st.bg, color: st.color, textTransform: "capitalize" }}>
                          {job.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployerDashboard
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../../services/api"

interface Job { id: number; title: string; location: string; salary?: number; job_type?: string }
interface Application { id: number; status: string }

interface Stats { available: number; applied: number; pending: number; accepted: number }

const statCards = (stats: Stats) => [
  { label: "Available Jobs", value: stats.available, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "#0ea5e9", bg: "#f0f9ff", border: "#e0f2fe" },
  { label: "Applied",        value: stats.applied,   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" },
  { label: "Pending",        value: stats.pending,   icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" },
  { label: "Accepted",       value: stats.accepted,  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "#10b981", bg: "#f0fdf4", border: "#d1fae5" },
]

const jobTypeLabel: Record<string, string> = { full_time: "Full Time", part_time: "Part Time", remote: "Remote", internship: "Internship" }
const jobTypeColor: Record<string, string> = { full_time: "#1d4ed8", part_time: "#7e22ce", remote: "#15803d", internship: "#c2410c" }
const jobTypeBg: Record<string, string>    = { full_time: "#eff6ff", part_time: "#fdf4ff", remote: "#f0fdf4", internship: "#fff7ed" }

const JobSeekerDashboard = () => {
  const [stats, setStats]           = useState<Stats>({ available: 0, applied: 0, pending: 0, accepted: 0 })
  const [latestJobs, setLatestJobs] = useState<Job[]>([])
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [jobsRes, appRes] = await Promise.all([api.get("/jobs/"), api.get("/applications/jobseeker/")])
        const jobs = jobsRes.data.results || jobsRes.data
        const apps = appRes.data.results  || appRes.data
        setStats({
          available: jobs.length,
          applied:   apps.length,
          pending:   apps.filter((a: Application) => a.status.toLowerCase() === "pending").length,
          accepted:  apps.filter((a: Application) => a.status.toLowerCase() === "accepted").length,
        })
        setLatestJobs(jobs.slice(0, 5))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Here's what's happening with your job search</p>
        </div>
        <Link to="/jobseeker/jobs" style={{
          padding: "9px 18px", borderRadius: "10px", textDecoration: "none",
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          color: "white", fontSize: "13px", fontWeight: "600",
        }}>Browse Jobs →</Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {statCards(stats).map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "20px", border: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" fill="none" stroke={s.color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d={s.icon} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>
                {loading ? "–" : s.value}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px", fontWeight: "500" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest jobs */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>Latest Opportunities</h2>
          <Link to="/jobseeker/jobs" style={{ fontSize: "12px", color: "#0ea5e9", fontWeight: "600", textDecoration: "none" }}>View all</Link>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Loading…</div>
        ) : latestJobs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No jobs available right now</div>
        ) : (
          latestJobs.map((job, i) => (
            <div key={job.id} style={{
              padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px",
              borderBottom: i < latestJobs.length - 1 ? "1px solid #f8fafc" : "none",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={e => (e.currentTarget.style.background = "white")}
            >
              <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: "linear-gradient(135deg, #e0f2fe, #ddd6fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#4f46e5", flexShrink: 0 }}>
                {job.title.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round"/></svg>
                  {job.location}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                {job.job_type && (
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "999px", background: jobTypeBg[job.job_type] || "#f8fafc", color: jobTypeColor[job.job_type] || "#475569" }}>
                    {jobTypeLabel[job.job_type] || job.job_type}
                  </span>
                )}
                {job.salary && (
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a" }}>₹{Number(job.salary).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default JobSeekerDashboard
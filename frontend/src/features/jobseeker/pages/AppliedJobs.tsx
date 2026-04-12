// ============================================================
// AppliedJobs.tsx  —  src/features/jobseeker/pages/AppliedJobs.tsx
// ============================================================
import { useEffect, useState } from "react"
import api from "../../../services/api"

interface Application {
  id: number
  job_title: string
  applied_at: string
  status: "pending" | "accepted" | "rejected"
}

const statusConfig = {
  accepted: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", dot: "#22c55e", label: "Accepted" },
  pending:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a", dot: "#f59e0b", label: "Pending"  },
  rejected: { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3", dot: "#f43f5e", label: "Rejected" },
}

export const AppliedJobs = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); setError("")
        const res  = await api.get("/applications/jobseeker/")
        setApplications(res.data?.results || res.data)
      } catch { setError("Failed to load applications") }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      <div>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>My Applications</h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
          {loading ? "Loading…" : `${applications.length} application${applications.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error && (
        <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", border: "1px solid #fecdd3", color: "#e11d48", fontSize: "13px" }}>{error}</div>
      )}

      {!loading && !error && applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
          <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>No applications yet</h3>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>Start applying to jobs to see them here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {loading
            ? [1,2,3].map(i => (
                <div key={i} style={{ background: "white", borderRadius: "14px", padding: "18px", border: "1px solid #f1f5f9", height: "72px" }}>
                  <div style={{ height: "14px", background: "#f1f5f9", borderRadius: "6px", width: "40%", marginBottom: "8px" }}/>
                  <div style={{ height: "12px", background: "#f8fafc", borderRadius: "6px", width: "25%" }}/>
                </div>
              ))
            : applications.map((app) => {
                const s = statusConfig[app.status] || statusConfig.pending
                return (
                  <div key={app.id} style={{ background: "white", borderRadius: "14px", padding: "16px 20px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.borderColor = "#e0f2fe" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "#f1f5f9" }}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #e0f2fe, #ddd6fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "#4f46e5", flexShrink: 0 }}>
                      {(app.job_title || "?").charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.job_title}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3" strokeLinecap="round"/></svg>
                        Applied {new Date(app.applied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "999px", background: s.bg, border: `1px solid ${s.border}`, flexShrink: 0 }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot }} />
                      <span style={{ fontSize: "12px", fontWeight: "600", color: s.color }}>{s.label}</span>
                    </div>
                  </div>
                )
              })
          }
        </div>
      )}
    </div>
  )
}

export default AppliedJobs



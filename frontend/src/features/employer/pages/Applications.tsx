import { useEffect, useState } from "react"
import api from "../../../services/api"

interface Application {
  id: number
  job_title: string
  applicant_username: string
  status: "accepted" | "pending" | "rejected" | string
}

const statusConfig: Record<string, { bg: string; color: string; border: string; dot: string }> = {
  accepted: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", dot: "#22c55e" },
  pending:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a", dot: "#f59e0b" },
  rejected: { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3", dot: "#f43f5e" },
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading]           = useState(false)
  const [updatingId, setUpdatingId]     = useState<number | null>(null)
  const [filter, setFilter]             = useState("all")

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const res  = await api.get("/applications/employer/")
      setApplications(res.data?.results || res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      setUpdatingId(id)
      await api.patch(`/applications/update-status/${id}/`, { status })
      await fetchApplications()
    } catch (e) { console.error(e) }
    finally { setUpdatingId(null) }
  }

  useEffect(() => { fetchApplications() }, [])

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter)

  const counts = {
    all:      applications.length,
    pending:  applications.filter(a => a.status === "pending").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>Applications</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Review and manage candidate applications</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {(["all", "pending", "accepted", "rejected"] as const).map(f => {
          const sc = f === "all" ? null : statusConfig[f]
          const isActive = filter === f
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s",
              background: isActive ? (sc ? sc.bg : "linear-gradient(135deg, #0ea5e9, #6366f1)") : "white",
              color: isActive ? (sc ? sc.color : "white") : "#64748b",
              border: `1.5px solid ${isActive ? (sc ? sc.border : "transparent") : "#e2e8f0"}`,
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>👥</div>
            <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>No {filter !== "all" ? filter : ""} applications</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Applicant", "Job", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => {
                    const s = statusConfig[app.status] || statusConfig.pending
                    const isUpdating = updatingId === app.id
                    return (
                      <tr key={app.id} style={{ borderTop: "1px solid #f8fafc", transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                        onMouseLeave={e => (e.currentTarget.style.background = "white")}
                      >
                        {/* Applicant */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "white", flexShrink: 0 }}>
                              {(app.applicant_username || "?").charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a" }}>{app.applicant_username}</span>
                          </div>
                        </td>

                        {/* Job */}
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "13px", color: "#475569" }}>{app.job_title}</span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "999px", background: s.bg, border: `1px solid ${s.border}` }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot }} />
                            <span style={{ fontSize: "11px", fontWeight: "600", color: s.color, textTransform: "capitalize" }}>{app.status}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 16px" }}>
                          {app.status === "pending" ? (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button disabled={isUpdating} onClick={() => updateStatus(app.id, "accepted")}
                                style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "#f0fdf4", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: isUpdating ? "not-allowed" : "pointer", opacity: isUpdating ? 0.6 : 1, transition: "all 0.15s" }}
                                onMouseEnter={e => { if (!isUpdating) (e.currentTarget.style.background = "#dcfce7") }}
                                onMouseLeave={e => { (e.currentTarget.style.background = "#f0fdf4") }}>
                                {isUpdating ? "…" : "✓ Accept"}
                              </button>
                              <button disabled={isUpdating} onClick={() => updateStatus(app.id, "rejected")}
                                style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "#fff1f2", color: "#e11d48", fontSize: "12px", fontWeight: "600", cursor: isUpdating ? "not-allowed" : "pointer", opacity: isUpdating ? 0.6 : 1, transition: "all 0.15s" }}
                                onMouseEnter={e => { if (!isUpdating) (e.currentTarget.style.background = "#ffe4e6") }}
                                onMouseLeave={e => { (e.currentTarget.style.background = "#fff1f2") }}>
                                {isUpdating ? "…" : "✕ Reject"}
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Decision made</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Applications
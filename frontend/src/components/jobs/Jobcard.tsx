import { useState } from "react"
import api from "../../services/api"

interface Job {
  id: number
  title: string
  company: string
  location: string
  job_type: string
  salary?: number
  is_applied?: boolean
  is_saved?: boolean
}

interface Props {
  job: Job
}

const jobTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  full_time:   { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  part_time:   { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  remote:      { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  internship:  { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
}

const jobTypeLabel: Record<string, string> = {
  full_time: "Full Time", part_time: "Part Time",
  remote: "Remote", internship: "Internship",
}

const JobCard = ({ job }: Props) => {
  const [loadingApply, setLoadingApply] = useState(false)
  const [loadingSave,  setLoadingSave]  = useState(false)
  const [applied, setApplied] = useState(job.is_applied || false)
  const [saved,   setSaved]   = useState(job.is_saved   || false)

  const typeStyle = jobTypeColors[job.job_type] || { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" }
  const companyInitial = (job.company || job.title || "?").charAt(0).toUpperCase()

  const applyJob = async () => {
    if (applied || loadingApply) return
    try {
      setLoadingApply(true)
      await api.post("/applications/apply/", { job: job.id })
      setApplied(true)
    } catch (error: any) {
      const data = error.response?.data
      const message = Array.isArray(data) ? data[0] : data?.error || data?.detail
      if (message?.includes("already applied")) setApplied(true)
    } finally {
      setLoadingApply(false)
    }
  }

  const handleSaveJob = async () => {
    if (saved || loadingSave) return
    try {
      setLoadingSave(true)
      await api.post("/jobs/save/", { job_id: job.id })
      setSaved(true)
    } catch (error: any) {
      const data = error.response?.data
      if (data?.detail === "Job already saved") setSaved(true)
    } finally {
      setLoadingSave(false)
    }
  }

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid #f1f5f9",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      transition: "all 0.2s ease",
      cursor: "default",
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.boxShadow = "0 8px 30px rgba(14,165,233,0.10)"
      el.style.borderColor = "#e0f2fe"
      el.style.transform = "translateY(-2px)"
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.boxShadow = "none"
      el.style.borderColor = "#f1f5f9"
      el.style.transform = "translateY(0)"
    }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {/* Company logo placeholder */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "10px", flexShrink: 0,
          background: "linear-gradient(135deg, #e0f2fe, #ddd6fe)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", fontWeight: "700", color: "#4f46e5",
          border: "1px solid rgba(99,102,241,0.15)",
        }}>{companyInitial}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            margin: 0, fontSize: "14.5px", fontWeight: "600",
            color: "#0f172a", lineHeight: 1.3,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{job.title}</h2>
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>
            {job.company || "Company"}
          </p>
        </div>

        {/* Save button (bookmark icon) */}
        <button
          onClick={handleSaveJob}
          disabled={loadingSave}
          title={saved ? "Saved" : "Save job"}
          style={{
            background: "none", border: "none", cursor: saved ? "default" : "pointer",
            padding: "4px", color: saved ? "#0ea5e9" : "#cbd5e1",
            transition: "color 0.15s", flexShrink: 0,
          }}
          onMouseEnter={e => { if (!saved) (e.currentTarget as HTMLButtonElement).style.color = "#0ea5e9" }}
          onMouseLeave={e => { if (!saved) (e.currentTarget as HTMLButtonElement).style.color = "#cbd5e1" }}
        >
          <svg width="18" height="18" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Tags row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <span style={{
          fontSize: "11px", fontWeight: "600", padding: "3px 9px",
          borderRadius: "999px", letterSpacing: "0.02em",
          background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.border}`,
        }}>{jobTypeLabel[job.job_type] || job.job_type}</span>

        <span style={{
          fontSize: "11px", padding: "3px 9px", borderRadius: "999px",
          background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {job.location}
        </span>

        {job.salary && (
          <span style={{
            fontSize: "11px", padding: "3px 9px", borderRadius: "999px",
            background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            ₹ {Number(job.salary).toLocaleString()}
          </span>
        )}
      </div>

      {/* Apply button */}
      <button
        onClick={applyJob}
        disabled={loadingApply || applied}
        style={{
          width: "100%",
          padding: "9px",
          borderRadius: "10px",
          border: "none",
          fontSize: "13px",
          fontWeight: "600",
          cursor: applied ? "default" : "pointer",
          transition: "all 0.15s ease",
          background: applied
            ? "#f0fdf4"
            : "linear-gradient(135deg, #0ea5e9, #6366f1)",
          color: applied ? "#16a34a" : "white",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={e => { if (!applied && !loadingApply) (e.currentTarget as HTMLButtonElement).style.opacity = "0.9" }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1" }}
      >
        {loadingApply ? "Applying…" : applied ? "✓ Applied" : "Apply Now"}
      </button>
    </div>
  )
}

export default JobCard
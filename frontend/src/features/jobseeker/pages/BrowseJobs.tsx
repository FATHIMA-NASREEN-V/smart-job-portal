import { useEffect, useState } from "react"
import api from "../../../services/api"
import { useSearchParams } from "react-router-dom"
import JobCard from "../../../components/jobs/Jobcard"

interface Job {
  id: number; title: string; company: string; location: string
  job_type: string; salary?: number; is_saved?: boolean; is_applied?: boolean
}

const jobTypes = [
  { value: "",           label: "All Types" },
  { value: "full_time",  label: "Full Time" },
  { value: "part_time",  label: "Part Time" },
  { value: "remote",     label: "Remote" },
  { value: "internship", label: "Internship" },
]

const BrowseJobs = () => {
  const [jobs, setJobs]           = useState<Job[]>([])
  const [loading, setLoading]     = useState(false)
  const [search, setSearch]       = useState("")
  const [location, setLocation]   = useState("")
  const [jobType, setJobType]     = useState("")
  const [salary, setSalary]       = useState("")
  const [searchParams]            = useSearchParams()

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await api.get("/jobs/", { params: { search, location, job_type: jobType, salary } })
      setJobs(res.data.results || res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const q = searchParams.get("search")
    if (q) setSearch(q)
  }, [])

  useEffect(() => {
    const t = setTimeout(fetchJobs, 450)
    return () => clearTimeout(t)
  }, [search, location, jobType, salary])

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px 10px 36px",
    borderRadius: "10px", border: "1.5px solid #e2e8f0",
    fontSize: "13px", color: "#0f172a", outline: "none",
    background: "white", boxSizing: "border-box", transition: "border-color 0.15s",
    fontFamily: "inherit",
  }

  const hasFilters = search || location || jobType || salary

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>Browse Jobs</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
            {loading ? "Searching…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        {hasFilters && (
          <button onClick={() => { setSearch(""); setLocation(""); setJobType(""); setSalary("") }}
            style={{ fontSize: "12px", color: "#ef4444", background: "#fff1f2", border: "1px solid #fecdd3", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f1f5f9", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round"/>
          </svg>
          <input placeholder="Job title, keywords…" value={search} onChange={e => setSearch(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
        </div>

        {/* Location */}
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round"/>
          </svg>
          <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
        </div>

        {/* Job type */}
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/>
          </svg>
          <select value={jobType} onChange={e => setJobType(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
            {jobTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Salary */}
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
          </svg>
          <input type="number" placeholder="Min salary (₹)" value={salary} onChange={e => setSalary(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
        </div>
      </div>

      {/* Job type quick filter pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {jobTypes.map(t => (
          <button key={t.value} onClick={() => setJobType(t.value)}
            style={{
              padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s",
              background: jobType === t.value ? "linear-gradient(135deg, #0ea5e9, #6366f1)" : "white",
              color: jobType === t.value ? "white" : "#64748b",
              border: `1.5px solid ${jobType === t.value ? "transparent" : "#e2e8f0"}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", height: "160px", animation: "pulse 1.5s ease-in-out infinite" }}>
              <div style={{ height: "14px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "10px", width: "60%" }} />
              <div style={{ height: "12px", background: "#f8fafc", borderRadius: "6px", marginBottom: "8px", width: "40%" }} />
              <div style={{ height: "12px", background: "#f8fafc", borderRadius: "6px", width: "50%" }} />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
          <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>No jobs found</h3>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  )
}

export default BrowseJobs
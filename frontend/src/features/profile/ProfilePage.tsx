import { useState, useEffect } from "react"
import api from "../../services/api"

interface ProfileState {
  firstName: string; lastName: string; email: string
  jobTitle: string; skills: string; bio: string
  resume: File | null; resumeUrl: string
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileState>({ firstName: "", lastName: "", email: "", jobTitle: "", skills: "", bio: "", resume: null, resumeUrl: "" })
  const [loading, setLoading]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState("")
  const [success, setSuccess]   = useState("")

  const fetchProfile = async () => {
    try {
      setLoading(true); setError("")
      const res = await api.get("/profile/")
      const d = res.data
      setProfile(p => ({ ...p, firstName: d.first_name || "", lastName: d.last_name || "", email: d.email || "", jobTitle: d.job_title || "", skills: d.skills || "", bio: d.bio || "", resume: null, resumeUrl: d.resume || "" }))
    } catch { setError("Failed to load profile") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true); setError(""); setSuccess("")
      const fd = new FormData()
      fd.append("first_name", profile.firstName)
      fd.append("last_name",  profile.lastName)
      fd.append("email",      profile.email)
      fd.append("job_title",  profile.jobTitle)
      fd.append("skills",     profile.skills)
      fd.append("bio",        profile.bio)
      if (profile.resume) fd.append("resume", profile.resume)
      await api.put("/profile/", fd)
      setSuccess("Profile updated successfully")
      await fetchProfile()
    } catch { setError("Failed to update profile") }
    finally { setSaving(false) }
  }

  const skillsList = profile.skills ? profile.skills.split(",").map(s => s.trim()).filter(Boolean) : []
  const initial = profile.firstName ? profile.firstName.charAt(0).toUpperCase() : "U"

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    borderRadius: "10px", border: "1.5px solid #e2e8f0",
    fontSize: "13.5px", color: "#0f172a", outline: "none",
    background: "white", boxSizing: "border-box", transition: "border-color 0.15s",
    fontFamily: "inherit",
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: "600",
    color: "#475569", marginBottom: "6px", letterSpacing: "0.03em", textTransform: "uppercase",
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
      <div style={{ color: "#94a3b8", fontSize: "14px" }}>Loading profile…</div>
    </div>
  )

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>

      {/* Left — profile card */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Avatar card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: "800", color: "white", margin: "0 auto 14px" }}>
            {initial}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
            {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : "Your Name"}
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#64748b" }}>
            {profile.jobTitle || "No job title set"}
          </p>
          <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px", fontSize: "12px", color: "#64748b", lineHeight: 1.5, textAlign: "left" }}>
            {profile.bio || "No bio added yet."}
          </div>
        </div>

        {/* Skills card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em" }}>Skills</h3>
          {skillsList.length === 0 ? (
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>No skills added yet</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skillsList.map(skill => (
                <span key={skill} style={{ fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px", background: "#f0f9ff", color: "#0ea5e9", border: "1px solid #e0f2fe" }}>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resume card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em" }}>Resume</h3>
          {profile.resumeUrl ? (
            <a href={`http://127.0.0.1:8000${profile.resumeUrl}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#f0fdf4", borderRadius: "10px", textDecoration: "none", border: "1px solid #bbf7d0" }}>
              <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a" }}>Resume uploaded</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Click to download</div>
              </div>
            </a>
          ) : (
            <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "10px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>No resume uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Right — edit form */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f8fafc" }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Edit Profile</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Update your personal and professional information</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>

          {error && (
            <div style={{ padding: "11px 14px", borderRadius: "10px", background: "#fff1f2", border: "1px solid #fecdd3", color: "#e11d48", fontSize: "13px", display: "flex", gap: "8px", alignItems: "center" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: "11px 14px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: "13px", display: "flex", gap: "8px", alignItems: "center" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {success}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input name="firstName" value={profile.firstName} placeholder="First name" onChange={handleChange} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input name="lastName" value={profile.lastName} placeholder="Last name" onChange={handleChange} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" value={profile.email} placeholder="your@email.com" onChange={handleChange} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
          </div>

          <div>
            <label style={labelStyle}>Job Title</label>
            <input name="jobTitle" value={profile.jobTitle} placeholder="e.g. Frontend Developer" onChange={handleChange} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
          </div>

          <div>
            <label style={labelStyle}>Skills <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(comma-separated)</span></label>
            <input name="skills" value={profile.skills} placeholder="React, Python, Django…" onChange={handleChange} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
          </div>

          <div>
            <label style={labelStyle}>Bio</label>
            <textarea name="bio" value={profile.bio} placeholder="Write a short professional summary…" rows={4} onChange={handleChange}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
          </div>

          <div>
            <label style={labelStyle}>Upload Resume</label>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "10px", border: "2px dashed", borderColor: profile.resume ? "#0ea5e9" : "#e2e8f0", background: profile.resume ? "#f0f9ff" : "#fafafa", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: profile.resume ? "#0ea5e9" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" fill="none" stroke={profile.resume ? "white" : "#94a3b8"} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "500", color: profile.resume ? "#0ea5e9" : "#64748b" }}>
                  {profile.resume ? profile.resume.name : "Choose a PDF file"}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>PDF, DOC, DOCX accepted</div>
              </div>
              <input type="file" accept=".pdf,.doc,.docx" onChange={e => setProfile(p => ({ ...p, resume: e.target.files?.[0] || null }))} style={{ display: "none" }}/>
            </label>
          </div>

          <button type="submit" disabled={saving} style={{ padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "white", fontSize: "14px", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, transition: "opacity 0.15s", fontFamily: "inherit", letterSpacing: "0.01em" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
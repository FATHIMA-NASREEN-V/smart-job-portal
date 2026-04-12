import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../../../services/authService"
import api from "../../../services/api"

interface RegisterForm {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  role: "jobseeker" | "employer"
}

const InputField = ({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) => (
  <div>
    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px", letterSpacing: "0.03em", textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }}
        width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d={icon} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {children}
    </div>
  </div>
)

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px 11px 36px",
  borderRadius: "10px", border: "1.5px solid #e2e8f0",
  fontSize: "13.5px", color: "#0f172a", outline: "none",
  background: "white", boxSizing: "border-box", transition: "border-color 0.15s",
  fontFamily: "inherit",
}

const Register = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<RegisterForm>({
    username: "", email: "", password: "",
    first_name: "", last_name: "", role: "jobseeker",
  })
  const [resume, setResume]       = useState<File | null>(null)
  const [parsed, setParsed]       = useState<any>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState("")
  const [showPw, setShowPw]       = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true); setError("")
      if (resume && form.role === "jobseeker") {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => fd.append(k, v))
        fd.append("resume", resume)
        const res = await api.post("/register-with-resume/", fd, { headers: { "Content-Type": "multipart/form-data" } })
        if (res.data.parsed_profile) setParsed(res.data.parsed_profile)
      } else {
        await registerUser(form)
      }
      setStep(2)
      setTimeout(() => navigate("/login"), 2800)
    } catch (err: any) {
      const data = err?.response?.data
      if (data) {
        const first = Object.values(data)[0]
        setError(Array.isArray(first) ? (first[0] as string) : "Registration failed")
      } else setError("Something went wrong")
    } finally { setLoading(false) }
  }

  if (step === 2) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "420px", padding: "48px 32px", background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>Account created!</h2>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>Redirecting you to login…</p>
        {parsed && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "14px", textAlign: "left" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a", marginBottom: "6px" }}>✓ Profile auto-filled from resume</p>
            {parsed.job_title && <p style={{ fontSize: "12px", color: "#475569", margin: "2px 0" }}>Role: {parsed.job_title}</p>}
            {parsed.skills && <p style={{ fontSize: "12px", color: "#475569", margin: "2px 0" }}>Skills: {parsed.skills}</p>}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Left panel */}
      <div style={{ width: "42%", background: "linear-gradient(145deg, #0f172a, #1e3a5f)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", position: "relative", overflow: "hidden" }} className="hidden md:flex">
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(14,165,233,0.08)", top: "-100px", right: "-100px" }} />
        <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(99,102,241,0.08)", bottom: "-50px", left: "-80px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "60px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800", color: "white" }}>S</div>
            <span style={{ color: "white", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.02em" }}>SmartJob</span>
          </div>
          <h1 style={{ color: "white", fontSize: "34px", fontWeight: "700", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.03em" }}>Start your journey<br />with us today.</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7, margin: "0 0 48px", maxWidth: "320px" }}>Create your account in under 2 minutes. Upload your resume and let AI fill in your profile automatically.</p>
          {[
            ["AI resume parsing", "Upload your PDF and we auto-fill your skills & title"],
            ["Instant matching", "Get matched to jobs that fit your profile"],
            ["Real-time updates", "Get notified the moment your application status changes"],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(14,165,233,0.2)", border: "1px solid rgba(14,165,233,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                <svg width="10" height="10" fill="none" stroke="#38bdf8" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "600" }}>{title}</div>
                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Create your account</h2>
            <p style={{ color: "#64748b", margin: 0, fontSize: "13.5px" }}>Already have one? <Link to="/login" style={{ color: "#0ea5e9", fontWeight: "600", textDecoration: "none" }}>Sign in</Link></p>
          </div>

          {error && (
            <div style={{ padding: "11px 14px", borderRadius: "10px", background: "#fff1f2", border: "1px solid #fecdd3", color: "#e11d48", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
              {error}
            </div>
          )}

          {/* Role selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            {(["jobseeker", "employer"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                style={{ padding: "12px", borderRadius: "12px", border: "2px solid", borderColor: form.role === r ? "#0ea5e9" : "#e2e8f0", background: form.role === r ? "#f0f9ff" : "white", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{r === "jobseeker" ? "🎯" : "🏢"}</div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: form.role === r ? "#0ea5e9" : "#64748b" }}>{r === "jobseeker" ? "Job Seeker" : "Employer"}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <InputField label="First name" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                <input name="first_name" placeholder="First" value={form.first_name} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
              </InputField>
              <InputField label="Last name" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                <input name="last_name" placeholder="Last" value={form.last_name} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
              </InputField>
            </div>

            <InputField label="Username" icon="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z">
              <input name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
            </InputField>

            <InputField label="Email" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
            </InputField>

            <InputField label="Password" icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
              <input type={showPw ? "text" : "password"} name="password" placeholder="Min 8 characters" value={form.password} onChange={handleChange} required style={{ ...inputStyle, paddingRight: "40px" }}
                onFocus={e => e.target.style.borderColor = "#0ea5e9"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}/>
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  {showPw ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" strokeLinecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                </svg>
              </button>
            </InputField>

            {/* Resume upload — jobseeker only */}
            {form.role === "jobseeker" && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px", letterSpacing: "0.03em", textTransform: "uppercase" }}>Resume (optional)</label>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "10px", border: "2px dashed", borderColor: resume ? "#0ea5e9" : "#e2e8f0", background: resume ? "#f0f9ff" : "#fafafa", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: resume ? "#0ea5e9" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" fill="none" stroke={resume ? "white" : "#94a3b8"} strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: resume ? "#0ea5e9" : "#64748b" }}>
                      {resume ? resume.name : "Upload your resume (PDF)"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>AI will auto-fill your profile</div>
                  </div>
                  <input type="file" accept=".pdf" onChange={e => setResume(e.target.files?.[0] || null)} style={{ display: "none" }}/>
                </label>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "white", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "4px", transition: "opacity 0.15s", letterSpacing: "0.01em", fontFamily: "inherit" }}>
              {loading ? (resume ? "Reading resume & creating account…" : "Creating account…") : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
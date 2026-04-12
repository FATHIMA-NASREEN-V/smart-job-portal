import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/reduxHooks"
import { loginSuccess } from "../authSlice"
import { loginUser } from "../../../services/authService"

const Login = () => {
  const navigate  = useNavigate()
  const dispatch  = useAppDispatch()

  const [form, setForm]       = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [showPw, setShowPw]   = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "admin":    return "/admin/dashboard"
      case "employer": return "/employer/dashboard"
      default:         return "/jobseeker/dashboard"
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      const res = await loginUser(form)
      localStorage.setItem("token", res.access)
      dispatch(loginSuccess({ user: { username: res.username, role: res.role }, token: res.access }))
      navigate(getDashboardRoute(res.role))
    } catch {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#f8fafc",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Left panel */}
      <div style={{
        width: "45%",
        background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 60%, #0c2a4a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        position: "relative",
        overflow: "hidden",
      }}
      className="hidden md:flex"
      >
        {/* Background circles */}
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", background: "rgba(14,165,233,0.08)",
          top: "-100px", right: "-100px",
        }} />
        <div style={{
          position: "absolute", width: "300px", height: "300px",
          borderRadius: "50%", background: "rgba(99,102,241,0.08)",
          bottom: "-50px", left: "-80px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "60px" }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "12px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: "800", color: "white",
            }}>S</div>
            <span style={{ color: "white", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.02em" }}>
              SmartJob
            </span>
          </div>

          <h1 style={{
            color: "white", fontSize: "36px", fontWeight: "700",
            lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.03em",
          }}>
            Your next big<br />opportunity awaits.
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0, maxWidth: "340px" }}>
            Connect with top companies, build your career, and track your applications — all in one place.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "32px", marginTop: "56px" }}>
            {[["10K+", "Active Jobs"], ["2K+", "Companies"], ["50K+", "Placements"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ color: "#0ea5e9", fontSize: "22px", fontWeight: "700" }}>{num}</div>
                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <div style={{ marginBottom: "36px" }}>
            <h2 style={{
              fontSize: "26px", fontWeight: "700", color: "#0f172a",
              margin: "0 0 8px", letterSpacing: "-0.02em",
            }}>Welcome back</h2>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div style={{
              padding: "12px 14px", borderRadius: "10px",
              background: "#fff1f2", border: "1px solid #fecdd3",
              color: "#e11d48", fontSize: "13px", marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Username */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                Username
              </label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                  width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", padding: "11px 14px 11px 38px",
                    borderRadius: "10px", border: "1px solid #e2e8f0",
                    fontSize: "14px", color: "#0f172a", outline: "none",
                    background: "white", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                  width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round"/>
                </svg>
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", padding: "11px 40px 11px 38px",
                    borderRadius: "10px", border: "1px solid #e2e8f0",
                    fontSize: "14px", color: "#0f172a", outline: "none",
                    background: "white", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0,
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    {showPw
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" strokeLinecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                color: "white", fontSize: "14px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "4px",
                transition: "opacity 0.15s",
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#0ea5e9", fontWeight: "600", textDecoration: "none" }}>
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
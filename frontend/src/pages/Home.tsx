import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/common/Navbar"

const features = [
  {
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    title: "Smart Search",
    desc: "Filter by role, location, salary and job type to find your perfect match instantly.",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "One-click Apply",
    desc: "Apply to any job with a single click. Your profile and resume are sent automatically.",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    title: "Track Applications",
    desc: "Monitor every application in real time. Get notified the moment your status changes.",
    color: "#10b981",
    bg: "#f0fdf4",
  },
]

const stats = [
  { value: "10K+", label: "Active Jobs" },
  { value: "2K+",  label: "Companies" },
  { value: "50K+", label: "Job Seekers" },
  { value: "98%",  label: "Satisfaction" },
]

const Home = () => {
  const [search, setSearch]   = useState("")
  const navigate              = useNavigate()

  const handleSearch = () => {
    navigate(search.trim()
      ? `/jobseeker/jobs?search=${search}`
      : "/jobseeker/jobs")
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 60%, #0c2a4a 100%)",
        padding: "100px 24px 80px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
          top: "-200px", right: "-100px", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          bottom: "-200px", left: "-100px", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          {/* Badge */}
          <span style={{
            display: "inline-block", padding: "6px 16px",
            background: "rgba(14,165,233,0.15)", color: "#38bdf8",
            borderRadius: "999px", fontSize: "12px", fontWeight: "600",
            border: "1px solid rgba(14,165,233,0.25)", marginBottom: "24px",
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}>AI-Powered Job Portal</span>

          <h1 style={{
            color: "white", fontSize: "clamp(36px, 5vw, 58px)",
            fontWeight: "800", lineHeight: 1.1,
            margin: "0 0 20px", letterSpacing: "-0.03em",
          }}>
            Find Your Dream Job<br />
            <span style={{ color: "#38bdf8" }}>Faster Than Ever</span>
          </h1>

          <p style={{
            color: "#94a3b8", fontSize: "17px", lineHeight: 1.7,
            maxWidth: "520px", margin: "0 auto 40px",
          }}>
            Upload your resume and let AI match you to the best opportunities. Connect with top companies in seconds.
          </p>

          {/* Search bar */}
          <div style={{
            display: "flex",
            background: "white",
            borderRadius: "14px",
            overflow: "hidden",
            maxWidth: "540px",
            margin: "0 auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}>
            <div style={{ position: "relative", flex: 1 }}>
              <svg style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", padding: "16px 16px 16px 46px",
                  border: "none", outline: "none",
                  fontSize: "14px", color: "#0f172a",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              style={{
                padding: "0 28px",
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                color: "white", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Search Jobs
            </button>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "28px" }}>
            <Link to="/register" style={{
              padding: "12px 28px", borderRadius: "10px",
              background: "white", color: "#0f172a",
              fontSize: "14px", fontWeight: "600", textDecoration: "none",
              transition: "opacity 0.15s",
            }}>Get Started Free</Link>
            <Link to="/login" style={{
              padding: "12px 28px", borderRadius: "10px",
              background: "rgba(255,255,255,0.1)", color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              fontSize: "14px", fontWeight: "600", textDecoration: "none",
            }}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        background: "white",
        borderBottom: "1px solid #f1f5f9",
        padding: "32px 24px",
      }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto",
          display: "flex", justifyContent: "center",
          gap: "clamp(32px, 8vw, 80px)", flexWrap: "wrap",
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.03em" }}>{value}</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{
            fontSize: "32px", fontWeight: "800", color: "#0f172a",
            margin: "0 0 12px", letterSpacing: "-0.02em",
          }}>Everything you need</h2>
          <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "460px", margin: "0 auto" }}>
            From discovery to offer, we've got every step of your job search covered.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: "white", borderRadius: "16px",
              padding: "28px", border: "1px solid #f1f5f9",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"
              el.style.transform = "translateY(-3px)"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.boxShadow = "none"
              el.style.transform = "translateY(0)"
            }}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: f.bg, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "20px",
              }}>
                <svg width="22" height="22" fill="none" stroke={f.color} strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d={f.icon} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        margin: "0 24px 80px",
        maxWidth: "1052px",
        marginLeft: "auto",
        marginRight: "auto",
        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
        borderRadius: "20px",
        padding: "56px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
          background: "rgba(14,165,233,0.1)", top: "-100px", right: "-80px", pointerEvents: "none",
        }} />
        <h2 style={{
          color: "white", fontSize: "28px", fontWeight: "800",
          margin: "0 0 12px", letterSpacing: "-0.02em", position: "relative",
        }}>Ready to land your next role?</h2>
        <p style={{ color: "#94a3b8", margin: "0 0 28px", position: "relative" }}>
          Join thousands of job seekers who found their dream job through SmartJob.
        </p>
        <Link to="/register" style={{
          display: "inline-block", padding: "13px 32px",
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          color: "white", borderRadius: "10px",
          fontSize: "14px", fontWeight: "600", textDecoration: "none",
          position: "relative",
        }}>Create Free Account</Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #f1f5f9", padding: "24px",
        textAlign: "center", color: "#94a3b8", fontSize: "13px",
      }}>
        © 2025 SmartJob Portal. All rights reserved.
      </footer>
    </div>
  )
}

export default Home
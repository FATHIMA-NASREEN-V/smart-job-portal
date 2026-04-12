import { NavLink } from "react-router-dom"

interface SidebarProps {
  role: "employer" | "jobseeker" | "admin"
  isOpen?: boolean
  toggle?: () => void
}

interface MenuItem {
  label: string
  path: string
  icon: string
}

const Sidebar = ({ role, isOpen = true, toggle }: SidebarProps) => {

  const adminMenu: MenuItem[] = [
    { label: "Dashboard",    path: "/admin/dashboard",     icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Users",        path: "/admin/users",         icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Jobs",         path: "/admin/jobs",          icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Applications", path: "/admin/applications",  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Profile",      path: "/admin/profile",       icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ]

  const employerMenu: MenuItem[] = [
    { label: "Dashboard",    path: "/employer/dashboard",    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Post Job",     path: "/employer/post-job",     icon: "M12 4v16m8-8H4" },
    { label: "My Jobs",      path: "/employer/jobs",         icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Applications", path: "/employer/applications", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Profile",      path: "/employer/profile",      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ]

  const jobseekerMenu: MenuItem[] = [
    { label: "Dashboard",   path: "/jobseeker/dashboard",  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Browse Jobs", path: "/jobseeker/jobs",       icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { label: "Applied",     path: "/jobseeker/applied",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { label: "Saved Jobs",  path: "/jobseeker/saved-jobs", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
    { label: "Profile",     path: "/jobseeker/profile",    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ]

  const menus = { employer: employerMenu, jobseeker: jobseekerMenu, admin: adminMenu }
  const menu = menus[role]

  const roleLabel = { employer: "Employer", jobseeker: "Job Seeker", admin: "Admin" }
  const roleColor = { employer: "#6366f1", jobseeker: "#0ea5e9", admin: "#f59e0b" }

  return (
    <aside
      style={{
        width: isOpen ? "240px" : "72px",
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div style={{
        padding: isOpen ? "24px 20px 20px" : "24px 0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: isOpen ? "space-between" : "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {isOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: "700", color: "white", flexShrink: 0,
            }}>S</div>
            <div>
              <div style={{ color: "white", fontSize: "13px", fontWeight: "600", lineHeight: 1.2 }}>SmartJob</div>
              <div style={{ color: roleColor[role], fontSize: "10px", fontWeight: "500", letterSpacing: "0.05em", textTransform: "uppercase" }}>{roleLabel[role]}</div>
            </div>
          </div>
        )}
        {!isOpen && (
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "700", color: "white",
          }}>S</div>
        )}
        {toggle && (
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#475569", padding: "4px", borderRadius: "6px",
            display: "flex", alignItems: "center",
            ...(isOpen ? {} : { position: "absolute", top: "28px", right: "-12px",
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", width: "22px", height: "22px",
              justifyContent: "center", zIndex: 10 }),
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isOpen
                ? <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M13 5l7 7-7 7M6 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              }
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        {!isOpen && <div style={{ height: "8px" }} />}
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!isOpen ? item.label : ""}
            style={{ textDecoration: "none" }}
          >
            {({ isActive }) => (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: isOpen ? "10px 12px" : "10px",
                borderRadius: "10px",
                justifyContent: isOpen ? "flex-start" : "center",
                background: isActive ? "rgba(14,165,233,0.15)" : "transparent",
                borderLeft: isActive ? "3px solid #0ea5e9" : "3px solid transparent",
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)" }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
              >
                <svg width="18" height="18" fill="none" stroke={isActive ? "#0ea5e9" : "#64748b"} strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {isOpen && (
                  <span style={{
                    fontSize: "13.5px",
                    fontWeight: isActive ? "600" : "400",
                    color: isActive ? "#e2e8f0" : "#94a3b8",
                    letterSpacing: "0.01em",
                  }}>{item.label}</span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "11px",
          color: "#334155",
          letterSpacing: "0.03em",
        }}>
          SMART JOB PORTAL © 2025
        </div>
      )}
    </aside>
  )
}

export default Sidebar
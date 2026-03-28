import { NavLink } from "react-router-dom"

interface SidebarProps {
  role: "employer" | "jobseeker"
  isOpen?: boolean
  toggle?: () => void
}

interface MenuItem {
  label: string
  path: string
}

const Sidebar = ({ role, isOpen = true, toggle }: SidebarProps) => {

  const employerMenu: MenuItem[] = [
    { label: "Dashboard", path: "/employer/dashboard" },
    { label: "Post Job", path: "/employer/post-job" },
    { label: "My Jobs", path: "/employer/jobs" },
    { label: "Applications", path: "/employer/applications" },
    { label: "Profile", path: "/employer/profile" }
  ]

  const jobseekerMenu: MenuItem[] = [
    { label: "Dashboard", path: "/jobseeker/dashboard" },
    { label: "Browse Jobs", path: "/jobseeker/jobs" },
    { label: "Applied Jobs", path: "/jobseeker/applied" },
    { label: "Saved Jobs", path: "/jobseeker/saved-jobs" },
    { label: "Profile", path: "/jobseeker/profile" }
  ]

  const menu = role === "employer" ? employerMenu : jobseekerMenu

  return (
    <aside
      className={`bg-slate-900 text-white min-h-screen p-4 transition-all duration-300 flex flex-col
      ${isOpen ? "w-64" : "w-20"}`}
    >

      {/* Top Section */}
      <div className="flex items-center justify-between mb-8">

        <h2 className="text-xl font-bold text-blue-400">
          {isOpen ? "Smart Job Portal" : "SJP"}
        </h2>

        {toggle && (
          <button
            onClick={toggle}
            className="text-gray-400 hover:text-white"
          >
            {isOpen ? "⬅" : "➡"}
          </button>
        )}

      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-2">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!isOpen ? item.label : ""}
            className={({ isActive }) =>
              `p-2 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-700 text-gray-300"
              }`
            }
          >
            {isOpen ? item.label : item.label.charAt(0)}
          </NavLink>
        ))}

      </nav>

    </aside>
  )
}

export default Sidebar
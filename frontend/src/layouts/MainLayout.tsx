import { useState } from "react"
import Sidebar from "../components/common/Sidebar"
import Topbar from "../components/common/Topbar"
import { Outlet } from "react-router-dom"

interface DashboardLayoutProps {
  role: "employer" | "jobseeker"
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
      />

      {/* Main */}
      <div className="flex flex-col flex-1">

        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout
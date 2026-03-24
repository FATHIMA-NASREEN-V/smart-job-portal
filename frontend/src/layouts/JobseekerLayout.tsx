import Sidebar from "../components/common/Sidebar"
import Topbar from "../components/common/Topbar"
import { Outlet } from "react-router-dom"





const JobSeekerLayout = () => {

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar role="jobseeker" />

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

      </div>

    </div>

  )
}

export default JobSeekerLayout
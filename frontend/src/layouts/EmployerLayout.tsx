import Sidebar from "../components/common/Sidebar"
import Topbar from "../components/common/Topbar"
import { Outlet } from "react-router-dom"


const EmployerLayout = () => {

  return (

    <div className="flex">

      <Sidebar role="employer" />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Topbar />

        <div className="p-6">
          <Outlet />
        </div>

      </div>

    </div>

  )
}

export default EmployerLayout
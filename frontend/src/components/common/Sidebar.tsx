import { Link } from "react-router-dom"

interface SidebarProps {
  role: string
}

const Sidebar = ({ role }: SidebarProps) => {

  return (

    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col p-6">

      {/* Logo */}

      <h2 className="text-2xl font-bold mb-10 text-blue-400">
        Smart Job Portal
      </h2>


      {/* Employer Menu */}

      {role === "employer" && (
        <nav className="flex flex-col space-y-4">

          <Link
            to="/employer/dashboard"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Dashboard
          </Link>

          <Link
            to="/employer/post-job"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Post Job
          </Link>

          <Link
            to="/employer/jobs"
            className="hover:bg-slate-700 p-2 rounded"
          >
            My Jobs
          </Link>

          <Link
            to="/employer/applications"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Applications
          </Link>

          <Link
            to="/employer/profile"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Profile
          </Link>


        </nav>
      )}


      {/* Jobseeker Menu */}

      {role === "jobseeker" && (
        <nav className="flex flex-col space-y-4">

          <Link
            to="/jobseeker/dashboard"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Dashboard
          </Link>

          <Link
            to="/jobseeker/jobs"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Browse Jobs
          </Link>

          <Link
            to="/jobseeker/applied"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Applied Jobs
          </Link>

          <Link 
          to="/jobseeker/saved-jobs"
          className="hover:bg-slate-700 p-2 rounded"
          >
            Saved Jobs

          </Link>

          <Link
            to="/jobseeker/profile"
            className="hover:bg-slate-700 p-2 rounded"
          >
            Profile
          </Link>

        </nav>
      )}

    </div>
  )
}

export default Sidebar
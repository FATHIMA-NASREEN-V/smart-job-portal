import { Link } from "react-router-dom"

const Navbar = () => {

  return (

    <nav className="flex justify-between items-center p-6 bg-white shadow">

      <h1 className="text-2xl font-bold text-blue-600">
        Smart Job Portal
      </h1>

      <div className="space-x-6">

        <Link
          to="/jobseeker/jobs"
          className="text-gray-700 hover:text-blue-600"
        >
          Browse Jobs
        </Link>

        <Link
          to="/login"
          className="px-4 py-2 text-gray-700 hover:text-blue-600"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Register
        </Link>

      </div>

    </nav>

  )
}

export default Navbar
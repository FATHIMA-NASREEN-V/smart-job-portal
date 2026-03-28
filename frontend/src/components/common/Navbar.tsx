import { Link, useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks"
import { logout } from "../../features/auth/authSlice"

const Navbar = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (

    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">
        Smart Job Portal
      </h1>

      {/* Links */}
      <div className="flex items-center space-x-6">

        <Link
          to="/jobseeker/jobs"
          className="text-gray-700 hover:text-blue-600"
        >
          Browse Jobs
        </Link>

        {!user ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* Role-based Dashboard */}
            <Link
              to={
                user.role === "employer"
                  ? "/employer/dashboard"
                  : "/jobseeker/dashboard"
              }
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>

            {/* Username */}
            <span className="text-sm text-gray-500">
              {user.username}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>

  )
}

export default Navbar
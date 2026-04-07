import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector } from "../hooks/reduxHooks"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  role?: "employer" | "jobseeker" | "admin"
}

const ProtectedRoute = ({ children, role }: Props) => {

  const { user, token } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // ❌ Not logged in
  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // ❌ Wrong role
  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  // ✅ Authorized
  return <>{children}</>
}

export default ProtectedRoute
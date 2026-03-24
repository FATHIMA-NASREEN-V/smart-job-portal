import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/reduxHooks"
import type { JSX } from "react"

interface Props {
  children: JSX.Element
  role?: string
}

const ProtectedRoute = ({ children, role }: Props) => {

  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
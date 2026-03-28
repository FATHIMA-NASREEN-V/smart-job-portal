import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/reduxHooks"
import { loginSuccess } from "../authSlice"
import { loginUser } from "../../../services/authService"

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      const res = await loginUser(form)

      const token = res.access

      const user = {
        username: res.username,
        role: res.role
      }

      // ✅ store token
      localStorage.setItem("token", token)

      // ✅ redux
      dispatch(loginSuccess({ user, token }))

      // ✅ redirect
      if (user.role === "employer") {
        navigate("/employer/dashboard")
      } else {
        navigate("/jobseeker/dashboard")
      }

    } catch (err: any) {
      console.error("Login error:", err)
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login to your account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>

          <input
            name="username"
            placeholder="Username"
            className="w-full p-3 border rounded mb-4"
            value={form.username}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?
          <Link to="/register" className="text-blue-600 ml-1">
            Register
          </Link>
        </p>

      </div>

    </div>

  )
}

export default Login
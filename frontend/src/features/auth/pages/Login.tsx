import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/reduxHooks"
import { loginSuccess } from "../authSlice"
import { loginUser } from "../../../services/authService"

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const handleLogin = async () => {

    try {

      setLoading(true)
      setError("")

      const res = await loginUser({
        username,
        password
      })
      console.log(res)

      const token = res.access

      const user = {
        username: res.username,
        role: res.role
      }

      // store token
      localStorage.setItem("token", token)

      // save to redux
      dispatch(loginSuccess({ user, token }))

      // role based redirect
      if (user.role === "employer") {
        navigate("/employer/dashboard")
      } else {
        navigate("/jobseeker/dashboard")
      }

    } catch (err: any) {

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

        <input
          placeholder="Username"
          className="w-full p-3 border rounded mb-4"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 ml-1"
          >
            Register
          </Link>

        </p>

      </div>

    </div>

  )
}

export default Login

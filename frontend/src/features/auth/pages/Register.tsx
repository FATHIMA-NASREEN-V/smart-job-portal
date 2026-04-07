import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../../../services/authService"


interface RegisterForm {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  role: "jobseeker" | "employer" 
}

const Register = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "jobseeker"
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      await registerUser(form)

      alert("Registration successful ✅")
      navigate("/login")

    } catch (err: any) {
      console.error("Register error:", err)

      const data = err?.response?.data

      if (data) {
        const firstError = Object.values(data)[0]
        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : "Registration failed"
        )
      } else {
        setError("Something went wrong ❌")
      }

    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <input
          name="username"
          value={form.username}
          placeholder="Username"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          name="first_name"
          value={form.first_name}
          placeholder="First Name"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="last_name"
          value={form.last_name}
          placeholder="Last Name"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={form.role}
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        >
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
          
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-1">
            Login
          </Link>
        </p>

      </form>

    </div>
  )
}

export default Register
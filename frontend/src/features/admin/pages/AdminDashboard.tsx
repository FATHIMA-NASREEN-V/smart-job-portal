import { useEffect, useState } from "react"
import api from "../../../services/api"

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0
  })

  const fetchStats = async () => {
    try {
      const [u, j, a] = await Promise.all([
        api.get("/admin/users/"),
        api.get("/jobs/"),
        api.get("/applications/")
      ])

      setStats({
        users: u.data.length,
        jobs: (j.data.results || j.data).length,
        applications: (a.data.results || a.data).length
      })

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Users" value={stats.users} />
        <Card title="Jobs" value={stats.jobs} />
        <Card title="Applications" value={stats.applications} />
      </div>
    </div>
  )
}

const Card = ({ title, value }: any) => (
  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
)

export default AdminDashboard
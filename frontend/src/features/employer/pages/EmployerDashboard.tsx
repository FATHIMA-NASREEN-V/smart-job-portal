import { useEffect, useState } from "react"
import api from "../../../services/api"

interface Job {
  id: number
  title: string
  location: string
  salary?: number
  status?: string
}

interface Application {
  id: number
  status: string
}

interface Stats {
  totalJobs: number
  totalApplications: number
  accepted: number
  pending: number
}

const EmployerDashboard = () => {

  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalApplications: 0,
    accepted: 0,
    pending: 0
  })

  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs/"),
        api.get("/applications/employer/")
      ])

      const jobs = jobsRes.data?.results || jobsRes.data
      const applications = appsRes.data?.results || appsRes.data

      const accepted = applications.filter(
        (a: Application) => a.status === "accepted"
      ).length

      const pending = applications.filter(
        (a: Application) => a.status === "pending"
      ).length

      setStats({
        totalJobs: jobs.length,
        totalApplications: applications.length,
        accepted,
        pending
      })

      setRecentJobs(jobs.slice(0, 5))

    } catch (error) {
      console.error("Dashboard data error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const statsCards = [
    { title: "Total Jobs", value: stats.totalJobs },
    { title: "Applications", value: stats.totalApplications },
    { title: "Accepted", value: stats.accepted },
    { title: "Pending", value: stats.pending }
  ]

  return (

    <div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Employer Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {statsCards.map((item, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >

            <h2 className="text-gray-500 text-sm">
              {item.title}
            </h2>

            <p className="text-2xl font-bold mt-2">
              {item.value}
            </p>

          </div>

        ))}

      </div>

      {/* RECENT JOBS */}
      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-4">
          Recent Job Posts
        </h2>

        <div className="bg-white rounded shadow">

          {loading ? (

            <p className="p-6 text-blue-500">Loading...</p>

          ) : recentJobs.length === 0 ? (

            <p className="p-6 text-gray-500">
              No jobs posted yet
            </p>

          ) : (

            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Salary</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>

                {recentJobs.map((job) => (

                  <tr key={job.id} className="border-t">

                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">
                      ₹{job.salary || "Not disclosed"}
                    </td>
                    <td className="p-3">
                      {job.status || "Active"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  )
}

export default EmployerDashboard
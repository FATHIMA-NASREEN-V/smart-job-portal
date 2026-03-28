import { useEffect, useState } from "react"
import api from "../../../services/api"

interface Job {
  id: number
  title: string
  location: string
  salary?: number
}

interface Application {
  id: number
  status: string
}

interface Stats {
  available: number
  applied: number
  pending: number
  accepted: number
}

const JobSeekerDashboard = () => {

  const [stats, setStats] = useState<Stats>({
    available: 0,
    applied: 0,
    pending: 0,
    accepted: 0
  })

  const [latestJobs, setLatestJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDashboard = async () => {
    try {
      setLoading(true)

      const [jobsRes, appRes] = await Promise.all([
        api.get("/jobs/"),
        api.get("/applications/jobseeker/")
      ])

      const jobs = jobsRes.data.results || jobsRes.data
      const applications = appRes.data.results || appRes.data

      const pending = applications.filter(
        (a: Application) => a.status.toLowerCase() === "pending"
      ).length

      const accepted = applications.filter(
        (a: Application) => a.status.toLowerCase() === "accepted"
      ).length

      setStats({
        available: jobs.length,
        applied: applications.length,
        pending,
        accepted
      })

      setLatestJobs(jobs.slice(0, 5))

    } catch (error) {
      console.error("Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (

    <div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Job Seeker Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Available Jobs</p>
          <h2 className="text-2xl font-bold mt-2">{stats.available}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Applied Jobs</p>
          <h2 className="text-2xl font-bold mt-2">{stats.applied}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Pending Applications</p>
          <h2 className="text-2xl font-bold mt-2">{stats.pending}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Accepted</p>
          <h2 className="text-2xl font-bold mt-2">{stats.accepted}</h2>
        </div>

      </div>

      {/* LATEST JOBS */}
      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-4">
          Latest Jobs
        </h2>

        <div className="bg-white p-6 rounded shadow">

          {loading ? (

            <p className="text-blue-500">Loading...</p>

          ) : latestJobs.length === 0 ? (

            <p className="text-gray-500">
              No jobs available right now
            </p>

          ) : (

            <ul className="space-y-3">

              {latestJobs.map((job) => (
                <li key={job.id} className="border-b pb-2">

                  <p className="font-semibold">
                    {job.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {job.location} • ₹{job.salary || "Not disclosed"}
                  </p>

                </li>
              ))}

            </ul>

          )}

        </div>

      </div>

    </div>

  )
}

export default JobSeekerDashboard
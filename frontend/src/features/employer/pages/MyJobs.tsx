import { useEffect, useState } from "react"
import api from "../../../services/api"

interface Job {
  id: number
  title: string
  location: string
  salary?: number
  job_type: string
  status: "approved" | "pending" | "rejected" | string
}

const MyJobs = () => {

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  const fetchJobs = async () => {
    try {
      setLoading(true)

      const res = await api.get("/jobs/")
      const data = res.data?.results || res.data

      setJobs(data)

    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        My Jobs
      </h1>

      <div className="bg-white shadow rounded overflow-hidden">

        {loading ? (

          <p className="p-6 text-blue-500">Loading...</p>

        ) : jobs.length === 0 ? (

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
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>

              {jobs.map((job) => (
                <tr key={job.id} className="border-t">

                  <td className="p-3 font-medium">{job.title}</td>
                  <td className="p-3">{job.location}</td>

                  <td className="p-3">
                    ₹{job.salary || "Not disclosed"}
                  </td>

                  <td className="p-3">{job.job_type}</td>

                  <td className="p-3">

                    <span
                      className={`px-2 py-1 rounded text-sm ${getStatusStyle(job.status)}`}
                    >
                      {job.status}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}

export default MyJobs
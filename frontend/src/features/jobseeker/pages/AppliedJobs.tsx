import { useEffect, useState } from "react"
import api from "../../../services/api"

// ✅ Define type (we’ll refine later)
interface Application {
  id: number
  job_title: string
  applied_at: string
  status: "pending" | "accepted" | "rejected"
}

const AppliedJobs = () => {

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await api.get("/applications/jobseeker/")

      // ✅ Handle pagination safely
      const data = res.data?.results || res.data

      setApplications(data)

    } catch (err) {
      console.error("Error fetching applications", err)
      setError("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Applied Jobs
      </h1>

      {/* ✅ Loading */}
      {loading && (
        <p className="text-gray-500">Loading applications...</p>
      )}

      {/* ✅ Error */}
      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

      {/* ✅ Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Job</th>
                <th className="p-3 text-left">Applied Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>

              {applications.length === 0 ? (

                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No applications yet
                  </td>
                </tr>

              ) : (

                applications.map((app) => (
                  <tr key={app.id} className="border-t">

                    <td className="p-3 font-medium">
                      {app.job_title}
                    </td>

                    <td className="p-3">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded text-sm font-medium
                          ${app.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"}
                        `}
                      >
                        {app.status}
                      </span>

                    </td>

                  </tr>
                ))

              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}

export default AppliedJobs
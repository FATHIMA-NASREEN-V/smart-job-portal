import { useEffect, useState } from "react"
import api from "../../../services/api"

interface Application {
  id: number
  job_title: string
  applicant_username: string
  status: "accepted" | "pending" | "rejected" | string
}

const Applications = () => {

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchApplications = async () => {
    try {
      setLoading(true)

      const res = await api.get("/applications/employer/")
      const data = res.data?.results || res.data

      setApplications(data)

    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      setUpdatingId(id)

      await api.patch(`/applications/update-status/${id}/`, { status })

      // refresh list
      await fetchApplications()

    } catch (error) {
      console.error("Status update failed:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Applications
      </h1>

      <div className="bg-white shadow rounded overflow-hidden">

        {loading ? (

          <p className="p-6 text-blue-500">Loading...</p>

        ) : applications.length === 0 ? (

          <p className="p-6 text-gray-500">
            No applications yet
          </p>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Job</th>
                <th className="p-3 text-left">Applicant</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>

              {applications.map((app) => (
                <tr key={app.id} className="border-t">

                  <td className="p-3 font-medium">
                    {app.job_title}
                  </td>

                  <td className="p-3">
                    {app.applicant_username}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-2 py-1 rounded text-sm ${getStatusStyle(app.status)}`}
                    >
                      {app.status}
                    </span>

                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      disabled={updatingId === app.id}
                      onClick={() => updateStatus(app.id, "accepted")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {updatingId === app.id ? "..." : "Accept"}
                    </button>

                    <button
                      disabled={updatingId === app.id}
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {updatingId === app.id ? "..." : "Reject"}
                    </button>

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

export default Applications
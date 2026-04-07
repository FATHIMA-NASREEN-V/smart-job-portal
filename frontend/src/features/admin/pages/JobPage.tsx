import { useEffect, useState } from "react"
import { getAllJobsAdmin, deleteJobAdmin } from "../../../services/authService"

const JobsPage = () => {

  const [jobs, setJobs] = useState<any[]>([])

  const fetchJobs = async () => {
    const data = await getAllJobsAdmin()
    setJobs(data)
  }

  const handleDelete = async (id?: number) => {
    if (!id) return

    await deleteJobAdmin(id)
    fetchJobs()
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Location</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td className="p-3">{j.title}</td>
              <td className="p-3">{j.location}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(j.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JobsPage
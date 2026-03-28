import { useEffect, useState } from "react"
import api from "../../../services/api"
import JobCard from "../../../components/jobs/Jobcard"

interface Job {
  id: number
  title: string
  company: string
  location: string
  job_type: string
  salary?: number
  is_saved?: boolean
  is_applied?: boolean
}

interface SavedJob {
  id: number
  job: Job
}

const SavedJobs = () => {

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await api.get("/jobs/my-saved/")

      const data = res.data?.results || res.data

      setSavedJobs(data)

    } catch (err) {
      console.error("Error fetching saved jobs:", err)
      setError("Failed to load saved jobs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Saved Jobs
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading saved jobs...</p>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

      {/* Empty */}
      {!loading && !error && savedJobs.length === 0 && (
        <p className="text-gray-500">
          No saved jobs yet
        </p>
      )}

      {/* Data */}
      {!loading && !error && savedJobs.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((item) => (
            <JobCard key={item.id} job={item.job} />
          ))}
        </div>
      )}

    </div>
  )
}

export default SavedJobs
import { useEffect, useState } from "react"
import api from "../../../services/api"
import { useSearchParams } from "react-router-dom"
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

const BrowseJobs = () => {

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [salary, setSalary] = useState("")

  const [searchParams] = useSearchParams()

  // FETCH JOBS
  const fetchJobs = async () => {
    try {
      setLoading(true)

      const res = await api.get("/jobs/", {
        params: {
          search,
          location,
          job_type: jobType,
          salary
        }
      })

      setJobs(res.data.results || res.data)

    } catch (error) {
      console.error("Error fetching jobs", error)
    } finally {
      setLoading(false)
    }
  }

  // INITIAL LOAD + HOMEPAGE SEARCH
  useEffect(() => {
    const querySearch = searchParams.get("search")

    if (querySearch) {
      setSearch(querySearch)
    }
  }, [])

  // AUTO FETCH (Debounce)
  useEffect(() => {

    const delayDebounce = setTimeout(() => {
      fetchJobs()
    }, 500)

    return () => clearTimeout(delayDebounce)

  }, [search, location, jobType, salary])

  return (

    <div className="p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        Browse Jobs
      </h1>

      {/* FILTERS */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-3 rounded"
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">Job Type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>

          <input
            type="number"
            placeholder="Min Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="border p-3 rounded"
          />

        </div>

      </div>

      {/* JOB LIST */}
      {loading ? (

        <p className="text-blue-500">Loading jobs...</p>

      ) : jobs.length === 0 ? (

        <p className="text-gray-500">No jobs found</p>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

        </div>

      )}

    </div>
  )
}

export default BrowseJobs
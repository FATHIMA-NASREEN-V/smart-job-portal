import { useState } from "react"
import api from "../../services/api"

interface Job {
  id: number
  title: string
  company: string
  location: string
  job_type: string
  salary?: number
  is_applied?: boolean
  is_saved?: boolean
}

interface Props {
  job: Job
}

const JobCard = ({ job }: Props) => {

  const [loadingApply, setLoadingApply] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)

  const [applied, setApplied] = useState(job.is_applied || false)
  const [saved, setSaved] = useState(job.is_saved || false)

  // APPLY JOB
  const applyJob = async () => {
    try {
      setLoadingApply(true)

      await api.post("/applications/apply/", {
        job: job.id
      })

      setApplied(true)

    } catch (error) {
      console.error(error)
    } finally {
      setLoadingApply(false)
    }
  }

  // SAVE JOB
  const handleSaveJob = async () => {
    try {
      setLoadingSave(true)

      await api.post("/jobs/save/", {
        job: job.id
      })

      setSaved(true)

    } catch (error) {
      console.error(error)
    } finally {
      setLoadingSave(false)
    }
  }

  return (

    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300 flex flex-col justify-between">

      {/* JOB INFO */}
      <div>

        <h2 className="text-xl font-semibold text-gray-800">
          {job.title}
        </h2>

        <p className="text-gray-600 mt-1">
          {job.company}
        </p>

        <p className="text-gray-500 text-sm mt-1">
          📍 {job.location}
        </p>

        <p className="text-sm mt-2 text-blue-600 font-medium">
          {job.job_type}
        </p>

        {job.salary && (
          <p className="text-green-600 font-semibold mt-2">
            ₹ {job.salary}
          </p>
        )}

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-5">

        <button
          onClick={applyJob}
          disabled={loadingApply || applied}
          className={`flex-1 py-2 rounded text-white 
            ${applied ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loadingApply ? "Applying..." : applied ? "Applied" : "Apply"}
        </button>

        <button
          onClick={handleSaveJob}
          disabled={loadingSave || saved}
          className={`flex-1 py-2 rounded border 
            ${saved 
              ? "bg-green-100 text-green-700 border-green-300" 
              : "border-blue-600 text-blue-600 hover:bg-blue-50"}
          `}
        >
          {loadingSave ? "Saving..." : saved ? "Saved" : "Save"}
        </button>

      </div>

    </div>

  )
}

export default JobCard
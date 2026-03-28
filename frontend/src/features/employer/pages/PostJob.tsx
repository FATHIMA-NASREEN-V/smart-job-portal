import { useState } from "react"
import { createJob } from "../../../services/authService"
import { useNavigate } from "react-router-dom"

interface JobForm {
  title: string
  description: string
  location: string
  salary: string
  job_type: string
}

const PostJob = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState<JobForm>({
    title: "",
    description: "",
    location: "",
    salary: "",
    job_type: "full_time"
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      await createJob(formData)

      alert("Job posted successfully!")
      navigate("/employer/jobs")

    } catch (error) {
      console.error("Post job error:", error)
      alert("Failed to post job")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-6">
        Post a Job
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >

        <input
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="salary"
          placeholder="Salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <select
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
        </select>

        <textarea
          name="description"
          placeholder="Job Description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

      </form>

    </div>
  )
}

export default PostJob
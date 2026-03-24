import { useState } from "react"
import { createJob } from "../../../services/authService"
import { useNavigate } from "react-router-dom"

const PostJob = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    job_type: "full_time"
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {

      await createJob(formData)

      alert("Job posted successfully!")

      navigate("/employer/jobs")

    } catch (error) {

      console.error(error)
      alert("Failed to post job")

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
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="salary"
          placeholder="Salary"
          type="number"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <select
          name="job_type"
          className="w-full border p-3 rounded"
          onChange={handleChange}
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
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>

      </form>

    </div>
  )
}

export default PostJob
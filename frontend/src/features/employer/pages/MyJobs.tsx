import { useEffect, useState } from "react"
import axios from "axios"

const MyJobs = () => {

  const [jobs, setJobs] = useState<any[]>([])

  const token = localStorage.getItem("token")

  const fetchJobs = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/jobs/",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setJobs(res.data)

    } catch (error) {

      console.error("Error fetching jobs", error)

    }

  }

  useEffect(()=>{
    fetchJobs()
  },[])

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        My Jobs
      </h1>

      <div className="bg-white shadow rounded overflow-hidden">

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

            {jobs.map((job)=>(
              <tr key={job.id} className="border-t">

                <td className="p-3 font-medium">{job.title}</td>
                <td className="p-3">{job.location}</td>
                <td className="p-3">₹{job.salary}</td>
                <td className="p-3">{job.job_type}</td>
                <td className="p-3">

                  <span
                    className={`px-2 py-1 rounded text-sm
                      ${job.status === "approved" ? "bg-green-100 text-green-700" :
                        job.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"}
                    `}
                  >
                    {job.status}
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}

export default MyJobs
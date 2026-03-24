import { useEffect, useState } from "react"
import axios from "axios"

const EmployerDashboard = () => {

  const token = localStorage.getItem("token")

  const [stats,setStats] = useState({
    totalJobs:0,
    totalApplications:0,
    accepted:0,
    pending:0
  })

  const [recentJobs,setRecentJobs] = useState<any[]>([])

  const fetchDashboardData = async () => {

    try {

      const jobsRes = await axios.get(
        "http://127.0.0.1:8000/api/jobs/",
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      )

      const appsRes = await axios.get(
        "http://127.0.0.1:8000/api/applications/employer/",
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      )

      const jobs = jobsRes.data
      const applications = appsRes.data

      setStats({
        totalJobs: jobs.length,
        totalApplications: applications.length,
        accepted: applications.filter((a:any)=>a.status==="accepted").length,
        pending: applications.filter((a:any)=>a.status==="pending").length
      })

      setRecentJobs(jobs.slice(0,5))

    } catch (error) {
      console.error("Dashboard data error",error)
    }

  }

  useEffect(()=>{
    fetchDashboardData()
  },[])

  const statsCards = [
    {title:"Total Jobs",value:stats.totalJobs},
    {title:"Applications",value:stats.totalApplications},
    {title:"Accepted",value:stats.accepted},
    {title:"Pending",value:stats.pending}
  ]

  return (

    <div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Employer Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {statsCards.map((item,index)=>(

          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >

            <h2 className="text-gray-500 text-sm">
              {item.title}
            </h2>

            <p className="text-2xl font-bold mt-2">
              {item.value}
            </p>

          </div>

        ))}

      </div>


      {/* Recent Jobs */}

      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-4">
          Recent Job Posts
        </h2>

        <div className="bg-white rounded shadow">

          {recentJobs.length === 0 ? (

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
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>

                {recentJobs.map((job)=>(

                  <tr key={job.id} className="border-t">

                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">₹{job.salary}</td>
                    <td className="p-3">{job.status}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  )
}

export default EmployerDashboard
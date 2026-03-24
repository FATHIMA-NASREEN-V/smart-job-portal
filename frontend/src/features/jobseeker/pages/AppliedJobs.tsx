import { useEffect, useState } from "react"
import axios from "axios"

const AppliedJobs = () => {

  const [applications,setApplications] = useState<any[]>([])
  const token = localStorage.getItem("token")

  const fetchApplications = async () => {

    try{

      const res = await axios.get(
        "http://127.0.0.1:8000/api/applications/jobseeker/",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setApplications(res.data)

    }catch(error){
      console.error("Error fetching applications",error)
    }

  }

  useEffect(()=>{
    fetchApplications()
  },[])

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Applied Jobs
      </h1>

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

              applications.map((app)=>(
                <tr key={app.id} className="border-t">

                  <td className="p-3 font-medium">
                    {app.job_title}
                  </td>

                  <td className="p-3">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded text-sm
                        ${app.status === "accepted" ? "bg-green-100 text-green-700" :
                          app.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"}
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

    </div>

  )
}

export default AppliedJobs
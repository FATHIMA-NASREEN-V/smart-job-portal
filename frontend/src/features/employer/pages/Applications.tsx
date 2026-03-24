import { useEffect, useState } from "react"
import axios from "axios"

const Applications = () => {

  const [applications,setApplications] = useState<any[]>([])
  const token = localStorage.getItem("token")

  const fetchApplications = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/applications/employer/",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setApplications(res.data)

    } catch (error) {
      console.error("Error fetching applications",error)
    }

  }

  const updateStatus = async (id:number,status:string) => {

    try {

      await axios.patch(
        `http://127.0.0.1:8000/api/applications/update-status/${id}/`,
        {status},
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      fetchApplications()

    } catch (error) {
      console.error("Status update failed",error)
    }

  }

  useEffect(()=>{
    fetchApplications()
  },[])

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Applications
      </h1>

      <div className="bg-white shadow rounded overflow-hidden">

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

            {applications.map((app)=>(
              <tr key={app.id} className="border-t">

                <td className="p-3 font-medium">
                  {app.job_title}
                </td>

                <td className="p-3">
                  {app.applicant_username}
                </td>

                <td className="p-3">

                  <span
                    className={`px-2 py-1 rounded text-sm
                    ${app.status === "accepted" ? "bg-green-100 text-green-700" :
                      app.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"}
                    `}
                  >
                    {app.status}
                  </span>

                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={()=>updateStatus(app.id,"accepted")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>

                  <button
                    onClick={()=>updateStatus(app.id,"rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Applications
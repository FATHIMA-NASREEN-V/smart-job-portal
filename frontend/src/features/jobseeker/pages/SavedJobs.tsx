import { useEffect, useState } from "react"
import axios from "axios"
import JobCard from "../../../components/jobs/Jobcard"

const SavedJobs = () => {

  const [savedJobs,setSavedJobs] = useState<any[]>([])
  const [loading,setLoading] = useState(false)

  const token = localStorage.getItem("token")

  const fetchSavedJobs = async () => {

    try{

      setLoading(true)

      const res = await axios.get(
        "http://127.0.0.1:8000/api/jobs/my-saved/",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

     setSavedJobs(res.data.results || res.data)

    }catch(error){
      console.error("Error fetching saved jobs",error)
    }finally{
      setLoading(false)
    }

  }

  useEffect(()=>{
    fetchSavedJobs()
  },[])

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Saved Jobs
      </h1>

      {loading ? (

        <p>Loading...</p>

      ) : savedJobs.length === 0 ? (

        <p className="text-gray-500">
          No saved jobs yet
        </p>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {savedJobs.map((item)=>(
            <JobCard key={item.id} job={item.job}/>
          ))}

        </div>

      )}

    </div>
  )
}

export default SavedJobs
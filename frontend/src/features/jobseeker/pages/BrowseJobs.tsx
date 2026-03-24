import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom"
import JobCard from "../../../components/jobs/Jobcard"

const BrowseJobs = () => {

  const [jobs,setJobs] = useState<any[]>([])
  const [loading,setLoading] = useState(false)

  const [search,setSearch] = useState("")
  const [location,setLocation] = useState("")
  const [jobType,setJobType] = useState("")
  const [salary,setSalary] = useState("")

  const [searchParams] = useSearchParams()

  const token = localStorage.getItem("token")

  const fetchJobs = async () => {

    try{

      setLoading(true)

      const res = await axios.get(
        `http://127.0.0.1:8000/api/jobs/?search=${search}&location=${location}&job_type=${jobType}&salary=${salary}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setJobs(res.data)

    }catch(error){
      console.error("Error fetching jobs",error)
    }finally{
      setLoading(false)
    }

  }

  // Homepage search support
  useEffect(()=>{

    const querySearch = searchParams.get("search")

    if(querySearch){
      setSearch(querySearch)
    }

    fetchJobs()

  },[])

  return (

    <div className="p-6">

      {/* Page Title */}

      <h1 className="text-3xl font-bold mb-8">
        Browse Jobs
      </h1>


      {/* Filters */}

      <div className="bg-white shadow rounded-lg p-6 mb-8">

        <div className="grid md:grid-cols-4 gap-4">

          {/* Search */}

          <input
            type="text"
            placeholder="Job title..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border p-3 rounded"
          />

          {/* Location */}

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e)=>setLocation(e.target.value)}
            className="border p-3 rounded"
          />

          {/* Job Type */}

          <select
            value={jobType}
            onChange={(e)=>setJobType(e.target.value)}
            className="border p-3 rounded"
          >

            <option value="">Job Type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>

          </select>

          {/* Salary */}

          <input
            type="number"
            placeholder="Min Salary"
            value={salary}
            onChange={(e)=>setSalary(e.target.value)}
            className="border p-3 rounded"
          />

        </div>

        <div className="mt-4">

          <button
            onClick={fetchJobs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Search Jobs
          </button>

        </div>

      </div>


      {/* Jobs List */}

      {loading ? (

        <p className="text-gray-500">Loading jobs...</p>

      ) : jobs.length === 0 ? (

        <p className="text-gray-500">No jobs found</p>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job)=>(
            <JobCard key={job.id} job={job}/>
          ))}

        </div>

      )}

    </div>

  )
}

export default BrowseJobs
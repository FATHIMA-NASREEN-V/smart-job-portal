import axios from "axios"

const JobCard = ({ job }: any) => {

  const token = localStorage.getItem("token")

  const applyJob = async () => {

    try{

      await axios.post(
        "http://127.0.0.1:8000/api/applications/apply/",
        { job: job.id },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      alert("Application submitted!")

    }catch(error){
      console.error(error)
      alert("Already Applied or Failed to apply job")
    }

  }


  const saveJob = async () => {

    try{

      await axios.post(
        "http://127.0.0.1:8000/api/jobs/save/",
        { job: job.id },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      alert("Job saved!")

    }catch(error){
      console.error(error)
      alert("Job already saved")
    }

  }


  return (

    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">

      {/* Job Title */}

      <h2 className="text-xl font-bold text-gray-800">
        {job.title}
      </h2>

      {/* Company */}

      <p className="text-gray-600 mt-1">
        {job.company}
      </p>

      {/* Location */}

      <p className="text-gray-500 text-sm mt-1">
        📍 {job.location}
      </p>

      {/* Job Type */}

      <p className="text-sm mt-2 text-blue-600 font-medium">
        {job.job_type}
      </p>

      {/* Salary */}

      <p className="text-green-600 font-semibold mt-2">
        ₹ {job.salary}
      </p>

      {/* Buttons */}

      <div className="flex gap-3 mt-5">

        <button
          onClick={applyJob}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Apply
        </button>

        <button
          onClick={saveJob}
          className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded"
        >
          Save
        </button>

      </div>

    </div>

  )
}

export default JobCard
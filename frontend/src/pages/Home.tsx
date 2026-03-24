import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/common/Navbar"

const Home = () => {

  const [search,setSearch] = useState("")
  const navigate = useNavigate()

  const handleSearch = () => {

    if(search.trim() !== ""){
      navigate(`/jobseeker/jobs?search=${search}`)
    }else{
      navigate("/jobseeker/jobs")
    }

  }

  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar />

      {/* Hero Section */}

      <div className="flex flex-col items-center justify-center text-center mt-32">

        <h1 className="text-5xl font-bold text-gray-800">
          Find Your Dream Job
        </h1>

        <p className="text-gray-600 mt-4">
          Connect with top companies and start your career today
        </p>

        <Link
          to="/register"
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Get Started
        </Link>

      </div>

      {/* Search Bar */}

      <div className="mt-10 flex justify-center">

        <div className="flex bg-white shadow rounded-lg overflow-hidden">

          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="px-4 py-3 w-80 outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6"
          >
            Search
          </button>

        </div>

      </div>

      {/* Features */}

      <div className="mt-32 grid md:grid-cols-3 gap-8 px-10">

        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-xl font-semibold">Find Jobs</h3>
          <p className="text-gray-600 mt-2">
            Browse thousands of job opportunities
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-xl font-semibold">Apply Easily</h3>
          <p className="text-gray-600 mt-2">
            Apply to jobs with a single click
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-xl font-semibold">Track Applications</h3>
          <p className="text-gray-600 mt-2">
            Monitor your job applications easily
          </p>
        </div>

      </div>

    </div>
  )
}

export default Home
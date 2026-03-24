import { useState, useEffect } from "react"
import axios from "axios"

const Profile = () => {

  const [profile,setProfile] = useState({
    firstName:"",
    lastName:"",
    email:"",
    jobTitle:"",
    skills:"",
    bio:"",
    resume:null as File | null,
    resumeUrl:""
  })

  const token = localStorage.getItem("token")

  // Fetch profile from backend
  const fetchProfile = async () => {

    try{

      const res = await axios.get(
        "http://127.0.0.1:8000/api/profile/",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      const data = res.data

      setProfile({
        firstName:data.first_name || "",
        lastName:data.last_name || "",
        email:data.email || "",
        jobTitle:data.job_title || "",
        skills:data.skills || "",
        bio:data.bio || "",
        resume:null,
        resumeUrl:data.resume || ""
      })

    }catch(error){
      console.error("Profile fetch error",error)
    }

  }

  useEffect(()=>{
    fetchProfile()
  },[])


  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setProfile({
      ...profile,
      [e.target.name]:e.target.value
    })

  }

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {

    if(e.target.files){
      setProfile({
        ...profile,
        resume:e.target.files[0]
      })
    }

  }

  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append("first_name",profile.firstName)
    formData.append("last_name",profile.lastName)
    formData.append("email",profile.email)
    formData.append("job_title",profile.jobTitle)
    formData.append("skills",profile.skills)
    formData.append("bio",profile.bio)

    if(profile.resume){
      formData.append("resume",profile.resume)
    }

    try{

      await axios.put(
        "http://127.0.0.1:8000/api/profile/",
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"multipart/form-data"
          }
        }
      )

      alert("Profile updated successfully")

      fetchProfile()

    }catch(error){
      console.error("Profile update error",error)
    }

  }

  return (

    <div className="grid md:grid-cols-3 gap-6">

      {/* Profile Card */}

      <div className="bg-white p-6 rounded-lg shadow">

        <div className="flex flex-col items-center">

          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile.firstName ? profile.firstName.charAt(0) : "U"}
          </div>

          <h2 className="mt-4 text-xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>

          <p className="text-gray-500">
            {profile.jobTitle}
          </p>

          <p className="text-sm text-gray-500 mt-2 text-center">
            {profile.bio}
          </p>

        </div>

        <div className="mt-6">

          <h3 className="font-semibold mb-2">
            Skills
          </h3>

          <p className="text-gray-600 text-sm">
            {profile.skills}
          </p>

        </div>

        <div className="mt-6">

          <h3 className="font-semibold mb-2">
            Resume
          </h3>

          {profile.resumeUrl ? (

            <a
              href={`http://127.0.0.1:8000${profile.resumeUrl}`}
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Download Resume
            </a>

          ) : (

            <p className="text-gray-500 text-sm">
              No resume uploaded
            </p>

          )}

        </div>

      </div>


      {/* Edit Profile Form */}

      <div className="md:col-span-2">

        <h1 className="text-3xl font-bold mb-6">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4"
        >

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              placeholder="First Name"
              className="border p-3 rounded"
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              placeholder="Last Name"
              className="border p-3 rounded"
              onChange={handleChange}
            />

          </div>
            <input
              type="text"
              name="email"
              value={profile.email}
              placeholder="Email"
              className="w-full border p-3 rounded"
              onChange={handleChange}
            />

          <input
            type="text"
            name="jobTitle"
            value={profile.jobTitle}
            placeholder="Job Title"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="skills"
            value={profile.skills}
            placeholder="Skills (React, Django, Python)"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <textarea
            name="bio"
            value={profile.bio}
            placeholder="Write about yourself"
            rows={4}
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <div>

            <label className="block mb-2 font-medium">
              Upload Resume
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

            {profile.resume && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {profile.resume.name}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>

        </form>

      </div>

    </div>

  )
}

export default Profile
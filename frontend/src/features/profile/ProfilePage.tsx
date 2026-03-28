import { useState, useEffect } from "react"
import api from "../../services/api"

interface ProfileState {
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  skills: string
  bio: string
  resume: File | null
  resumeUrl: string
}

const Profile = () => {

  const [profile, setProfile] = useState<ProfileState>({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    skills: "",
    bio: "",
    resume: null,
    resumeUrl: ""
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // ✅ Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await api.get("/profile/")
      const data = res.data

      setProfile((prev) => ({
        ...prev,
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        jobTitle: data.job_title || "",
        skills: data.skills || "",
        bio: data.bio || "",
        resume: null,
        resumeUrl: data.resume || ""
      }))

    } catch (err) {
      console.error("Profile fetch error:", err)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // ✅ Input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // ✅ File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfile((prev) => ({
        ...prev,
        resume: e.target.files![0]
      }))
    }
  }

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      const formData = new FormData()

      formData.append("first_name", profile.firstName)
      formData.append("last_name", profile.lastName)
      formData.append("email", profile.email)
      formData.append("job_title", profile.jobTitle)
      formData.append("skills", profile.skills)
      formData.append("bio", profile.bio)

      if (profile.resume) {
        formData.append("resume", profile.resume)
      }

      await api.put("/profile/", formData)

      setSuccess("Profile updated successfully")

      await fetchProfile()

    } catch (err) {
      console.error("Profile update error:", err)
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (

    <div className="grid md:grid-cols-3 gap-6">

      {loading ? (

        <p className="text-gray-500 col-span-3">
          Loading profile...
        </p>

      ) : (

        <>
          {/* PROFILE CARD */}
          <div className="bg-white p-6 rounded-lg shadow">

            <div className="flex flex-col items-center">

              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.firstName ? profile.firstName.charAt(0) : "U"}
              </div>

              <h2 className="mt-4 text-xl font-bold">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="text-gray-500">
                {profile.jobTitle || "No job title"}
              </p>

              <p className="text-sm text-gray-500 mt-2 text-center">
                {profile.bio || "No bio added"}
              </p>

            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Skills</h3>
              <p className="text-gray-600 text-sm">
                {profile.skills || "No skills added"}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Resume</h3>

              {profile.resumeUrl ? (
                <a
                  href={`http://127.0.0.1:8000${profile.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
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

          {/* FORM */}
          <div className="md:col-span-2">

            <h1 className="text-3xl font-bold mb-6">
              Edit Profile
            </h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-600 mb-4">{success}</p>}

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow space-y-4"
            >

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  name="firstName"
                  value={profile.firstName}
                  placeholder="First Name"
                  className="border p-3 rounded"
                  onChange={handleChange}
                />

                <input
                  name="lastName"
                  value={profile.lastName}
                  placeholder="Last Name"
                  className="border p-3 rounded"
                  onChange={handleChange}
                />

              </div>

              <input
                name="email"
                value={profile.email}
                placeholder="Email"
                className="w-full border p-3 rounded"
                onChange={handleChange}
              />

              <input
                name="jobTitle"
                value={profile.jobTitle}
                placeholder="Job Title"
                className="w-full border p-3 rounded"
                onChange={handleChange}
              />

              <input
                name="skills"
                value={profile.skills}
                placeholder="Skills"
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
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>

            </form>

          </div>
        </>
      )}

    </div>
  )
}

export default Profile
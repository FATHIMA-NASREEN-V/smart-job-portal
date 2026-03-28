import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"

import EmployerDashboard from "../features/employer/pages/EmployerDashboard"
import JobSeekerDashboard from "../features/jobseeker/pages/JobSeekerDashboard"

import ProtectedRoute from "./ProtectedRoute"
import EmployerLayout from "../layouts/EmployerLayout"
import JobSeekerLayout from "../layouts/JobseekerLayout"

import BrowseJobs from "../features/jobseeker/pages/BrowseJobs"
import PostJob from "../features/employer/pages/PostJob"
import AppliedJobs from "../features/jobseeker/pages/AppliedJobs"
import Applications from "../features/employer/pages/Applications"
import MyJobs from "../features/employer/pages/MyJobs"
import Profile from "../features/profile/ProfilePage"
import SavedJobs from "../features/jobseeker/pages/SavedJobs"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= JOBSEEKER ================= */}
        <Route
          path="/jobseeker"
          element={
            <ProtectedRoute role="jobseeker">
              <JobSeekerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobSeekerDashboard />} />
          <Route path="dashboard" element={<JobSeekerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="jobs" element={<BrowseJobs />} />
          <Route path="applied" element={<AppliedJobs />} />
          <Route path="saved-jobs" element={<SavedJobs />} />
        </Route>

        {/* ================= EMPLOYER ================= */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute role="employer">
              <EmployerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployerDashboard />} />
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="applications" element={<Applications />} />
          <Route path="jobs" element={<MyJobs />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
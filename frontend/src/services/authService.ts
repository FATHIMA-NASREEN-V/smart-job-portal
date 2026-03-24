import api from "./api"

/* =========================
   AUTH
========================= */

export const registerUser = async (data:any) => {

  const res = await api.post("/register/", data)

  return res.data
}

export const loginUser = async (data:any) => {

  const res = await api.post("/login/", data)

  return res.data
}


/* =========================
   JOBS
========================= */

export const getJobs = async (filters:any) => {

  const res = await api.get(" ",{
    params: filters
  })

  return res.data
}


// export const getJobDetails = async (id:number) => {

//   const res = await api.get(`/jobs/${id}/`)

//   return res.data
// }


export const createJob = async (jobData:any) => {

  const res = await api.post("/jobs/",jobData)

  return res.data
}


/* =========================
   APPLICATIONS
========================= */

export const applyJob = async (jobId:number) => {

  const res = await api.post("/applications/",{
    job: jobId
  })

  return res.data
}


export const updateApplicationStatus = async (id:number,status:string) => {

  const res = await api.patch(
    `/applications/update-status/${id}/`,
    {status}
  )

  return res.data
}


/* =========================
   SAVED JOBS
========================= */

export const saveJob = async (jobId:number) => {

  const res = await api.post("/save/",{
    job:jobId
  })

  return res.data
}


export const getSavedJobs = async () => {

  const res = await api.get("/my-saved/")

  return res.data
}
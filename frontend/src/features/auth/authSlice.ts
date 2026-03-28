import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  username: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
}

// ✅ Load token from localStorage (persist login)
const tokenFromStorage = localStorage.getItem("token")

const initialState: AuthState = {
  user: null,
  token: tokenFromStorage
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {

    // ✅ cleaner payload typing
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user
      state.token = action.payload.token

      // ✅ persist token
      localStorage.setItem("token", action.payload.token)
    },

    logout(state) {
      state.user = null
      state.token = null

      localStorage.removeItem("token")
    }

  }

})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"

// ✅ Create store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.MODE !== "production", // disable in prod
})

// ✅ Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
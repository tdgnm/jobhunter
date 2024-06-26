import { configureStore } from '@reduxjs/toolkit'
import { authSlice, authReducer } from './authSlice'
import { authApiSlice, authApiReducer } from './authApiSlice'
import { userApiSlice, userApiReducer } from './userApiSlice'
import { companyApiSlice, companyApiReducer } from './companyApiSlice'

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authReducer,
    [authApiSlice.reducerPath]: authApiReducer,
    [userApiSlice.reducerPath]: userApiReducer,
    [companyApiSlice.reducerPath]: companyApiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(companyApiSlice.middleware),
})
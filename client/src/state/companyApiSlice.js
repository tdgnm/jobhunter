import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import BASE_URL from './serverUrl'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const companyApiSlice = createApi({
  reducerPath: 'companyApi',
  baseQuery,
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => ({
        url: 'jobs',
      }),
      providesTags: ['Jobs'],
    }),
    getJob: builder.query({
      query: (id) => ({
        url: `jobs/${id}`,
      }),
      providesTags: ['Jobs'],
    }),
    getJobsByCompany: builder.query({
      query: (userId) => ({
        url: `jobs?userId=${userId}`,
      }),
      providesTags: ['Jobs'],
    }),
    getFilteredJobs: builder.query({
      query: (filter) => ({
        url: `jobs?${filter}`,
      }),
      providesTags: ['Jobs'],
    }),
    addJob: builder.mutation({
      query: (body) => ({
        url: 'jobs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Jobs'],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Jobs'],
    }),
    updateJob: builder.mutation({
      query: ({ id, body }) => ({
        url: `jobs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Jobs'],
    }),
  }),
})

export const companyApiReducer = companyApiSlice.reducer

export const {
  useGetJobsQuery,
  useGetJobQuery,
  useGetJobsByCompanyQuery,
  useGetFilteredJobsQuery,
  useAddJobMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
} = companyApiSlice
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

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery,
  endpoints: (builder) => ({
    addExperience: builder.mutation({
      query: (body) => ({
        url: 'experiences',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Experiences'],
    }),
    updateExperience: builder.mutation({
      query: ({ id, body }) => ({
        url: `experiences/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Experiences'],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `experiences/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experiences'],
    }),
    getExperiences: builder.query({
      query: () => ({
        url: 'experiences',
      }),
      providesTags: ['Experiences'],
    }),
    getExperiencesForUser: builder.query({
      query: (userId) => ({
        url: `experiences?userId=${userId}`,
      }),
      providesTags: ['Experiences'],
    }),

    addApplication: builder.mutation({
      query: (body) => ({
        url: 'applications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Applications'],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Applications'],
    }),
    getApplications: builder.query({
      query: () => ({
        url: 'applications',
      }),
      providesTags: ['Applications'],
    }),
    getApplicationsForJob: builder.query({
      query: (jobId) => ({
        url: `applications?jobId=${jobId}`,
      }),
      providesTags: ['Applications'],
    }),
    getApplicationsForJobUser: builder.query({
      query: ({ jobId, userId }) => ({
        url: `applications?jobId=${jobId}&userId=${userId}`,
      }),
      providesTags: ['Applications'],
    }),
  }),
})

export const userApiReducer = userApiSlice.reducer

export const {
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperiencesQuery,
  useGetExperiencesForUserQuery,
  useAddApplicationMutation,
  useDeleteApplicationMutation,
  useGetApplicationsQuery,
  useGetApplicationsForJobQuery,
  useGetApplicationsForJobUserQuery,
} = userApiSlice
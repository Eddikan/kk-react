import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-hot-toast';

export const designersApi = createApi({
  reducerPath: 'designersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_ENDPOINT,
  }),
  endpoints: (builder) => ({
    fetchDesigners: builder.query({
      query: ({ current_user_id, token }) =>
        `designers?current_user_id=${current_user_id}&token=${token}`,
      transformResponse: (response) => {
        console.log('Response received:', response); // Log the full response
        if (!response.data || !Array.isArray(response.data)) {
          const errorMessage = 'Unexpected response structure from the server.';
          console.error('Validation failed:', errorMessage); // Log validation errors
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        console.log('Valid data:', response.data); // Log the valid data
        return response.data;
      },
    }),
    getDesignsData: builder.query({
      query: () => 'portfolio/design',
      transformResponse: (response) => {
        console.log('Response received:', response); // Log the full response
        if (!response.data || !Array.isArray(response.data)) {
          const errorMessage = 'Unexpected response structure from the server.';
          console.error('Validation failed:', errorMessage); // Log validation errors
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        console.log('Valid data:', response.data); // Log the valid data
        return response.data;
      },
    }),
  }),
  onError: (error) => {
    console.error('Network error in baseQuery:', error); // Log baseQuery errors
  },
});

export const { useFetchDesignersQuery, useGetDesignsDataQuery } = designersApi;
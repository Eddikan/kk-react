// src/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api", // Unique key for the service
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_ENDPOINT, // Base URL for all endpoints
    prepareHeaders: (headers, { getState }) => {
      // Add Authorization token if available
      //   const token = (getState()).auth?.token;
      const token = localStorage.getItem("kk-token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: () => ({}), // Endpoints will be defined in specific services
});

export default api;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast"; // Assuming you're using react-toastify for toasts
import localforage from "localforage";

const logOut = async () => {
  await localforage.clear();
  localStorage.clear();
  window.location.href = "/login";
};
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_REACT_APP_API_ENDPOINT,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("kk-token");
    headers.set("Accept", `application/json`);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom baseQuery that catches errors
const baseQueryWithErrorHandler = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    // Show a toast for the error
    console.log("errrr", result);
    if (result.error.status == 401) {
      // unauthorized
      // logout
      toast.error(result.error.data.message);
      api.dispatch({ type: "RESET_STATE" });
      logOut();
    }
    result.error.data.errors.forEach((message) => {
      toast.error(message);
    });
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandler,
  endpoints: () => ({}),
});

export default api;

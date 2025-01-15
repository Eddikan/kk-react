import api from "./api";
import toast from "react-hot-toast";

export const queryService = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "user/profile",
      keepUnusedDataFor: 0, // Disable caching
      refetchOnMountOrArgChange: true,
      providesTags: ["Profile"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch({ type: "user/setUser", payload: data.data });
          }
        } catch (error) {
          if (error.error.status === 404) {
            toast.error(error.error.data.error);
          }
          toast.error("Failed to fetch users. Please try again.");
        }
      },
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch({ type: "users/setUser", payload: data });
        } catch (error) {
          console.log("error", error);
          toast.error("Failed to fetch user details. Please try again.");
        }
      },
    }),

    getDesigners: builder.query({
      query: ({ search = "", country = "" }) =>
        `designers?search=${search}&country=${country}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("designer is query", data.data.data);
          dispatch({ type: "designers/setDesigners", payload: data.data.data });
        } catch (error) {
          console.log("error", error);
          toast.error("Failed to fetch user details. Please try again.");
        }
      },
    }),
    getTimeZones: builder.query({
      query: () => `/timezones`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("timezones is query", data);
          if (data.success) {
            dispatch({ type: "misc/setTimeZones", payload: data.data });
          }
        } catch (error) {
          console.log("error", error);
          toast.error("Failed to fetch user details. Please try again.");
        }
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetUserByIdQuery,
  useGetDesignersQuery,
  useGetTimeZonesQuery,
} = queryService;

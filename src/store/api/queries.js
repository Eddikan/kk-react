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
        }
      },
    }),

    getDesigners: builder.query({
      query: ({ search = "", country = "" }) =>
        `designers?search=${search}&country=${country}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch({ type: "designers/setDesigners", payload: data.data.data });
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getTimeZones: builder.query({
      query: () => `timezones`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch({ type: "misc/setTimeZones", payload: data.data });
          }
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getDesignFilters: builder.query({
      query: () => `designs/filters`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch({
              type: "designers/setDesignFilters",
              payload: data.data,
            });
          }
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getDesignersFilters: builder.query({
      query: () => `designers/filters`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch({
              type: "designers/setDesignersFilters",
              payload: data.data,
            });
          }
        } catch (error) {
          console.log("error", error);
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
  useGetDesignFiltersQuery,
  useGetDesignersFiltersQuery
} = queryService;

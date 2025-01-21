import api from "./api";
import toast from "react-hot-toast";
import { setNotifications } from "../slices/notificationsSlice";
import { setWishlistItems } from "../slices/wishlistSlice";
import { setDesigns } from "../slices/designsSlice";
import { setCalendarData } from "../slices/calendarSlice";

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
    getMyDesigns: builder.query({
      query: () => `user/designs`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.success) {
            dispatch({
              type: "designers/setMyDesigns",
              payload: data.data,
            });
          }
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getMyNotifications: builder.query({
      query: () => `user/notifications?per_page=100&page=1`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.success) {
            dispatch(setNotifications(data.data));
          }
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getCartItems: builder.query({
      query: () => `user/cart`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch({ type: "cart/setCartItems", payload: data.data });
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getWishlistItems: builder.query({
      query: () => `user/wishlists`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setWishlistItems(data.data));
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getDesigns: builder.query({
      query: ({ page = 1, per_page = 100 }) =>
        `designs?page=${page}&per_page=${per_page}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setDesigns(data.data));
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    getMyCalender: builder.query({
      query: ({ year = 2024, month = '01' }) => `user/calender/${year}/${month}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCalendarData(data.data));
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
  useGetDesignersFiltersQuery,
  useGetMyDesignsQuery,
  useGetMyNotificationsQuery,
  useGetCartItemsQuery,
  useGetWishlistItemsQuery,
  useGetDesignsQuery,
  useGetMyCalenderQuery,
} = queryService;

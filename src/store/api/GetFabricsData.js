import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-hot-toast';

// Fabrics API (assume it's already defined)
export const fabricsApi = createApi({
    reducerPath: 'fabricsApi',
    baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_REACT_APP_API_ENDPOINT,
      retry: 3, // Retr
    }),

    tagTypes: ['Fabrics'], // Define the tags used in this API
    endpoints: (builder) => ({
      fetchFabrics: builder.query({
        query: () => `product/fabric`,
        transformResponse: (response) => response.data, // Assuming the data is in `response.data`
        providesTags: ['Fabrics'], // Declare that this query provides the "Fabrics" tag
      }),
    }),
  });

// Wishlist API
export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_ENDPOINT,
  }),
  endpoints: (builder) => ({
    updateWishlist: builder.mutation({
      query: ({ current_user_id, token, payload }) => ({
        url: `wishlist/update?current_user_id=${current_user_id}&token=${token}`,
        method: 'POST',
        body: payload, // Pass the payload
      }),
      async onQueryStarted({ current_user_id, token, payload }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === 'Success') {
            toast.success('Wishlist updated successfully!');
            // Trigger fetchFabrics query to refresh fabrics data
            dispatch(fabricsApi.util.invalidateTags(['Fabrics']));
          } else {
            toast.error('Something went wrong, please contact the administrator!');
          }
        } catch (error) {
          console.error('Error updating wishlist:', error);
          toast.error('Something went wrong, please contact the administrator!');
        }
      },
    }),
  }),
});

export const { useUpdateWishlistMutation } = wishlistApi;
export const { useFetchFabricsQuery } = fabricsApi;

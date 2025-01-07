import api from "./api";
import toast from "react-hot-toast";

export const mutationService = api.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ type, ...updateData }) => ({
        url: `user/profile?type=${type}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.invalidateTags(["Profile"]));
          dispatch(api.endpoints.getProfile.initiate());
        } catch (error) {
          toast.error("Failed to update user. Please try again.");
        }
      },
    }),
  }),
});

export const { useCreateUserMutation, useUpdateUserMutation } = mutationService;

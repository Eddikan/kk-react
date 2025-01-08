import api from "./api";

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
     
    }),
  }),
});

export const { useCreateUserMutation, useUpdateUserMutation } = mutationService;

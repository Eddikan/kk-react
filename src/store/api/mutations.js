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
    updateUserBodyMeasurement: builder.mutation({
      query: ({ ...updateData }) => ({
        url: `user/measurement`,
        method: "POST",
        body: updateData,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserBodyMeasurementMutation,
} = mutationService;

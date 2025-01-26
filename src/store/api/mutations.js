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
    updateUserAvatar: builder.mutation({
      query: (updateData) => ({
        url: `user/profile/upload-avatar`,
        method: "POST",
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
    updateUserSettings: builder.mutation({
      query: ({ ...updateData }) => ({
        url: `user/settings`,
        method: "PUT",
        body: updateData,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ ...updateData }) => ({
        url: `user/profile/change-password`,
        method: "PUT",
        body: updateData,
      }),
    }),

    regenerate2FA: builder.mutation({
      query: ({ email, type }) => ({
        url: `auth/2fa/resend?email=${email}&type=${type}`,
        method: "GET",
      }),
    }),
    TwoFALogin: builder.mutation({
      query: ({ ...code }) => ({
        url: `auth/2fa/verify`,
        method: "POST",
        body: code,
      }),
    }),
    updateUserAvailability: builder.mutation({
      query: (payload) => ({
        url: `user/availability`,
        method: "POST",
        body: payload,
      }),
    }),
    createDesign: builder.mutation({
      query: (payload) => ({
        url: `user/designs/create`,
        method: "POST",
        body: payload,
      }),
    }),
    deleteDesignerImage: builder.mutation({
      query: (id) => ({
        url: `user/designs/image/${id}`,
        method: "DELETE",
      }),
    }),
    deleteMyDesign: builder.mutation({
      query: (id) => ({
        url: `user/designs/${id}`,
        method: "DELETE",
      }),
    }),
    postSetAppointment: builder.mutation({
      query: (payload) => ({
        url: `appointment/schedule`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserBodyMeasurementMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserSettingsMutation,
  useUpdatePasswordMutation,
  useRegenerate2FAMutation,
  useTwoFALoginMutation,
  useUpdateUserAvailabilityMutation,
  useCreateDesignMutation,
  useDeleteDesignerImageMutation,
  useDeleteMyDesignMutation,
  usePostSetAppointmentMutation,
} = mutationService;

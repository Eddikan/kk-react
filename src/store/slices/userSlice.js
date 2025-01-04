import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    firstName: "",
  }, // User profile information
  email:"",
  preferences: {}, // User preferences (e.g., theme, language)
  loading: false, // Loading state for user-related operations
  error: null, // Error state for user-related operations
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    updatePreferences(state, action) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearUserData(state) {
      state.profile = null;
      state.preferences = {};
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setProfile,
  setEmail,
  updatePreferences,
  setLoading,
  setError,
  clearUserData,
} = userSlice.actions;
export default userSlice.reducer;

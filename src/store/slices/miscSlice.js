import { createSlice } from "@reduxjs/toolkit";

const miscSlice = createSlice({
  name: "misc",
  initialState: {
    timeZones: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTimeZones(state, action) {
      state.timeZones = action.payload;
    },
  },
});

export default miscSlice.reducer;

// Selectors
export const { setTimeZones } = miscSlice.actions;
export const selectTimezones = (state) => state.misc.timeZones;

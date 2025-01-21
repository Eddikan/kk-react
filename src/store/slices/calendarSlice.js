import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calendarData: [],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setCalendarData: (state, action) => {
      state.calendarData = action.payload;
    },
  },
});

export const { setCalendarData } = calendarSlice.actions;
export default calendarSlice.reducer;

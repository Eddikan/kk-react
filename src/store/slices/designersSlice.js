import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Async thunk for fetching designers
export const fetchDesigners = createAsyncThunk(
  'designers/fetchDesigners',
  async ({ current_user_id, token }, { rejectWithValue }) => {
    const endpoint = `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}designer?current_user_id=${current_user_id}&token=${token}`;
    try {
      const response = await axios.get(endpoint);
      return response.data.data; // Assuming designers are in `data.data`
    } catch (error) {
        console.log('error is',error)
      const errorMessage = 'There has been an error getting the designers, please try again!';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); // Return error for extra handling in slice
    }
  }
);

const designersSlice = createSlice({
  name: 'designers',
  initialState: {
    data: [],
    designers: [],
    loading: false,
    error: null,
  },
  reducers: {

    setDesigners(state, action) {
      state.designers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesigners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesigners.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Save fetched designers in the store
      })
      .addCase(fetchDesigners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Save error for potential debugging/logging
      });
  },
});

export default designersSlice.reducer;

// Selectors
export const {
  setDesigners,
} = designersSlice.actions;
export const selectDesigners = (state) => state.designers.designers;
export const selectDesignersLoading = (state) => state.designers.loading;
export const selectDesignersError = (state) => state.designers.error;

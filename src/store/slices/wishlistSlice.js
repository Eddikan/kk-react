import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    setWishlistItems: (state, action) => {
      state.wishlistItems = action.payload;
    },
  },
});

export const { setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;

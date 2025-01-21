import { createSlice } from '@reduxjs/toolkit';

const designsSlice = createSlice({
  name: 'designs',
  initialState: {
    designs: [],
  },
  reducers: {
    setDesigns: (state, action) => {
      state.designs = action.payload;
    },
 
  },
});
export const selectDesignById = (state, designId) => {
  return state.designs.designs.data.find(design => design.id === designId);
};
export const { setDesigns } = designsSlice.actions;
export default designsSlice.reducer;

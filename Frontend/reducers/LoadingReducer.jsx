import { PayloadAction, createSlice } from '@reduxjs/toolkit';


  
const initialState = {
  status: false,
};

const LoadingSlice = createSlice({
  name: 'Loading',
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = LoadingSlice.actions;
export default LoadingSlice.reducer;

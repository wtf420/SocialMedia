import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  key: '',
};

const TokenSlice = createSlice({
  name: 'Token',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.key = action.payload;
    },
  },
});

export const { setToken } = TokenSlice.actions;
export default TokenSlice.reducer;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

const initialState = {
  id: '',
};

const UidSlice = createSlice({
  name: 'Uid',
  initialState,
  reducers: {
    setIdFromJwt: (state, action) => {
      const json = jwt_decode(action.payload);
      state.id = json.id;
    },
  },
});

export const { setIdFromJwt } = UidSlice.actions;
export default UidSlice.reducer;

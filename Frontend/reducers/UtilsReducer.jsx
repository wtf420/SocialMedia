import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  postShow: false,
  share: {
    visible: false,
    link: '',
  },
  call: {
    visible: false,
    data: {},
  },
};

const UtilsSlice = createSlice({
  name: 'Utils',
  initialState,
  reducers: {
    setPostShow: (state, action) => {
      state.postShow = action.payload;
    },
    setShareShow: (state, action) => {
      state.share.visible = action.payload;
    },
    setShareLink: (state, action) => {
      state.share.link = action.payload;
    },
    setCallShow: (state, action) => {
      state.call.visible = action.payload;
    },
    setDataCall: (state, action) => {
      state.call.data = action.payload;
    },
  },
});

export const {
  setPostShow,
  setShareShow,
  setShareLink,
  setCallShow,
  setDataCall,
} = UtilsSlice.actions;
export default UtilsSlice.reducer;

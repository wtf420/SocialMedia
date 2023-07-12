import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  arr: [],
  numberNoti: 0,
};

const NotificationSlice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.numberNoti = 0;
      action.payload.map((item) => {
        state.arr.unshift(item);
        if (!item.isRead) {
          state.numberNoti++;
        }
      });
    },
    pushNotification: (state, action) => {
      state.arr.unshift(action.payload);
      if (!action.payload.isRead) {
        state.numberNoti++;
      }
    },
    setNumberNoti: (state) => {
      state.numberNoti = 0;
    },
    clearNotifications: (state) => {
      state.arr = [];
    },
  },
});

export const {
  setNotifications,
  pushNotification,
  setNumberNoti,
  clearNotifications,
} = NotificationSlice.actions;
export default NotificationSlice.reducer;

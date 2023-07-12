import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  phoneNumber: '',
  location: '',
  company: {
    logoUrl: '',
    name: '',
    linkToWebsite: '',
  },
  connections: [],
  chatRooms: [],
  userRole: '',
  profileImagePath: '',
  backgroundImagePath: '',
  dateOfBirth: '',
  hometown: '',
  workingPlace: '',
  headline: '',
  followers: [],
  followings: [],
};

const UserSlice = createSlice({
  name: 'UserInfo',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.location = action.payload.location || '';

      if (action.payload.company) {
        state.company.name = action.payload.company.name;
        state.company.logoUrl = action.payload.company.logoUrl;
        state.company.linkToWebsite = action.payload.company.linkToWebsite;
      }

      state.connections = action.payload.connections || [];
      state.chatRooms = action.payload.chatRooms || [];
      state.userRole = action.payload.userRole;
      state.profileImagePath = action.payload.profileImagePath || '';
      state.backgroundImagePath = action.payload.backgroundImagePath || '';
      state.followers = action.payload.followers || [];
      state.followings = action.payload.followings || [];
      state.dateOfBirth = action.payload.dateOfBirth || '';
      state.hometown = action.payload.hometown || '';
      state.workingPlace = action.payload.workingPlace || '';
      state.headline = action.payload.headline || '';
    },
    updateAvatar: (state, action) => {
      state.profileImagePath = action.payload;
    },
    updateBackground: (state, action) => {
      state.backgroundImagePath = action.payload;
    },
    addFriend: (state, action) => {
      state.connections.push(action.payload);
    },
    unfriend: (state, action) => {
      state.connections = state.connections.filter(
        (item) => item._id !== action.payload,
      );
    },
  },
});

export const {
  saveUser,
  updateAvatar,
  updateBackground,
  addFriend,
  unfriend,
} = UserSlice.actions;
export default UserSlice.reducer;

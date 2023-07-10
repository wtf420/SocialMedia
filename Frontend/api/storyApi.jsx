import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Main: [],
  Sub: []
};

const StorySlice = createSlice({
  name: "Story",
  initialState,
  reducers: {
    pushStory: (state, action) => {
      state.Main.push(action.payload);
    },
    pushStorySub: (state, action) => {
      const index = state.Sub.findIndex(item => item._id === action.payload._id);
      if (index === -1) state.Sub.push(action.payload);
    },
    deleteStory: (state, action) => {
      const index = state.Main.findIndex(item => item._id === action.payload);
      if (index !== -1) state.Main.splice(index, 1);

      const indexSub = state.Sub.findIndex(item => item._id === action.payload);
      if (indexSub !== -1) state.Sub.splice(indexSub, 1);
    },
    toggleLikeStory: (state, action) => {
      const index = state.Main.findIndex(item => item._id === action.payload);
      if (index !== -1) state.Main[index].isLiked = !state.Main[index].isLiked;

      const indexSub = state.Sub.findIndex(item => item._id === action.payload);
      if (indexSub !== -1) state.Sub[indexSub].isLiked = !state.Sub[indexSub].isLiked;
    },
    clearStory: state => {
      state.Main = [];
      state.Sub = [];
    },
    clearStorySub: state => {
      state.Sub = [];
    }
  }
});

export const {
  pushStory,
  pushStorySub,
  deleteStory,
  toggleLikeStory,
  clearStory,
  clearStorySub
} = StorySlice.actions;
export default StorySlice.reducer;

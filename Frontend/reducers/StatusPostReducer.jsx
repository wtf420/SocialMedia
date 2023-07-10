import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  HomePage: [],
  sub: []
}

const StatusPostSlice = createSlice({
  name: "StatusPost",
  initialState,
  reducers: {
    pushStatusPosts: (state, action) => {
      state.HomePage.push(action.payload)
    },
    pushStatusPostsSub: (state, action) => {
      const index = state.sub.findIndex(item => item._id === action.payload._id)
      if (index === -1) state.sub.push(action.payload)
    },
    updateAStatusPost: (state, action) => {
      const status = state.HomePage.find(
        item => item._id === action.payload._id
      )
      if (status) {
        status.description = action.payload.description
        status.isLiked = action.payload.isLiked
        status.likeCount = action.payload.likeCount
        status.commentCount = action.payload.commentCount
      } else {
        const statusSub = state.sub.find(
          item => item._id === action.payload._id
        )
        if (statusSub) {
          statusSub.description = action.payload.description
          statusSub.isLiked = action.payload.isLiked
          statusSub.likeCount = action.payload.likeCount
          statusSub.commentCount = action.payload.commentCount
        }
        console.log(statusSub)
      }
    },
    deleteAStatusPost: (state, action) => {
      const index = state.HomePage.findIndex(
        item => item._id === action.payload
      )
      state.HomePage.splice(index, 1)
      const indexSub = state.sub.findIndex(item => item._id === action.payload)
      state.sub.splice(indexSub, 1)
    },
    clearStatusPosts: state => {
      state.HomePage = []
      console.log("clear")
    },
    clearStatusPostsSub: state => {
      state.sub = []
    },
    toogleLike: (state, action) => {
      const status = state.HomePage.find(item => item._id == action.payload)
      if (status) {
        status.isLiked = !status.isLiked
        if (status.isLiked) {
          status.likeCount++
        } else {
          status.likeCount--
        }
      } else {
        const statusSub = state.sub.find(item => item._id === action.payload)
        if (statusSub) {
          statusSub.isLiked = !statusSub.isLiked
          if (statusSub.isLiked) {
            statusSub.likeCount++
          } else {
            statusSub.likeCount--
          }
        }
      }
    },
    imcrementComment: (state, action) => {
      state.HomePage.filter(item => {
        if (item._id === action.payload) {
          item.commentCount++
          return
        }
      })
      state.sub.filter(item => {
        if (item._id === action.payload) {
          item.commentCount++
        }
      })
    },
    decrementComment: (state, action) => {
      state.HomePage.filter(item => {
        if (item._id === action.payload) {
          item.commentCount--
          return
        }
      })
      state.sub.filter(item => {
        if (item._id === action.payload) {
          item.commentCount--
        }
      })
    }
  }
})

export const {
  pushStatusPosts,
  pushStatusPostsSub,
  updateAStatusPost,
  deleteAStatusPost,
  clearStatusPosts,
  clearStatusPostsSub,
  toogleLike,
  imcrementComment,
  decrementComment
} = StatusPostSlice.actions
export default StatusPostSlice.reducer

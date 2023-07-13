import ApiManager from "./ApiManager"

export default {
  getAllChatRooms: function(userId, token) {
    return ApiManager(`${userId}/chatroom`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  getMessagesFromAChatRoom: function(token, chatRoomId) {
    return ApiManager(`/chatroom/${chatRoomId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

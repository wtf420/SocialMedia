import ApiManager from "./ApiManager";

export const getAllNotifications = async (userId, token) => {
  try {
    const result = await ApiManager(`/${userId}/notification`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    });
    return result;
  } catch (error) {
    return error;
  }
};

export const readNotification = async (userId, token) => {
  try {
    const result = await ApiManager(`/${userId}/notification`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token
      }
    });
    return result;
  } catch (error) {
    return error;
  }
};

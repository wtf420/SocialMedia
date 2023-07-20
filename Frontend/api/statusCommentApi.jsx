import ApiManager from "./ApiManager";
const { v4: uuidv4 } = require("uuid");

export const getAllComments = async (statusPostId, token) => {
    try {
        const result = await ApiManager(`/s/${statusPostId}/comment`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return result;
    } catch (error) {
        return error;
    }
};

export const createComment = async (data, statusPostId, token) => {
    try {
        const { mediaFile, content, userId } = data;
        const dataForm = new FormData();

        if (mediaFile) {
            dataForm.append("media-file", {
                uri: mediaFile.uri,
                type: "image/jpg",
                name: uuidv4() + "_comment-file",
            });
        }

        dataForm.append("content", content);
        dataForm.append("userId", userId);
        const result = await ApiManager(`/s/${statusPostId}/comment`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
            data: dataForm,
        });
        return result;
    } catch (error) {
        return error;
    }
};

export const deleteComment = async (statusPostId, commentId, token) => {
    try {
        const result = await ApiManager(
            `/s/${statusPostId}/comment/${commentId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return result;
    } catch (error) {
        return error;
    }
};

export const toggleLikeCommentApi = async (statusPostId, commentId, token) => {
    try {
        const result = await ApiManager(
            `/s/${statusPostId}/comment/${commentId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return result;
    } catch (error) {
        return error;
    }
};

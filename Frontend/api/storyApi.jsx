import ApiManager from "./ApiManager";

export const getStoryById = async (storyId, token) => {
    try {
        const result = await ApiManager(`/story/${storyId}`, {
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

export const getAllStory = async (userId, token) => {
    try {
        const result = await ApiManager(`/${userId}/story`, {
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

export const getStoryFeed = async (userId, token) => {
    try {
        const result = await ApiManager(`/${userId}/story-feed`, {
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

export const createStory = async (data, userId, token) => {
    try {
        console.log("create Story api:");
        console.log(data);
        const result = await ApiManager(`/${userId}/story`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error;
    }
};

export const likeStory = async (authorId, storyId, token) => {
    try {
        const result = await ApiManager(`/${authorId}/story/${storyId}`, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return result;
    } catch (error) {
        return error;
    }
};

export const deleteStoryApi = async (authorId, storyId, token) => {
    try {
        const result = await ApiManager(`/${authorId}/story/${storyId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return result;
    } catch (error) {
        return error;
    }
};

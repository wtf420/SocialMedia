import ApiManager from "./ApiManager";

export const getAStatusPostById = async (token, statusPost) => {
    try {
        const result = await ApiManager(`/s/${statusPost}`, {
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

export const getAllStatusPostOfUser = async (userId, token) => {
    try {
        const result = await ApiManager(`/${userId}/post`, {
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

export const getNewsFeed = async (userId, token, pageNum) => {
    try {
        const result = await ApiManager(
            `/${userId}/news-feed?page=${pageNum}`,
            {
                method: "GET",
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

export const createNewPost = async (dataForm, userId, token) => {
    try {
        const result = await ApiManager(`/${userId}/post`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
            data: dataForm,
            maxContentLength: Infinity, // Allow large file uploads
            maxBodyLength: Infinity,
        });

        console.log("result here");
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const updateStatusPostApi = async (data, userId, token, statusPost) => {
    try {
        const result = await ApiManager(`/${userId}/post/${statusPost}`, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token,
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error;
    }
};

export const deleteAStatusPostApi = async (userId, token, statusPost) => {
    try {
        const result = await ApiManager(`/${userId}/post/${statusPost}`, {
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

export const toggleLikeStatusApi = async (userId, token, statusPost) => {
    try {
        const result = await ApiManager(`/${userId}/post/${statusPost}`, {
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

import axios from "axios";

const baseURL = "http://192.168.1.6:3000";

const ApiManager = axios.create({
    baseURL: baseURL,
    responseType: "json",
    withCredentials: true,
    validateStatus: (status) => true,
});

export default ApiManager;

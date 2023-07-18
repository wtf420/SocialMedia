import axios from "axios";

const baseURL = "http://192.168.137.1:3000";

const ApiManager = axios.create({
    baseURL: baseURL,
    responseType: "json",
    withCredentials: true,
    validateStatus: (status) => true,
});

export default ApiManager;

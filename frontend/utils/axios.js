import axios from "axios";

const apiInstance = axios.create({
    baseURL: "http://192.168.0.2:8000/api/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default apiInstance
import axios from "axios"
import { API_BASE_URL } from "../config/env"

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Content-Type" : "application/json"
    }
});

//response interceptor(company style)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:",error?.response || error);
        return Promise.reject(error?.response || error)
    }
)

export default axiosInstance;
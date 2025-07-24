import axios from 'axios';

//for send the cookie to all request
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? 'http://localhost:5001/api' : "/api",
    withCredentials: true,
})
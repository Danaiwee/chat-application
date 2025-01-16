import axios from 'axios';

//for send the cookie to all request
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
})
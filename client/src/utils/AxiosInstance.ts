import axios from "axios";

const isInProduction = process.env.NODE_ENV === 'production' || false;

const axiosInstance = axios.create({
    baseURL: isInProduction ? 'https://online-store-backend-zeta.vercel.app' : 'http://localhost:8888',
    withCredentials: true
})

export default axiosInstance;
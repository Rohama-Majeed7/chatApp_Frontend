import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://chat-app-backend-acio.vercel.app",
  withCredentials: true, // This is important for sending cookies
});

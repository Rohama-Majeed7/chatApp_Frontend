import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://chat-app-backend-w9hd.vercel.app/api",
  withCredentials: true, // This is important for sending cookies
});

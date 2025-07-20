import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
const { token } = useAuthStore();
export const axiosInstance = axios.create({
  baseURL: "https://chat-app-backend-w9hd.vercel.app/api",
  headers: {
    Authorization: `Bearer ${token}`, // <- replace with your actual token
  },
});

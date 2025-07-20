import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
const AxiosComp = async () => {
  const { token } = useAuthStore();
  if (token) {
    return axios.create({
      baseURL: "https://chat-app-backend-w9hd.vercel.app/api",
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });
  } else {
    return axios.create({
      baseURL: "https://chat-app-backend-w9hd.vercel.app/api",
    });
  }
};

export const axiosInstance = AxiosComp();

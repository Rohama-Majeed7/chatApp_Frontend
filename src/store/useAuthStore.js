import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = "https://chat-app-backend-w9hd.vercel.app";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignIngUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  token: null,
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSignIngUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data, {
        headers: {
          Authorization: `Bearer ${get().token}`, // <- replace with your actual token
        },
      });
      set({ authUser: res.data });
      set({ token: res.data.token });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      set({ isSignIngUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data, {
        headers: {
          Authorization: `Bearer ${get().token}`, // <- replace with your actual token
        },
      });
      set({ authUser: res.data });
      set({ token: res.data.token });
      toast.success(res.data.message || "Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log in");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      set({ token: null });
      toast.success(res.data.message || "Logged out successfully");
      get().disConnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log out");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          Authorization: `Bearer ${get().token}`, // <- replace with your actual token
        },
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (usersIds) => {
      set({ onlineUsers: usersIds });
    });
  },
  disConnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));

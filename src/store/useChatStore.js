import { create } from "zustand";
import  {axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  value: 0,
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users",{});
      set({ users: response.data.users, isUserLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      console.log("Fetched messages:", response.data.messages);
      set({ messages: response.data.messages, isMessagesLoading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    try {
      const { selectedUser, messages, value } = get();
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ value: value + 1 });
      set({
        messages: [...messages, response.data.newMessage],
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
  deleteFromEveryOneMessage: async (messageId) => {
    const { value } = useAuthStore.getState();
    try {
      const response = await axiosInstance.delete(
        `/messages/deleteMessageFromEveryOne/${messageId}`
      );
      if (response.data.success) {
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
        set({ value: value + 1 });
        toast.success(response.data.message || "Message deleted successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete message");
      console.error("Error deleting message:", error);
    }
  },
  subscribeToNewMessages: () => {
    const { selectedUser, value } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (message) => {
      if (
        message.receiverId === selectedUser._id ||
        message.senderId === selectedUser._id
      ) {
        set((state) => ({
          messages: [...state.messages, message],
          value: state.value + 1,
        }));
      }
    });
    socket.on(
      "messageDeletedForEveryone",
      ({ messageId, senderId, receiverId }) => {
        const { selectedUser } = get();
        const isChatRelevant =
          selectedUser &&
          (selectedUser._id === senderId || selectedUser._id === receiverId);

        if (isChatRelevant) {
          set((state) => ({
            messages: state.messages.filter((msg) => msg._id !== messageId),
          }));
        }
      }
    );
  },
  unSubscribeFromNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeletedForEveryone");
  },
  setSelectedUser: (user) => set({ selectedUser: user }),
}));

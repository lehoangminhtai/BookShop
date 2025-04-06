import { create } from "zustand";
import { toast } from "react-toastify";

import { io } from 'socket.io-client';


//service
import { getUsersForSidebar, getMessages, sendMessage } from "../services/exchange/chatService";

export const useChatStore = create((set, get) => ({

    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],
    socket: null,


    connectSocket: (user) => {
        if (!user || get().socket?.connected) return;

        const socket = io('http://localhost:4000', {
            query: { userId: user._id },
        });

        socket.connect();

        set({ socket, currentUser: user });

        // Nhận danh sách user online
        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds });
        });

        // Nhận tin nhắn từ server
        socket.on('receiveMessage', (message) => {
            set((state) => ({
                messages: [...state.messages, message],
            }));
        });
    },

    getUsers: async (user) => {
        set({ isUsersLoading: true });
        try {
            const res = await getUsersForSidebar(user._id);
            console.log(res);
            if (res.success) {
                set({ users: res.data });

            }
        } catch (error) {
            set({ users: [] });
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (user, receiverId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await getMessages(user._id, receiverId);
            set({ messages: res.data });
        } catch (error) {
            set({ messages: [] });
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (user, messageData) => {
        const { selectedUser, messages } = get();
        console.log(selectedUser._id, messageData)
        try {
            const res = await sendMessage(user._id, selectedUser._id, messageData);
           set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = get().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = get().socket;
        socket.off("newMessage");
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) socket.disconnect();
        set({ socket: null, messages: [], onlineUsers: [] });
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
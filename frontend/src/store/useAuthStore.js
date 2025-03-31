import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4000"

export const useAuthStore = create((set, get) => ({
   
    onlineUsers: [],
    socket: null,

    checkAuth: async (user) => {
        try {
            if (user) {
                get().connectSocket(user);
            }

        } catch (error) {
            console.log("Error in checkAuth:", error);

        } finally {

        }
    },



    logout: async () => {
        try {
            get().disconnectSocket();
        } catch (error) {

        }
    },


    connectSocket: (user) => {
        if (!user || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: user._id,
            },
        });

        socket.connect();

        set({ socket: socket });
        

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
        
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/messages` });

export const getUsersForSidebar = async (userId) => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    throw error;
  }
}

export const getMessages = async (senderId, receiverId) => {
  try {
    const response = await API.get(`/${senderId}/${receiverId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export const sendMessage = async (senderId, receiverId, messageData) => {
  try {
    const response = await API.post(`/send/${senderId}/${receiverId}`, messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
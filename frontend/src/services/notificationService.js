import axios from "axios";
import { serverUrl } from "./config"

const API = axios.create({ baseURL: `${serverUrl}/api/notifications`})

export const getNotifications = async (userId) => {
  const res = await API.get(`/${userId}`);
  return res;
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await API.patch(`/read/${notificationId}`);
  return res;
};

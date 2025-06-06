import axios from "axios";
import { serverUrl } from "./config";

const API = axios.create({ baseURL: `${serverUrl}/api/wishlist` });

export const getWishlistSer = async (userId) => {
  try {
    const response = await API.get(`/get-wishlist/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
}
export const addToWishlistSer = async (userId, bookId) => {
  try {
    console.log("Adding to wishlist:", { userId, bookId });
    const response = await API.post('/add-to-wishlist', { userId, bookId });
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}
export const removeFromWishlistSer = async (userId, bookId) => {
  try {
    const response = await API.post('/remove-from-wishlist', { userId, bookId });
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}
export const deleteWishlist = async (userId) => {
  try {
    const response = await API.delete(`/delete-wishlist/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    throw error;
  }
}


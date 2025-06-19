import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/interaction` });

export const clickInteractionSer = async (userId, bookId) => {
    try {
        const response = await API.post('/book-click', { userId, bookId });
        return response.data;
    } catch (error) {
        console.error("Error handling book click:", error);
        throw error;
    }
}
export const updateInteractionSer = async (userId, bookId,data) => {
    try {
        const response = await API.patch(`/update/${userId}/${bookId}`, { data });
        return response.data;
    } catch (error) {
        console.error("Error handling book click:", error);
        throw error;
    }
}
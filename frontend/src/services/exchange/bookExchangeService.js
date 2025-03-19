import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/book-exchange` });

export const getBookExchanges = async (page, limit) => {
    try {
        const res = await API.get(`/?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.message
        };
    }
}

export const getBookExchangeSer = async (bookExchangeId) => await API.get(`/${bookExchangeId}`);

export const createBookExchange = async (bookData) => await API.post('/', bookData);

export const updateBookExchange = async (id, bookData) => await API.put(`/${id}`, bookData);

export const deleteBookExchange = async (id) => await API.delete(`/${id}`);

export const getBookExchangesByUser = async (userId) => await API.get(`/user/${userId}`);

export const getBookExchangesAvailableByUser = async (userId, categoryId) => {
    let url = `/user/get-posts-available/${userId}`;
    if (categoryId) url += `?categoryId=${categoryId}`; 
    return await API.get(url);
};

export const getBookExchangesByCategory = async (category) => await API.get(`/category/${category}`);
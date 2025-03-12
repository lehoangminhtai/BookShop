import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:4000/api/logs' });

export const getLogs = async (page = 1, limit = 10) => {
    try {
        const response = await API.get(`/?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response.data;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
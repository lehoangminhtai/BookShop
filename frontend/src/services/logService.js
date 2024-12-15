import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:4000/api/logs' });

export const getLogs = async () => {
    try {
        const response = await API.get('/');
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response.data;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
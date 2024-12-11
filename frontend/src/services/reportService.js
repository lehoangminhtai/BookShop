import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:4000/api/reports' });

export const getReportToday = async () => {
    try {
        const response = await API.get('/report-today');
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};

export const getRevenueWeek = async () => {
    try {
        const response = await API.get('/revenue-week');
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const getUsersWeek = async () => {
    try {
        const response = await API.get('/users-week');
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
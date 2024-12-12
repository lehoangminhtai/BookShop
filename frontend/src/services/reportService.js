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
export const getReport = async (dateData) => {
    try {
        const response = await API.get('/report',{
            params:{startDate:dateData.startDate,endDate:dateData.endDate}
        });
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
export const getOrdersWeek = async () => {
    try {
        const response = await API.get('/orders-week');
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};

export const getTopBooks = async (dateData) => {
    try {

        const response = await API.get('/top-books',{
            params:{startOfMonth: dateData.startOfMonth, endOfMonth: dateData.endOfMonth}
        });
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};

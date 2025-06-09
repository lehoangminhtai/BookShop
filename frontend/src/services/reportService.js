import axios from "axios";
//service
import { serverUrl } from "./config";

const API = axios.create({ baseURL: `${serverUrl}/api/reports` });

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
export const getTopCustomers = async (dateData) => {
    try {
       
        const response = await API.get('/top-customers',{
            params:{startOfYear: dateData.startOfYear, endOfYear: dateData.endOfYear}
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

export const getRevenueDetail = async (data) => {
    try {
        const response = await API.post('/revenue-detail', data);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
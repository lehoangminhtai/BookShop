import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/discounts' })

export const createDiscount = async (discountData) => {
    try {
        const response = await API.post('/create', discountData);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const updateDiscount = async (discountId,discountData) => {
    try {
        const response = await API.put(`/${discountId}`, discountData);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const deleteDiscount = async (discountId) => {
    try {
        const response = await API.delete(`/${discountId}`);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const getAllDiscount = async () => await API.get('/')
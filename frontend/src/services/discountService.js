import axios from "axios"
import Cookie from 'js-cookie'
//service
import { serverUrl } from "./config"

const API = axios.create({ baseURL: `${serverUrl}/api/discounts` })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

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
export const getAllDiscount = async (keyword = '') => await API.get(`/?keyword=${keyword}`);

export const getDiscountForUser = async (dataDiscount) => {
    try {
        const response = await API.post(`/for-user`,dataDiscount);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const searchDiscountForUser = async (dataDiscount) => {
    try {
        const response = await API.post(`/search`,dataDiscount);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
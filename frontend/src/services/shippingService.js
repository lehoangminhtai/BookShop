import axios from "axios"
import Cookie from 'js-cookie'

const API = axios.create({ baseURL: 'http://localhost:4000/api/shippings' })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const getShippingFeeByProvinceId = async (provinceId) => await API.get(`/${provinceId}`)

export const getAllShipping = async () => await API.get('/')

export const createShipping = async (shippingData) => {
    try {
        const response = await API.post('/create', shippingData);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
}

export const addProvinceToShipping = async (shippingData) => {
    try {
        const response = await API.post('/add-province', shippingData);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
}

export const updateProvinceShipping = async (shippingData) => {
    try {
        const response = await API.put('/update-province', shippingData);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
}
export const updateShipping = async (shippingId,shippingData) => {
    try {
        const response = await API.put(`/update-shipping/${shippingId}`, shippingData);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
}
export const deleteShipping = async (shippingId) => {
    try {
        const response = await API.delete(`/delete-shipping/${shippingId}`);
        return response;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
}
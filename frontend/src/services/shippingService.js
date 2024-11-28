import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/shippings' })

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
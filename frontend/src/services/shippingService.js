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
import axios from "axios";
import { serverUrl } from "./config";

const API = axios.create({ baseURL: `${serverUrl}/api/user/addresses`});

export const addAddressForUser = async (userId,dataAddress) => {
    try {
        const response = await API.post(`/${userId}`,dataAddress);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response.data;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const getAddressForUser = async (userId) => {
    try {
        const response = await API.get(`/${userId}`);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response.data;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const updateAddressForUser = async (params,dataAddress) => {
    const {userId, addressId} = params
    try {
        const response = await API.put(`/${userId}/${addressId}`,dataAddress);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response.data;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};

export const deleteAddressForUser = async (addressData) => {
    const {userId, addressId} = addressData
    try {
        const response = await API.delete(`/${userId}/${addressId}`);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response.data;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
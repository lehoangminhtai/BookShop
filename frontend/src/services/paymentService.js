import axios from "axios"
//service
import { serverUrl } from "./config"

const API = axios.create({ baseURL: `${serverUrl}/api/payments`})

export const getAllPayments = async (queryParams = "") => {
    try {
        const res = await API.get(`/?${queryParams}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.message
        };
    }
}

export const getPaymentByTransactionId = async (transactionId) => await API.get(`/${transactionId}`)

export const getPaymentByOrderId = async (orderId) => await API.get(`/order/${orderId}`)
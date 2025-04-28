import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/payments' })

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
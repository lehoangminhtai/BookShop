import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/payments' })

export const getAllPayments = async (page = 1, limit = 10) => 
    await API.get(`/?page=${page}&limit=${limit}`);

export const getPaymentByTransactionId = async (transactionId) => await API.get(`/${transactionId}`)

export const getPaymentByOrderId = async (orderId) => await API.get(`/order/${orderId}`)
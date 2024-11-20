import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/payments' })

export const getAllPayments = async () => await API.get('/')

export const getPaymentByOrderId = async (orderId) => await API.get(`/order/${orderId}`)
import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/orders' })

export const createOrder = async (orderData) => await API.post('/',orderData)

export const getOrderByOrderId = async(orderId) => await API.get(`/${orderId}`)
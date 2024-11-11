import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/orders' })

export const createOrder = async (orderData) => await API.post('/',orderData)
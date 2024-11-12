import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/zalopay' })

export const createZaloPay =async (zaloPayData) =>await API.post('/payment',zaloPayData)
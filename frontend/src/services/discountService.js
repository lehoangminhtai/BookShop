import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/discounts' })

export const createDiscount = async (discountData) => await API.post('/create',discountData)

export const getAllDiscount = async () => await API.get('/')
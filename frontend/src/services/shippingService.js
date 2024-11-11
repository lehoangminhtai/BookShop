import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/shipping' })

export const getShippingFeeByProvinceId = async (provinceId) => await API.get(`/${provinceId}`) 
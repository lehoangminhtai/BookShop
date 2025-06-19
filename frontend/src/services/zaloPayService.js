import axios from "axios"
//service
import { serverUrl } from "./config"

const API = axios.create({ baseURL: `${serverUrl}/api/zalopay`})

export const createZaloPay =async (zaloPayData) =>await API.post('/payment',zaloPayData)

export const refundZaloPay =async (data) =>await API.post('/refund',data)
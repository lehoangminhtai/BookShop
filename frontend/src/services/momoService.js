import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/momo' })

export const createMomoPay =async (momoData) =>await API.post('/payment',momoData)
import axios from "axios"

import { serverUrl } from "./config"

const API = axios.create({ baseURL: `${serverUrl}/api/momo`})

export const createMomoPay =async (momoData) =>await API.post('/payment',momoData)
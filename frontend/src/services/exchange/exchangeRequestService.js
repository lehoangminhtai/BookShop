import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/exchange-requests` });

export const createRequestSer = async (data) => API.post('/',data)

export const getRequestsByRequesterSer = async (userId) => API.get(`/requests/${userId}`)
import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/exchange-requests` });

export const createRequestSer = async (data) => API.post('/',data)

export const checkRequestSer = async (data) => API.post('/check-exchange-request',data)

export const deleteRequestSer = async (bookRequestedId) => API.delete(`/delete/${bookRequestedId}`)
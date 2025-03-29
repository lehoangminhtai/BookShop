import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/exchange-requests` });

export const createRequestSer = async (data) => await API.post('/',data)

export const checkRequestSer = async (data) =>await API.post('/check-exchange-request',data)

export const deleteRequestSer = async (bookRequestedId) => await API.delete(`/delete/${bookRequestedId}`)

export const getExchangeRequestByBookRequested = async (bookRequestedId) => await API.get(`/get-requests/${bookRequestedId}`);

export const acceptExchangeRequest = async (data) => await API.post(`/accept`,data)

export const getRequestsByRequesterSer = async (userId) => API.get(`/requests/${userId}`)

export const cancelExchangeRequest = async (requestId) => API.post(`/cancel/${requestId}`)
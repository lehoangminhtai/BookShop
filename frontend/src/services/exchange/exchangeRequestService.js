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

export const getRequestByRequestId = async (requestId) => API.get(`/request/${requestId}`) 

export const getExchangeRequestsByOwnerBook = async (userId) => API.get(`/requests/owner/${userId}`)

export const getExchangeRequestsByUserId = async (userId) => API.get(`/requests/user/${userId}`)

export const completeExchangeRequest = async (data) => API.post(`/complete`,data)


export const getExchangeRequests = async (queryParams = "") => {
    try {
        const res = await API.get(`/requests/?${queryParams}`);
        return res;
    } catch (error) {
        return { success: false, message: error.message
        };
    }
}
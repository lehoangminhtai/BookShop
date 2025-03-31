import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/exchange-infor` });


export const createExchangeInforSer = async (data) => await API.post('/',data)

export const getExchangeInforSer = async (requestId) =>{
    try {
        const res = await API.get(`/${requestId}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching exchange information:', error);
        throw error;
    }
}

export const updateExchangeInforSer = async (data) => await API.put(`/update/${data.requestId}`,data)
     
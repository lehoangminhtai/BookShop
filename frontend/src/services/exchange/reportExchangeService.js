import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/report_exchange` });

export const createReportSer = async (data) => await API.post('/send', data);


export const getReportSer = async (queryParams = "") => {
    try {
        const res = await API.get(`/?${queryParams}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.message
        };
    }
}
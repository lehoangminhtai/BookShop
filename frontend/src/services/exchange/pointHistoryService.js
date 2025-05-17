import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/point-history` });


export const getPointHistoryByUserSer = async (userId, type) => {
    let url = `/${userId}`;
    if(type) url += `?type=${type}`;
    return await API.get(url);
};
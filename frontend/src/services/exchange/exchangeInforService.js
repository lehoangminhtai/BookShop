import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/exchange-infor` });


export const createExchangeInforSer = async (data) => await API.post('/',data)
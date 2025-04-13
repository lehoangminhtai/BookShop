import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/report_exchange` });

export const createReportSer = async (data) => await API.post('/send', data);
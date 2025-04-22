import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/summarize` });

export const getSummarizeSer = async (data) => await API.post('/', data)
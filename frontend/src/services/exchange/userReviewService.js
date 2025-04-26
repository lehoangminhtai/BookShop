import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/user-reviews` });

export const createUserReview = async (data) => await API.post('/', data);

export const checkIfRequestIdExists = async (requestId) => await API.get(`/checkRequestId/${requestId}`);

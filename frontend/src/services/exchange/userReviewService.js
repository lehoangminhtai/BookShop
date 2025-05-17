import axios from "axios";
import { serverUrl } from "../config";

const API = axios.create({ baseURL: `${serverUrl}/api/user-reviews` });

export const createUserReview = async (data) => await API.post('/', data);

export const checkIfRequestIdExists = async (requestId, userId) => await API.get(`/checkRequestId/${requestId}/${userId}`);

export const getReviewsByReviewedUser = async (reviewedUserId) => await API.get(`/getReviewsByReviewedUser/${reviewedUserId}`);
import axios from "axios";
//service
import { serverUrl } from "./config";

const API = axios.create({ baseURL: `${serverUrl}/api/reviews` });

export const createReview = async (reviewData) => await API.post('/', reviewData);

export const getReviewsByBook = async (bookId) => await API.get(`/${bookId}`);

export const deleteReview = async (reviewId) => await API.delete(`/${reviewId}`);
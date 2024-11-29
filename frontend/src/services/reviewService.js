import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:4000/api/reviews' });

export const createReview = async (reviewData) => await API.post('/', reviewData);

export const getReviewsByBook = async (bookId) => await API.get(`/${bookId}`);

export const deleteReview = async (reviewId) => await API.delete(`/${reviewId}`);
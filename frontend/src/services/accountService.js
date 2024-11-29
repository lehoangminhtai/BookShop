import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:4000/api/account' });

export const getAllUsers = async () => await API.get('/');

export const updateUser = async (id, userData) => await API.put(`/${id}`, userData);

export const deleteUser = async (id) => await API.delete(`/${id}`);
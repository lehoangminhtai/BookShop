import axios from "axios";
import { serverUrl } from "./config";

const API = axios.create({ baseURL: `${serverUrl}/api/account` });

export const getAllUsers = async () => await API.get('/');

export const getUser = async (userId) => await API.get(`/user/${userId}`);

export const updateUser = async (id, userData) => await API.put(`/${id}`, userData);

export const deleteUser = async (id) => await API.delete(`/${id}`);
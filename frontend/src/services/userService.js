import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/admin/users' })

export const getAllUsers = async () => await API.get('/get-all-users')

export const createUser = async (userData) =>
    {
        try {
            const response =  await API.post('/create-user', userData)
            return response.data;
        } catch (error) {
    
            if (error.response) {
    
                return error.response;
            } else {
    
                return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
            }
        }
    };
export const updateUser = async (userId,userData) =>
    {
        try {
            const response =  await API.put(`/${userId}`, userData)
            return response.data;
        } catch (error) {
    
            if (error.response) {
    
                return error.response;
            } else {
    
                return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
            }
        }
    };
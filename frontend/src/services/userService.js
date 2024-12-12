import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/admin/users' })

export const getAllUsers = async () => await API.get('/get-all-users')

export const searchUser = async (query) =>
    {
        try {
            const response =  await API.get('/search-user',{
                params:{query: query}
            })
            return response.data;
        } catch (error) {
    
            if (error.response) {
    
                return error.response;
            } else {
    
                return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
            }
        }
    };
export const filterUser = async (userData) =>
    {
        try {
            const response =  await API.post('/filter-users', userData)
            return response.data;
        } catch (error) {
    
            if (error.response) {
    
                return error.response;
            } else {
    
                return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
            }
        }
    };
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
            const response =  await API.put(`/update-user/${userId}`, userData)
            return response.data;
        } catch (error) {
    
            if (error.response) {
    
                return error.response;
            } else {
    
                return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
            }
        }
    };
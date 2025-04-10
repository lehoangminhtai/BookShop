import axios from "axios"
import Cookie from 'js-cookie'
//service
import { serverUrl } from "./config"

const API = axios.create({ baseURL: `${serverUrl}/api/admin/users` })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const getAllUsers = async (page = 1, limit = 10) => 
    await API.get(`/get-all-users?page=${page}&limit=${limit}`);

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

export const getUserInfo = async (userId) => await API.get(`/get-user/${userId}`)
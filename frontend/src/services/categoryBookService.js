import axios from "axios"
import Cookie from 'js-cookie'

const API = axios.create({ baseURL: 'http://localhost:4000/api/categoryBooks' })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const getCategoryBooks = async () => await API.get('/count-book')

export const getTopCategoryBooks = async () =>{
   
    try {
        const response =   await API.get('/get-top-category')

        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
} 
export const createCategoryBook = async (categoryBookData) =>{
   
    try {
        const response =  await API.post('/',categoryBookData);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
} 
export const updateCategoryBook = async (categoryId, categoryBookData) =>{
   
    try {
        const response =  await API.put(`/${categoryId}`,categoryBookData);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
} 
export const deleteCategoryBook = async (categoryId) =>{
   
    try {
        const response =  await API.delete(`/${categoryId}`);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
} 

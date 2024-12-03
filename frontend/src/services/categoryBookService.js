import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/categoryBooks' })

export const getCategoryBooks = async () => await API.get('/count-book')

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

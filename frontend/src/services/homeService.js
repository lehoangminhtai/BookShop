import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api' })

export const getTopCategoryBooks = async () =>{
   
    try {
        const response =   await API.get('/categoryBooks/get-top-category')

        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
} 

export const getBookSales = async () => await API.get('/bookSales/')
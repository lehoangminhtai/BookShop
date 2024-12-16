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

export const getLastBooks = async (data) =>{
   
    try {
        const response =   await API.get('/bookSales/last-books',{
            params:{page: data.page,limit: data.limit}
        })

        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
} 

export const getTopBooks = async (data) => {
    try {
       
        const response = await API.get('/bookSales/top-books',{
           params:{page:data.page, limit:data.limit}
        });
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const getBookSales = async (data) => {
    try {
       
        const response = await API.get('/bookSales/',{
            params:{page: data.page,limit: data.limit}})
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const searchBookSales = async (data) => {
    try {
       
        const response = await API.get('/bookSales/search-home',{
            params:{query: data.query, page: data.page}})
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const getBookSalesByCategory = async (data) => {
    try {
       
        const response = await API.get('/bookSales/books-category',{
            params:{categoryId: data.categoryId, page: data.page}})
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};

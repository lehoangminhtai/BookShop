import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/bookSales' })

export const getBookSales = async () => await API.get('/')

export const getBookSalesNotAvailable = async () => await API.get('/not-available')

export const getBookSalesAdmin = async () => await API.get('/admin')

export const getBookSaleByBookId = async (bookId) => API.get(`/${bookId}`)

export const searchBookSale = async (query) => {
    try {
        const response = await API.get(`/search`,{
            params: {title: query}
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

export const updateBookSale = async (id,data) => await API.patch(`/${id}`,data)
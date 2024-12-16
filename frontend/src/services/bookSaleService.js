import axios from "axios"
import Cookie from 'js-cookie'

const API = axios.create({ baseURL: 'http://localhost:4000/api/bookSales' })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const getBookSales = async () => await API.get('/')

export const getBookSale = async (bookId) => await API.get(`/${bookId}`)

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
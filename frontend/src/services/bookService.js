import axios from "axios"
import Cookie from 'js-cookie'

const API = axios.create({ baseURL: 'http://localhost:4000/api/books' })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const json = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }

    return json;
}

export const fetchBook = async (id) =>{
    const response = await fetch(`/api/books/${id}`);
    const json = await response.json();

    if(!response.ok){
        throw new Error('Failed to fetch book ',{})
    }

    return json;
}
export const searchBook = async (bookData) =>{
    try {
        const response = await API.get('/search',
        {
            params:{query: bookData.query, page: bookData.page, limit:bookData.limit}
        }
        );
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
}

export const createBook = async (bookData) => {
    try {
        const response = await API.post('/', bookData);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};
export const updateBook = async (bookId,bookData) => {
    try {
        const response = await API.put(`/${bookId}`, bookData);
        return response.data;
    } catch (error) {

        if (error.response) {

            return error.response;
        } else {

            return { success: false, message: 'Có lỗi xảy ra khi kết nối tới server.' };
        }
    }
};

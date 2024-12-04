import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/books' })

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

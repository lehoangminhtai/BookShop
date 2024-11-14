import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/categoryBooks' })

export const getCategoryBooks = async () => await API.get('/count-book')

export const createCategoryBook = async (categoryBookData) => await API.post('/',categoryBookData)

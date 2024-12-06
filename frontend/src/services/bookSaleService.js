import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/bookSales' })

export const getBookSales = async () => await API.get('/')

export const getBookSalesAdmin = async () => await API.get('/admin')

export const getBookSaleByBookId = async (bookId) => API.get(`/${bookId}`)

export const updateBookSale = async (id,data) => await API.patch(`/${id}`,data)
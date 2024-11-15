import axios from "axios"

const API = axios.create({ baseURL: 'http://localhost:4000/api/bookSales' })

export const getBookSales = async () => await API.get('/')
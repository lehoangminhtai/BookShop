import axios from "axios"
import Cookie from 'js-cookie'


const API = axios.create({ baseURL: 'http://localhost:4000/api/orders' })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const createOrder = async (orderData) => await API.post('/',orderData)

export const getOrderByOrderId = async(orderId) => await API.get(`/${orderId}`)

export const updateStatusOrder = async(orderId, statusOrder) => await API.put(`/${orderId}`,statusOrder)

export const getOrdersByUser = async (userId) => await API.get(`/user/${userId}`);
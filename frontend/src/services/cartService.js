import axios from "axios"
import Cookie from 'js-cookie'

const API = axios.create({ baseURL: 'http://localhost:4000/api/cart' })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const createCartSer = async (userId) => {
    const response = await API.post('/create', { userId });

    if (response.data.success === true) {
        console.log('Cart created successfully');
        console.log(response.data);
    }
};
export const addItemToCart = async (cartData) => await API.post('/add', cartData)

export const getCart = async (userId) => await API.get(`/${userId}`)

export const updateCartItem = async (cartData) => await API.put('/update', cartData);

export const removeItemFromCart = async (userId, bookId) => await API.delete(`/${userId}/remove/${bookId}`);

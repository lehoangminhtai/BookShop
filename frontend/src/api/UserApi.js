import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:4000' })


export const sendRegisterOTP = (email) => API.post('/api/admin/users/send-register-otp', { email })
export const register = (userData) => API.post('/api/admin/users/register', userData)       // {name, email, password, otp}

export const login = (userData) => API.put('/api/admin/users/login', userData)          // {email, password}
export const sendForgetPasswordOTP = (email) => API.post('/api/admin/users/send-forget-pass-otp', { email })
export const changePassword = (userData) => API.put('/api/admin/users/change-password', userData)
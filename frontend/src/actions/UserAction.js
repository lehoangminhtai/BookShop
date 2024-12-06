import * as api from "../api/UserApi"
import { createCartSer, addItemToCart } from "../services/cartService"
import { REGISTER, LOGIN, LOGOUT, SEND_OTP, CHANGE_PASSWORD, START_LOADING, END_LOADING } from "../constants/Auth"

const initialUserState = { name: '', email: '',phone:'', password: '', confirmPassword: '', registerOTP: '', forgetPasswordOTP: '' }
const initialErrorObj = { login: '', register: '', sendRegisterOTP: '', sendForgetPasswordOTP: '', changePassword: '' }



export const sendRegisterOTP = (email, setErrorObj, setPage) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await api.sendRegisterOTP(email)
        if (data.success) {
            dispatch({ type: SEND_OTP, payload: data })
            setErrorObj(initialErrorObj)
            setPage('register_otp')
        }
        else {
            setErrorObj({ ...initialErrorObj, sendRegisterOTP: data.message })
        }

        dispatch({ type: END_LOADING })
    } catch (error) {
        setErrorObj({ ...initialErrorObj, sendRegisterOTP: error.response.data.message })
        console.log("error in sendRegisterOTP - user.js actions", error.response.data.message)
        dispatch({ type: END_LOADING })
    }
}




export const register = (userData, navigate, setErrorObj, setUserFormData,redirectPath = '/') => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await api.register(userData)
        if (data.success) {
            dispatch({ type: REGISTER, payload: data })
            setErrorObj(initialErrorObj)
            createCartSer(data.result._id)
            handleAddItemToCart(data.result._id);
            navigate(redirectPath, { replace: true });
            setUserFormData(initialUserState)
            window.location.reload()
        }
        else {
            setErrorObj({ ...initialErrorObj, register: data.message })
        }

        dispatch({ type: END_LOADING })
    } catch (error) {
        setErrorObj({ ...initialErrorObj, register: error.response.data.message })
        console.log("error in register - user.js actions", error.response.data.message)
        console.log(userData)
        dispatch({ type: END_LOADING })
    }
}


export const login = (userData, navigate, setErrorObj, setUserFormData, redirectPath = '/') => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await api.login(userData);
        if (data.success) {
            dispatch({ type: LOGIN, payload: data });
            setErrorObj(initialErrorObj);
            setUserFormData(initialUserState);
            handleAddItemToCart(data.result._id);

            const userRole = data.result.role;

            // Kiểm tra role và điều hướng
            if (userRole === 1) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
            
            window.location.reload();
        } else {
            setErrorObj({ ...initialErrorObj, login: data.message });
        }

        dispatch({ type: END_LOADING });
    } catch (error) {
        setErrorObj({ ...initialErrorObj, login: error.response?.data?.message || "Error logging in" });
        console.log("error in login - user.js actions", error.response?.data?.message || error.message);
        dispatch({ type: END_LOADING });
    }
};


export const sendForgetPasswordOTP = (email, setPage, setErrorObj) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.sendForgetPasswordOTP(email)

        if (data.success) {
            dispatch({ type: SEND_OTP, payload: data })
            setErrorObj(initialErrorObj)
            setPage('forget_password_otp')
        }
        else {
            setErrorObj({ ...initialErrorObj, sendForgetPasswordOTP: data.message })
        }

        dispatch({ type: END_LOADING })
    } catch (error) {
        setErrorObj({ ...initialErrorObj, sendForgetPasswordOTP: error.response.data.message })
        console.log("error in sendForgetPasswordOTP - user.js actions", error.response.data.message)
        dispatch({ type: END_LOADING })
    }
}


export const changePassword = (userData, setPage, setErrorObj, setUserFormData) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await api.changePassword(userData)         //email, password, otp
        if (data.success) {
            dispatch({ type: CHANGE_PASSWORD, payload: data })
            setErrorObj(initialErrorObj)
            setPage('login')
            setUserFormData(initialUserState)
        }
        else {
            setErrorObj({ ...initialErrorObj, changePassword: data.message })
        }

        dispatch({ type: END_LOADING })
    } catch (error) {
        setErrorObj({ ...initialErrorObj, changePassword: error.response.data.message })
        console.log("error in changePassword - user.js actions", error.response.data.message)
        dispatch({ type: END_LOADING })
    }
}







export const logout = () => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        dispatch({ type: LOGOUT })

        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log("error in logout - user.js actions", error.response.data.message)
        dispatch({ type: END_LOADING })
    }
}

const handleAddItemToCart = async (userId) => {
   
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];

    
    localCart.forEach(localItem => {
       const itemData = {userId, bookId: localItem.id, quantity: localItem.quantity, price: localItem.price}
       console.log(itemData)
       addItemToCart(itemData);
    });
    localStorage.removeItem('cart');
}

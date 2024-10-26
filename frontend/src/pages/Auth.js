import { useStateContext } from '../context/UserContext'
import { CircularProgress } from '@mui/material'
import { Person, VisibilityOff, RemoveRedEye } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import { login, register, sendRegisterOTP, sendForgetPasswordOTP, changePassword } from '../actions/UserAction'
import { useDispatch, useSelector } from 'react-redux'
import validator from 'email-validator'
// import { motion } from 'framer-motion'
import Input from '../components/Input'
import { useNavigate } from 'react-router-dom'
import '../css/user/Auth.scss'
import React from 'react'

const loadTailwind = () => {
    const tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tailwindScript);
};

// Import Font Awesome
const loadFontAwesome = () => {
    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    document.head.appendChild(fontAwesomeLink);
};

const Auth = () => {
    const { user, page, setPage, initialErrorObj, errorObj, setErrorObj, userFormData, setUserFormData, initialUserState, validationMessage, setValidationMessage } = useStateContext()
    const { result, isLoading, isError, error } = useSelector(state => state.user)

    ////////////////////////////////////////////////////  Variables  ///////////////////////////////////////////////////////
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const registerValidated = validationMessage.name == '' && validationMessage.email == ''&& validationMessage.phone == '' && validationMessage.password == '' && validationMessage.confirmPassword == ''
    const loginValidated = validationMessage.email == '' && validationMessage.password == ''
    const changePasswordValidated = validationMessage.email == '' && validationMessage.password == ''


    ////////////////////////////////////////////////////   States   ///////////////////////////////////////////////////////

    ////////////////////////////////////////////////////   useEffect   ///////////////////////////////////////////////////////
    useEffect(() => {
        console.log('errorObj', errorObj)
    }, [errorObj])



    ////////////////////////////////////////////////////   Functions  ///////////////////////////////////////////////////////

    const handleLogin = () => {
        if (!loginValidated) return null                        // if email & password fields are empty then return null
        const { email, password } = userFormData
        const userData = { email, password }
        dispatch(login(userData, navigate, setErrorObj, setUserFormData))
    }
    const handleRegister = () => {
        if (!registerValidated) return null
        const { name, email,phone, password,address, registerOTP } = userFormData
        const userData = { name, email, phone, password,address, otp: registerOTP }
        
        dispatch(register(userData, navigate, setErrorObj, setUserFormData))
        console.log(errorObj.register)

    }
    const handleSendRegisterOTP = () => {
        if (!registerValidated) return null                 // if name || email || password || confirmPasswrd field is empty then return null
        const { email, password, confirmPassword } = userFormData
        if (password !== confirmPassword) {                 // password and confirmPassword should be same
            setErrorObj({ ...initialErrorObj, sendRegisterOTP: 'password and confirmPassword should be same' })
        }
        else {
            dispatch(sendRegisterOTP(email, setErrorObj, setPage))
        }
    }
    const handleSendForgetPasswordOTP = () => {
        const { email } = userFormData
        dispatch(sendForgetPasswordOTP(email, setPage, setErrorObj))
    }
    const handleChangePassword = () => {
        if (!changePasswordValidated) return null                 // if  email || password field is empty/unprovided then return null
        const { email, password, forgetPasswordOTP } = userFormData
        const userData = { email, password, otp: forgetPasswordOTP }
        dispatch(changePassword(userData, setPage, setErrorObj, setUserFormData))
    }




    const nameBlur = () => {
        if (userFormData.name == ``) {
            setValidationMessage({ ...validationMessage, name: 'Vui lòng nhập họ tên' })
        }
        else if (userFormData.name.length < 3) {
            setValidationMessage({ ...validationMessage, name: 'Tên ít nhất 3 ký tự' })
        }
        else {
            setValidationMessage({ ...validationMessage, name: '' })
        }
    }

    const emailBlur = () => {
        if (userFormData.email == ``) {
            setValidationMessage({ ...validationMessage, email: 'Vui lòng nhập email' })
        }
        else if (!(validator.validate(userFormData.email))) {
            setValidationMessage({ ...validationMessage, email: 'Vui lòng nhập email hợp lệ' })
        }
        else {
            setValidationMessage({ ...validationMessage, email: '' })
        }
    }
    const phoneBlur = () => {
        const phoneRegex = /^[0-9]{10,15}$/; // Quy tắc kiểm tra số điện thoại (10-15 số, tùy chỉnh theo yêu cầu)
        
        if (userFormData.phone === ``) {
            setValidationMessage({ ...validationMessage, phone: 'Vui lòng nhập số điện thoại' });
        } 
        else if (!phoneRegex.test(userFormData.phone)) {
            setValidationMessage({ ...validationMessage, phone: 'Vui lòng nhập số điện thoại hợp lệ' });
        } 
        else {
            setValidationMessage({ ...validationMessage, phone: '' });
        }
    };
    

    const passwordBlur = () => {
        if (userFormData.password == ``) {
            setValidationMessage({ ...validationMessage, password: 'Vui lòng nhập mật khẩu' })
        }
        else if (userFormData.password.length < 5) {
            setValidationMessage({ ...validationMessage, password: 'Mật khẩu ít nhất 8 ký tự' })
        }
        else {
            setValidationMessage({ ...validationMessage, password: '' })
        }
    }

    const confirmPasswordBlur = () => {
        if (userFormData.confirmPassword == ``) {
            setValidationMessage({ ...validationMessage, confirmPassword: 'confirmPassword field is required' })
        }
        else if (userFormData.confirmPassword.length < 5) {
            setValidationMessage({ ...validationMessage, confirmPassword: 'confirmPassword must be atleast of 5 character' })
        }
        else {
            setValidationMessage({ ...validationMessage, confirmPassword: '' })
        }
    }

    ////////////////////////////////////////////////////   Component   ///////////////////////////////////////////////////////

    React.useEffect(() => {
        loadTailwind();
        loadFontAwesome();
    }, []);

    return (
        <div className='auth-container'>

            {
                isLoading
                    ?
                    <CircularProgress className="w-[60px] h-[60px] text-orange " />
                    :
                    <>
                        {
                            user
                                ?
                                <div  className="flex flex-col justify-center items-center w-[22rem] min-h-[10rem] gap-[1rem] rounded-[4px] p-[1rem] " >
                                    <img src ={user?.image}/>
                                    <p className="" >User Account: {user?.fullName}</p>

                                </div>
                                :

                                <div style={{}} className="flex flex-col justify-center items-center w-[30rem] bg-lightGray gap-[1rem] rounded-[30px] p-[1rem] border-[1px] border-textGray " >


                                    {
                                        page == 'register' &&
                                        <div className="flex flex-col justify-between items-center gap-[1rem] w-full " >
                                            <h1 className="text-5xl">Đăng ký</h1>
                                           
                                            <div className="flex flex-col gap-[2rem]  w-full " >
                                                <Input
                                                    attribute="name"
                                                    type="text"
                                                    placeholder="Họ tên..."
                                                    blurFunction={nameBlur}
                
                                                />
                                            
                                                <Input
                                                    attribute="email"
                                                    type="email"
                                                    placeholder="Email..."
                                                    blurFunction={emailBlur}
                                                />
                                                 <Input
                                                    attribute="phone"
                                                    type="tel"
                                                    placeholder="Số điện thoại..."
                                                    blurFunction={phoneBlur}
                                                />
                                                 <Input
                                                    attribute="address"
                                                    type="text"
                                                    placeholder="Địa chỉ..."
                                                    

                                                />
                                                <Input
                                                    attribute="password"
                                                    type='password'
                                                    placeholder="Mật khẩu..."
                                                    blurFunction={passwordBlur}
                                                    showEyeIcon
                                                />
                                                <Input
                                                    attribute="confirmPassword"
                                                    type='password'
                                                    placeholder="Xác nhận mật khẩu..."
                                                    blurFunction={confirmPasswordBlur}
                                                    showEyeIcon
                                                />
                                            </div>
                                            <div className="flex flex-col items-center w-full gap-[2rem] " >
                                                {
                                                    page == 'register' &&
                                                    <div style={{ width: '100%' }} className="flex flex-col items-center gap-[8px] w-full " >
                                                        <button onClick={handleSendRegisterOTP} className=" " >Đăng ký</button>
                                                        <p className="" >Đã có tài khoản? <span onClick={() => setPage('login')} className="underline cursor-pointer text-linkBlue  " >Đăng nhập ngay</span> </p>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                errorObj.sendRegisterOTP &&
                                                <p className="text-red text-[14px] " >{errorObj.sendRegisterOTP}</p>
                                            }
                                        </div>
                                    }



                                    {
                                        page == 'register_otp'
                                        &&
                                        <div className="flex flex-col justify-start gap-[1rem] w-full " >
                                            <div className=" flex flex-col gap-[2rem] w-full  " >
                                                <p className="" >We have sent a verifiction code to email {userFormData.email}. Enter the code here</p>
                                                <Input
                                                    attribute="registerOTP"
                                                    type="text"
                                                    placeholder="Verification Code"
                                                />
                                            </div>
                                            <div className="flex flex-col items-center w-full gap-[2rem] " >
                                                <button onClick={handleRegister} className="capitalize w-full bg-orange p-[4px] rounded-[4px] " >submit</button>
                                            </div>
                                            <p onClick={() => setPage('register')} className="text-linkBlue cursor-pointer " >Wrong Email?</p>
                                            {
                                                errorObj.register &&
                                                <p className="text-red text-[14px] capitalize " >{errorObj.register}<span onClick={handleSendRegisterOTP} className="text-linkBlue cursor-pointer text-[16px] ml-[8px] " >Resend</span> </p>
                                            }
                                        </div>
                                    }


                                    {
                                        page == 'login' &&
                                        <div className="flex flex-col  justify-between items-center gap-[1rem] w-full " >
                                            <div className="flex justify-center items-center w-[5rem] h-[5rem] rounded-full bg-darkGray " >
                                                <Person style={{ fontSize: '4rem' }} className="text-[4rem] " />
                                            </div>
                                            <div className="flex flex-col gap-[2rem]  w-full " >

                                                <Input
                                                    attribute="email"
                                                    type="email"
                                                    placeholder="Email..."
                                                    blurFunction={emailBlur}
                                                />
                                                <Input
                                                    attribute="password"
                                                    type={'password'}
                                                    placeholder="Password..."
                                                    blurFunction={passwordBlur}
                                                    showEyeIcon
                                                />
                                                <p onClick={() => setPage('forget_password_email')} className="text-linkBlue cursor-pointer " >Forget Password?</p>

                                            </div>
                                            <div className="flex flex-col items-center w-full gap-[8px] " >
                                                <button onClick={handleLogin} className="w-full bg-orange p-[4px] rounded-[4px] " >Login</button>
                                                <p className="" >Don't have account. <span onClick={() => setPage('register')} className="underline cursor-pointer text-linkBlue  " >create account</span> </p>
                                            </div>
                                            {
                                                errorObj.login &&
                                                <p className="text-red text-[14px] " >{errorObj.login}</p>
                                            }
                                        </div>
                                    }




                                    {
                                        page == 'forget_password_email' &&
                                        <div className="flex flex-col justify-start gap-[1rem] w-full ">
                                            <div className=" flex flex-col gap-[2rem] w-full  " >
                                                <p className="" >Enter your registered email.</p>
                                                <Input
                                                    attribute="email"
                                                    type="email"
                                                    placeholder="Email..."
                                                    blurFunction={emailBlur}
                                                />

                                            </div>
                                            <div className="flex flex-col items-center w-full gap-[2rem] " >
                                                <button onClick={handleSendForgetPasswordOTP} className="capitalize w-full bg-orange p-[4px] rounded-[4px] " >submit</button>
                                            </div>
                                            <p onClick={() => setPage('login')} className="text-linkBlue cursor-pointer " >Go Back</p>
                                            {
                                                errorObj.sendForgetPasswordOTP &&
                                                <p className="text-red text-[14px] " >{errorObj.sendForgetPasswordOTP}</p>
                                            }
                                        </div>
                                    }
















                                    {
                                        page == 'forget_password_otp' &&
                                        <div className="flex flex-col justify-start gap-[1rem] w-full ">
                                            <div className=" flex flex-col gap-[2rem] w-full  " >
                                                <p className="" >We have sent a verifiction code to email {userFormData.email}. Enter the code here</p>
                                                <Input
                                                    attribute="forgetPasswordOTP"
                                                    type="text"
                                                    placeholder="Verification Code"
                                                />
                                                <Input
                                                    attribute="password"
                                                    type='password'
                                                    placeholder="New Password..."
                                                    blurFunction={passwordBlur}
                                                    showEyeIcon
                                                />
                                            </div>
                                            <div className="flex flex-col items-center w-full gap-[2rem] " >
                                                <button onClick={handleChangePassword} className="capitalize w-full bg-orange p-[4px] rounded-[4px] " >submit</button>
                                            </div>
                                            <p onClick={() => setPage('forget_password_email')} className="text-linkBlue cursor-pointer " >Wrong Email?</p>
                                            {
                                                errorObj.changePassword &&
                                                <p className="text-red text-[14px] capitalize " >{errorObj.changePassword}<span onClick={handleSendForgetPasswordOTP} className="text-linkBlue cursor-pointer text-[16px] ml-[8px] " >Resend</span> </p>
                                            }
                                        </div>
                                    }

                                </div>

                        }
                    </>
            }
        </div>

    )
}

export default Auth


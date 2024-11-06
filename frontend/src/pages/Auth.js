import { useStateContext } from '../context/UserContext'
import { CircularProgress } from '@mui/material'
import { Person, VisibilityOff, RemoveRedEye } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, sendRegisterOTP, sendForgetPasswordOTP, changePassword } from '../actions/UserAction'
import { useDispatch, useSelector } from 'react-redux'
import validator from 'email-validator'
// import { motion } from 'framer-motion'
import Input from '../components/Input'
import '../css/user/Auth.scss'
import React from 'react'


const Auth = () => {
  const { user, page, setPage, initialErrorObj, errorObj, setErrorObj, userFormData, setUserFormData, initialUserState, validationMessage, setValidationMessage } = useStateContext()
  const { result, isLoading, isError, error } = useSelector(state => state.user)



  ////////////////////////////////////////////////////  Variables  ///////////////////////////////////////////////////////
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const registerValidated = validationMessage.name == '' && validationMessage.email == '' && validationMessage.phone == '' && validationMessage.password == '' && validationMessage.confirmPassword == ''
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
    dispatch(login(userData, navigate, setErrorObj, setUserFormData, redirectPath))
  }
  const handleRegister = () => {
    if (!registerValidated) return null
    const { name, email, phone, password, address, registerOTP } = userFormData
    const userData = { name, email, phone, password, address, otp: registerOTP }

    dispatch(register(userData, navigate, setErrorObj, setUserFormData))
    console.log(errorObj.register)

  }
  const handleSendRegisterOTP = () => {
    if (!registerValidated) return null                 // if name || email || password || confirmPasswrd field is empty then return null
    const { email, password, confirmPassword } = userFormData
    if (password !== confirmPassword) {                 // password and confirmPassword should be same
      setErrorObj({ ...initialErrorObj, sendRegisterOTP: 'Mật khẩu xác nhận phải trùng khớp' })
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
    const password = userFormData.password;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (password === '') {
      setValidationMessage({ ...validationMessage, password: 'Vui lòng nhập mật khẩu' });
    }
    else if (!passwordPattern.test(password)) {
      setValidationMessage({
        ...validationMessage,
        password: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt'
      });
    }
    else {
      setValidationMessage({ ...validationMessage, password: '' });
    }
  }

  const confirmPasswordBlur = () => {
    const confirmPassword = userFormData.confirmPassword;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (confirmPassword === '') {
      setValidationMessage({ ...validationMessage, confirmPassword: 'Vui lòng xác nhận lại mật khẩu' });
    }
    else if (!passwordPattern.test(confirmPassword)) {
      setValidationMessage({
        ...validationMessage,
        confirmPassword: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt'
      });
    }
    else if (confirmPassword !== userFormData.password) {
      setValidationMessage({ ...validationMessage, confirmPassword: 'Mật khẩu xác nhận không khớp' });
    }
    else {
      setValidationMessage({ ...validationMessage, confirmPassword: '' });
    }
  }


  ////////////////////////////////////////////////////   Component   ///////////////////////////////////////////////////////


  return (
    <div className='auth-container'>
      {
        isLoading
          ?
          <CircularProgress className="tw-w-[60px] tw-h-[60px] tw-text-orange" />
          :
          <>
            {
              user
                ?
                <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-[22rem] tw-min-h-[10rem] tw-gap-[1rem] tw-rounded-[4px] tw-p-[1rem]">
                  <img src={user?.image} />
                  <p className="">User Account: {user?.fullName}</p>
                </div>
                :
                <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-[60rem] tw-bg-lightGray tw-gap-[1rem]  tw-p-[1rem] ">
                  {
                    page == 'register' &&
                    <div className="tw-w-full tw-max-w-md tw-p-6 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg tw-sm:p-8 tw-md:p-10 tw-dark:bg-gray-800 tw-dark:border-gray-700">
                      <div className="tw-space-y-8">
                        <h1 className="tw-text-4xl tw-font-semibold tw-text-gray-900 tw-dark:text-white">Đăng ký</h1>

                        {/* Họ tên */}
                        <div className="tw-relative">
                          <label htmlFor="name" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Họ tên</label>
                          <i className="fa fa-user tw-absolute tw-top-10 tw-right-3 tw-text-gray-400"></i>
                          <Input
                            attribute="name"
                            type="text"
                            placeholder="Họ tên..."
                            blurFunction={nameBlur}
                            className="tw-pl-10 tw-transition-all tw-duration-200 tw-ease-in-out tw-border-b-2 tw-border-gray-300 focus:tw-border-blue-500 focus:tw-shadow-md"
                          />
                        </div>

                        {/* Email */}
                        <div className="tw-relative">
                          <label htmlFor="email" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Email</label>
                          <i className="fa fa-envelope tw-absolute tw-top-10 tw-right-3 tw-text-gray-400"></i>
                          <Input
                            attribute="email"
                            type="email"
                            placeholder="Email..."
                            blurFunction={emailBlur}
                            className="tw-pl-10 tw-transition-all tw-duration-200 tw-ease-in-out tw-border-b-2 tw-border-gray-300 focus:tw-border-blue-500 focus:tw-shadow-md"
                          />
                        </div>

                        {/* Số điện thoại */}
                        <div className="tw-relative">
                          <label htmlFor="phone" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Số điện thoại</label>
                          <i className="fa fa-phone tw-absolute tw-top-10 tw-right-3 tw-text-gray-400"></i>
                          <Input
                            attribute="phone"
                            type="tel"
                            placeholder="Số điện thoại..."
                            blurFunction={phoneBlur}
                            className="tw-pl-10 tw-transition-all tw-duration-200 tw-ease-in-out tw-border-b-2 tw-border-gray-300 focus:tw-border-blue-500 focus:tw-shadow-md"
                          />
                        </div>

                        {/* Địa chỉ */}
                        <div className="tw-relative">
                          <label htmlFor="address" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Địa chỉ</label>
                          <i className="fa fa-map-marker tw-absolute tw-top-10 tw-right-3 tw-text-gray-400"></i>
                          <Input
                            attribute="address"
                            type="text"
                            placeholder="Địa chỉ..."
                            className="tw-pl-10 tw-transition-all tw-duration-200 tw-ease-in-out tw-border-b-2 tw-border-gray-300 focus:tw-border-blue-500 focus:tw-shadow-md"
                          />
                        </div>

                        {/* Mật khẩu */}
                        <div className="tw-relative">
                          <label htmlFor="password" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Mật khẩu</label>

                          <Input
                            attribute="password"
                            type="password"
                            placeholder="Mật khẩu..."
                            blurFunction={passwordBlur}
                            showEyeIcon
                            className="tw-pl-10 tw-transition-all tw-duration-200 tw-ease-in-out tw-border-b-2 tw-border-gray-300 focus:tw-border-blue-500 focus:tw-shadow-md"
                          />
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="tw-relative">
                          <label htmlFor="confirmPassword" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Xác nhận mật khẩu</label>

                          <Input
                            attribute="confirmPassword"
                            type="password"
                            placeholder="Xác nhận mật khẩu..."
                            blurFunction={confirmPasswordBlur}
                            showEyeIcon
                            className="tw-pl-10 tw-transition-all tw-duration-200 tw-ease-in-out tw-border-b-2 tw-border-gray-300 focus:tw-border-blue-500 focus:tw-shadow-md"
                          />
                        </div>

                        <div className="tw-flex tw-items-center tw-gap-2 tw-mt-4 tw-mb-4">
                          <Input
                            id="terms"
                            aria-describedby="terms"
                            attribute="condition"
                            type="checkbox"
                            className="tw-w-4 tw-h-4 tw-border tw-border-gray-300 tw-rounded tw-bg-gray-50 tw-focus:ring-3 tw-focus:ring-blue-300 tw-dark:bg-gray-700 tw-dark:border-gray-600 tw-dark:focus:ring-blue-600 tw-dark:ring-offset-gray-800"
                            required
                           
                          />
                          <label
                            htmlFor="terms"
                            className="tw-text-gray-500 tw-dark:text-gray-300 tw-text-sm"
                          >
                            Tôi đồng ý về{" "}
                            <a
                              className="tw-font-medium tw-text-blue-600 tw-hover:underline tw-dark:text-blue-500"
                              href="#"
                            >
                              Điều kiện và thỏa thuận
                            </a>
                          </label>
                        </div>


                        <div className="tw-mt-6">
                          <button onClick={handleSendRegisterOTP} className="tw-w-full tw-text-white tw-bg-gradient-to-r tw-from-blue-600 tw-to-blue-500 tw-hover:tw-from-blue-700 tw-hover:tw-to-blue-600 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-font-medium tw-rounded-lg tw-text-lg tw-px-5 tw-py-3 tw-transition-all tw-duration-200 tw-ease-in-out">
                            Đăng ký
                          </button>
                        </div>

                        <div className="tw-text-center tw-text-sm tw-font-medium tw-text-gray-500 tw-dark:text-gray-300">
                          Đã có tài khoản? <span onClick={() => setPage('login')} className="tw-cursor-pointer tw-text-blue-700 tw-hover:underline tw-dark:text-blue-500">Đăng nhập ngay</span>
                        </div>
                      </div>

                      {/* Thông báo lỗi nếu có */}
                      {
                        errorObj.sendRegisterOTP &&
                        <p className="tw-text-red-600 tw-text-[14px] tw-mt-4">{errorObj.sendRegisterOTP}</p>
                      }
                    </div>
                  }

                  {
                    page == 'register_otp' &&
                    <div className="tw-w-full tw-max-w-sm tw-p-4 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-sm:p-6 tw-md:p-8 tw-dark:bg-gray-800 tw-dark:border-gray-700">
                      <div className="tw-space-y-6">
                        <h5 className="tw-text-4xl tw-font-medium tw-text-gray-900 tw-dark:text-white">Xác thực OTP</h5>
                        <p className="tw-text-gray-600 tw-dark:text-gray-300">Chúng tôi đã gửi mã xác minh tới email {userFormData.email}. Vui lòng nhập mã bên dưới</p>
                        <div>
                          <label htmlFor="registerOTP" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Mã OTP</label>
                          <Input
                            attribute="registerOTP"
                            type="text"
                            placeholder="Verification Code"
                          />
                        </div>
                        <button onClick={handleRegister} className="tw-w-full tw-text-white tw-bg-gradient-to-r tw-from-blue-600 tw-to-blue-500 tw-hover:tw-from-blue-700 tw-hover:tw-to-blue-600 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-font-medium tw-rounded-lg tw-text-lg tw-px-5 tw-py-3 tw-transition-all tw-duration-200 tw-ease-in-out">Xác nhận</button>
                        <p onClick={() => setPage('register')} className="tw-text-sm tw-font-medium tw-text-blue-700 tw-hover:underline tw-dark:text-blue-500 tw-cursor-pointer">Email không chính xác?</p>
                        {
                          errorObj.register &&
                          <p className="tw-text-red tw-text-[14px] tw-capitalize">{errorObj.register}
                            <span onClick={handleSendRegisterOTP} className="tw-text-linkBlue tw-cursor-pointer tw-text-[16px] tw-ml-[8px]">Gửi lại mã</span>
                          </p>
                        }
                      </div>
                    </div>
                  }

                  {
                    page == 'login' &&


                    <div class="tw-w-full tw-max-w-sm tw-p-4 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-sm:p-6 tw-md:p-8 tw-dark:bg-gray-800 tw-dark:border-gray-700">
                      <div class="tw-space-y-6" >
                        <h5 class="tw-text-4xl tw-font-medium tw-text-gray-900 tw-dark:text-white">Đăng nhập</h5>
                        <div>
                          <label for="email" class="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Email</label>

                          <Input
                            attribute="email"
                            type="email"
                            placeholder="name@company.com"
                            blurFunction={emailBlur}
                          />
                        </div>
                        <div>
                          <label for="password" class="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Mật khẩu</label>

                          <Input
                            attribute="password"
                            type="password"
                            placeholder="••••••••"

                            showEyeIcon
                          />
                        </div>
                        <div class="tw-flex tw-items-start">
                          <a onClick={() => setPage('forget_password_email')} className="tw-ms-auto tw-text-sm tw-text-blue-700 tw-hover:underline tw-dark:text-blue-500">Quên mật khẩu?</a>
                        </div>

                        <button onClick={handleLogin} className="tw-w-full tw-text-white tw-bg-blue-700 tw-hover:bg-blue-800 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-dark:bg-blue-600 tw-dark:hover:bg-blue-700 tw-dark:focus:ring-blue-800">Đăng nhập</button>
                        <div class="tw-text-sm tw-font-medium tw-text-gray-500 tw-dark:text-gray-300">
                          Bạn chưa có tài khoản? <span onClick={() => setPage('register')} class=" tw-cursor-pointer tw-text-blue-700 tw-hover:underline tw-dark:text-blue-500">Đăng kí ngay!!!</span>
                        </div>
                      </div>
                      {
                        errorObj.login &&
                        <p className="tw-text-red tw-text-[14px]">{errorObj.login}</p>
                      }
                    </div>


                  }
                  {
                    page == 'forget_password_email' &&
                    <div className="tw-w-full tw-max-w-sm tw-p-4 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-sm:p-6 tw-md:p-8 tw-dark:bg-gray-800 tw-dark:border-gray-700">
                      <div className="tw-mb-4">
                        <label htmlFor="email" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Email</label>
                        <Input
                          attribute="email"
                          type="email"
                          placeholder="name@company.com"
                          blurFunction={emailBlur}
                        />
                      </div>
                      <div className="tw-mb-4">
                        <button
                          onClick={handleSendForgetPasswordOTP}
                          className="tw-w-full tw-text-white tw-bg-blue-700 tw-hover:bg-blue-800 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-dark:bg-blue-600 tw-dark:hover:bg-blue-700 tw-dark:focus:ring-blue-800"
                        >
                          Gửi OTP
                        </button>
                      </div>
                      <p onClick={() => setPage('login')} className="tw-text-linkBlue tw-cursor-pointer tw-mb-4">Quay lại</p>
                      {
                        errorObj.sendForgetPasswordOTP &&
                        <p className="tw-text-red tw-text-[14px]">{errorObj.sendForgetPasswordOTP}</p>
                      }
                    </div>
                  }
                  {
                    page == 'forget_password_otp' &&
                    <div className="tw-w-full tw-max-w-sm tw-p-4 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-sm:p-6 tw-md:p-8 tw-dark:bg-gray-800 tw-dark:border-gray-700">
                      <div className="tw-space-y-6">
                        <h5 className="tw-text-4xl tw-font-medium tw-text-gray-900 tw-dark:text-white">Xác nhận mã OTP</h5>
                        <p className="tw-text-gray-600 tw-dark:text-gray-300">Chúng tôi đã gửi mã xác minh tới email {userFormData.email}. Vui lòng nhập mã và đặt mật khẩu mới bên dưới.</p>
                        <div>
                          <label htmlFor="forgetPasswordOTP" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Mã OTP</label>
                          <Input
                            attribute="forgetPasswordOTP"
                            type="text"
                            placeholder="Verification Code"
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="tw-block tw-mb-2 tw-text-lg tw-font-medium tw-text-gray-900 tw-dark:text-white">Mật khẩu mới</label>
                          <Input
                            attribute="password"
                            type="password"
                            placeholder="New Password..."
                            blurFunction={passwordBlur}
                            showEyeIcon
                          />
                        </div>
                        <button onClick={handleChangePassword} className="tw-w-full tw-text-white tw-bg-blue-700 tw-hover:bg-blue-800 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-dark:bg-blue-600 tw-dark:hover:bg-blue-700 tw-dark:focus:ring-blue-800">Đặt mật khẩu</button>
                        <p onClick={() => setPage('forget_password_email')} className="tw-text-sm tw-font-medium tw-text-blue-700 tw-hover:underline tw-dark:text-blue-500 tw-cursor-pointer">Email không chính xác?</p>
                        {
                          errorObj.changePassword &&
                          <p className="tw-text-red tw-text-[14px] tw-capitalize">{errorObj.changePassword}
                            <span onClick={handleSendForgetPasswordOTP} className="tw-text-linkBlue tw-cursor-pointer tw-text-[16px] tw-ml-[8px]">Gửi lại mã</span>
                          </p>
                        }
                      </div>
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


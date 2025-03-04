import { useStateContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
// import '../css/Navbar.scss'
import '../css/bootstrap.min.css'
import '../css/style.css'
const Navbar = () => {

    const navigate = useNavigate()
    const { user, setPage, setUserFormData, initialUserState, initialErrorObj, setErrorObj } = useStateContext()
  

    return (
        <div className="navbar">
            {
                user ? (
                    <div className="container-fluid fixed-top">
                        <div class="container topbar d-none d-lg-block">
                            <div class="d-flex justify-content-between">
                                <div class="top-info ps-2">
                                    <small class="me-3"><i class="fas fa-map-marker-alt me-2 text-secondary"></i> <a href="#" class="text-white">Số 1 VVN, Linh Chiểu, Thủ Đức</a></small>
                                    <small class="me-3"><i class="fas fa-envelope me-2 text-secondary"></i><a href="#" class="text-white">bookshop@gmail.com</a></small>
                                </div>
                                <div class="top-link pe-2">
                                    <a href="#" class="text-white"><small class="text-white mx-2">Chính sách bảo mật</small>/</a>
                                    <a href="#" class="text-white"><small class="text-white mx-2">Điều khoản sử dụng</small></a>

                                </div>
                            </div>
                        </div>
                        <div className="container px-0">
                            <nav className="navbar navbar-light bg-white navbar-expand-xl">
                                <a href="/" className="navbar-brand "><h1 className=" display-6 logo"><i className="fas fa-book-open"></i>BOOKSHOP.VN</h1></a>

                                <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                                    <span className="fa fa-bars text-primary"></span>
                                </button>
                                <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                                    <div className="navbar-nav mx-auto">
                                        <Link to="/" className="nav-item nav-link active fw-bold fs-5">Trang chủ</Link>
                                        <Link to="/" className="nav-item nav-link fw-bold fs-5">Mượn Sách</Link>
                                        <Link to="/exchange" className="nav-item nav-link fw-bold fs-5">Trao Đổi Sách</Link>
                                        <Link to="/contact" className="nav-item nav-link fw-bold fs-5">Liên Lạc</Link>
                                    </div>
                                    <div className="d-flex m-3 me-0">

                                        <Link to="/cart" className="position-relative me-4 my-auto">
                                            <i class="fa fa-shopping-cart fa-2x cart-nav" aria-hidden="true"></i>
                                           

                                        </Link>
                                        <Link to="/account" className="my-auto">
                                            {/* <i className="fas fa-user fa-2x"></i> */}
                                            <img src={user?.image} alt="avatar" className="rounded-circle img-fluid"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid black' }} />
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                ) : (
                    <div className="container-fluid fixed-top">
                        <div class="container topbar d-none d-lg-block">
                            <div class="d-flex justify-content-between">
                                <div class="top-info ps-2">
                                    <small class="me-3"><i class="fas fa-map-marker-alt me-2 text-secondary"></i> <a href="#" class="text-white">Số 1 VVN, Linh Chiểu, Thủ Đức</a></small>
                                    <small class="me-3"><i class="fas fa-envelope me-2 text-secondary"></i><a href="#" class="text-white">bookshop@gmail.com</a></small>
                                </div>
                                <div class="top-link pe-2">
                                    <a href="#" class="text-white"><small class="text-white mx-2">Chính sách bảo mật</small>/</a>
                                    <a href="#" class="text-white"><small class="text-white mx-2">Điều khoản sử dụng</small></a>

                                </div>
                            </div>
                        </div>
                        <div className="container px-0">
                            <nav className="navbar navbar-light bg-white navbar-expand-xl">
                                <a href="/" className="navbar-brand "><h1 className=" display-6 logo"><i className="fas fa-book-open"></i>BOOKSHOP.VN</h1></a>

                                <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                                    <span className="fa fa-bars text-primary"></span>
                                </button>
                                <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                                    <div className="navbar-nav mx-auto">
                                        <Link to="/" className="nav-item nav-link active fw-bold fs-5">Trang chủ</Link>
                                        <Link to="/" className="nav-item nav-link fw-bold fs-5">Mượn Sách</Link>
                                        <Link to="/exchange" className="nav-item nav-link fw-bold fs-5">Trao Đổi Sách</Link>
                                        <Link to="/contact" className="nav-item nav-link fw-bold fs-5">Liên Lạc</Link>
                                    </div>
                                    <div className="d-flex m-3 me-0">

                                        <Link to={'/cart'} className="position-relative me-4 my-auto">
                                            <i class="fa fa-shopping-cart fa-2x cart-nav" aria-hidden="true"></i>
                                            

                                        </Link>
                                        <Link to={'/auth'} className="my-auto">
                                            {/* <i className="fas fa-user fa-2x"></i> */}
                                            <button type="button" class="btn btn-primary">Đăng nhập</button>
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Navbar

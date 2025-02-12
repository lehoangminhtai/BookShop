import { useStateContext } from '../context/UserContext'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import React from 'react';
import '../css/bootstrap.min.css'
import '../css/style.css'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation() // Lấy đường dẫn hiện tại
    const { user } = useStateContext()

    // Hàm kiểm tra xem đường dẫn hiện tại có trùng với đường dẫn của Link không
    const isActive = (path) => location.pathname === path ? "active text-primary" : "text-dark";

    return (
        <div className="navbar">
            <div className="container-fluid fixed-top">
                {/* Topbar */}
                <div className="container topbar d-none d-lg-block">
                    <div className="d-flex justify-content-between">
                        <div className="top-info ps-2">
                            <small className="me-3"><i className="fas fa-map-marker-alt me-2 text-secondary"></i> 
                                <a href="#" className="text-white">Số 1 VVN, Linh Chiểu, Thủ Đức</a>
                            </small>
                            <small className="me-3"><i className="fas fa-envelope me-2 text-secondary"></i>
                                <a href="#" className="text-white">bookshop@gmail.com</a>
                            </small>
                        </div>
                        <div className="top-link pe-2">
                            <a href="#" className="text-white"><small className="text-white mx-2">Chính sách bảo mật</small>/</a>
                            <a href="#" className="text-white"><small className="text-white mx-2">Điều khoản sử dụng</small></a>
                        </div>
                    </div>
                </div>

                {/* Navbar chính */}
                <div className="container px-0">
                    <nav className="navbar navbar-light bg-white navbar-expand-xl">
                        <a href="/" className="navbar-brand">
                            <h1 className="display-6 logo"><i className="fas fa-book-open"></i> BOOKSHOP.VN</h1>
                        </a>

                        <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                            <span className="fa fa-bars text-primary"></span>
                        </button>

                        <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                            <div className="navbar-nav mx-auto">
                                <Link to="/" className={`nav-item nav-link fw-bold fs-5 ${isActive("/")}`}>Trang chủ</Link>
                              
                                <Link to="/exchange" className={`nav-item nav-link fw-bold fs-5 ${isActive("/exchange")}`}>Trao Đổi Sách</Link>
                                <Link to="/contact" className={`nav-item nav-link fw-bold fs-5 ${isActive("/contact")}`}>Liên Lạc</Link>
                            </div>

                            <div className="d-flex m-3 me-0">
                                <Link to="/cart" className="position-relative me-4 my-auto">
                                    <i className="fa fa-shopping-cart fa-2x cart-nav"></i>
                                </Link>

                                {user ? (
                                    <Link to="/account" className="my-auto">
                                        <img src={user?.image} alt="avatar" className="rounded-circle img-fluid"
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid black' }} />
                                    </Link>
                                ) : (
                                    <Link to="/auth" className="my-auto">
                                        <button type="button" className="btn btn-primary">Đăng nhập</button>
                                    </Link>
                                )}
                            </div>
                        </div>
<<<<<<< HEAD
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
=======
                    </nav>
                </div>
            </div>
>>>>>>> c685fe1 (add book exchange page)
        </div>
    )
}

export default Navbar;

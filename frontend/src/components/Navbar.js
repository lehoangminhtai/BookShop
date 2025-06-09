import { useStateContext } from '../context/UserContext'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import '../css/bootstrap.min.css'
import '../css/style.css'
import { io } from 'socket.io-client'

import { getNotifications, markNotificationAsRead } from '../services/notificationService'
import WishListItem from './customer/WishListItem';
import useWishlistStore from '../store/useWishListStore';
const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation() // Lấy đường dẫn hiện tại
    const { user } = useStateContext()

    // Hàm kiểm tra xem đường dẫn hiện tại có trùng với đường dẫn của Link không
    const isActive = (path) => location.pathname === path ? "active text-primary" : "text-dark";
    const isInWishlist = (path) => location.pathname === path ? "text-danger" : "";
    const wishlist = useWishlistStore(state => state.wishlist);

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);
    const bellRef = useRef(null);

    const socketRef = useRef(null);

    useEffect(() => {
        if (user) {
            if (!socketRef.current) {
                socketRef.current = io("http://localhost:4000", {
                    query: { userId: user._id },
                });

                socketRef.current.on("getNotification", (notification) => {
                    setNotifications((prev) => [notification, ...prev]);
                });
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user]);


    const fetchNotifications = async () => {
        try {
            const response = await getNotifications(user._id);
            console.log("response notifications", response);
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleNotificationClick = async (noti) => {
        try {
            await markNotificationAsRead(noti._id);
            setNotifications((prevNotifications) =>
                prevNotifications.map((n) =>
                    n._id === noti._id ? { ...n, isRead: true } : n
                )
            );
            navigate(noti.link || "/");
            setShowDropdown(false);
        } catch (err) {
            console.error("Không thể đánh dấu đã đọc:", err);
        }
    };
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
                                {user && (
                                    <div className="position-relative me-4" ref={bellRef}>
                                        <i
                                            className={`fa fa-bell fa-2x ${showDropdown ? 'cart-nav' : ''}`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        ></i>
                                        {unreadCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                                <span className="visually-hidden">Có thông báo</span>
                                            </span>
                                        )}
                                        {showDropdown && (
                                            <div className="position-absolute bg-white shadow p-2 mt-2" style={{ width: '500px', maxHeight: '550px', overflowY: 'auto', right: 0, zIndex: 1000 }}>
                                                <h6 className="border-bottom pb-2">Thông báo</h6>
                                                {notifications.length === 0 ? (
                                                    <p className="text-muted">Không có thông báo.</p>
                                                ) : (
                                                    notifications.map((noti) => (
                                                        <div
                                                            key={noti._id}
                                                            className={`d-flex p-2 rounded mb-2 align-items-start ${!noti.isRead ? 'bg-light' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleNotificationClick(noti)}
                                                        >
                                                            <div
                                                                className="me-2 d-flex justify-content-center align-items-center"
                                                                style={{
                                                                    width: '80px',
                                                                    height: '80px',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {noti.type === 'point' ? (
                                                                    <div
                                                                        className="d-flex justify-content-center align-items-center"
                                                                        style={{
                                                                            width: '64px',
                                                                            height: '64px',
                                                                            borderRadius: '50%',
                                                                            backgroundColor: '#fff3cd', // vàng nhạt
                                                                            color: '#f0ad4e',           // vàng đậm
                                                                            fontSize: '32px',
                                                                        }}
                                                                    >
                                                                        <i className="fa-solid fa-coins"></i>
                                                                    </div>
                                                                ) : (
                                                                    noti.image && (
                                                                        <img
                                                                            src={noti.image}
                                                                            alt="notification"
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>

                                                            <div className="flex-grow-1">
                                                                <p className="mb-1">{noti.content}</p>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <small className="text-muted">
                                                                        {new Date(noti.createdAt).toLocaleDateString('vi-VN')}
                                                                    </small>
                                                                    <span
                                                                        className="text-primary"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => handleNotificationClick(noti)}
                                                                    >
                                                                        Chi tiết
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="position-relative me-4 my-auto">
                                    <i
                                        className={`fa fa-heart fa-2x cursor-pointer ${showWishlist && 'text-danger'}`}
                                        onClick={() => setShowWishlist(prev => !prev)}
                                    ></i>
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: '0.75rem', padding: '0.4em 0.6em' }}
                                    >
                                        {wishlist.length}
                                    </span>

                                    {showWishlist && (
                                        <div
                                            className="dropdown-menu show p-3 position-absolute end-0"
                                            style={{ width: '400px', top: '100%', maxHeight: '300px', overflowY: 'auto' }}
                                        >
                                            <h6 className="mb-2">Yêu thích</h6>
                                            {wishlist.length > 0 ? (
                                                wishlist.map(item => (
                                                    <WishListItem key={item} item={item} />
                                                ))
                                            ) : (
                                                <p className="text-muted">😔 Chưa thêm sách nào</p>
                                            )}

                                        </div>

                                    )}
                                </div>

                                <Link to="/cart" className="position-relative me-4 my-auto">
                                    <i className={`fa fa-shopping-cart fa-2x ${isActive('/cart')}`}></i>
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
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Navbar;

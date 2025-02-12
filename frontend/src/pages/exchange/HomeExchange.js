import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
//service

import { getBookSales, getTopCategoryBooks, getTopBooks, getLastBooks } from "../../services/homeService";

import '../../css/bootstrap.min.css'
import '../../css/style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

//Component
import BookDetail from '../../components/BookDetail';



const HomeExchange = () => {

    const [bookSales, setBookSales] = useState([])
    const [topBookSales, setTopBookSales] = useState([])
    const [newBookSales, setNewBookSales] = useState([])
    const [categoryBooks, setCategoryBooks] = useState([])
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const searchButtonRef = useRef(null);
    const fetchCategoryBooks = async () => {
        try {

            const response = await getTopCategoryBooks()
            if (response.success) {
                setCategoryBooks(response.topCategories)
            }
        } catch (error) {

        }
    }

    const fetchBookSales = async () => {
        try {
            const data = { page: 1, limit: 8 }
            const response = await getBookSales(data);
            console.log(response.data)
            if (response.data) {

                const shuffled = [...response.data].filter(book => book?._id).sort(() => Math.random() - 0.5);
                setBookSales(shuffled);
            }

        } catch (error) {

        }
    }
    const fetchNewBookSales = async () => {
        try {
            const data = { page: 1, limit: 10 }
            const response = await getLastBooks(data);
            setNewBookSales(response.books)
        } catch (error) {

        }
    }
    const fetchTopBookSales = async () => {
        try {
            const data = { page: 1, limit: 10 }
            const response = await getTopBooks(data);
            setTopBookSales(response.books)
            console.log(topBookSales)
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchBookSales()
        fetchCategoryBooks();
        fetchNewBookSales();
        fetchTopBookSales();
    }, [])

    const handleChangeInput = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearch = (e) => {
        navigate(`/search/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`)
    }

    const settings = {
        speed: 500,
        slidesToShow: 5, // Số lượng item hiển thị cùng lúc
        slidesToScroll: 4, // Số lượng item cuộn mỗi lần
        arrows: true,
        responsive: [
            {
                breakpoint: 1024, // Màn hình lớn
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768, // Màn hình trung bình
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 576, // Màn hình nhỏ
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const handleKeyDownClick = (event, nextButtonRef) => {
        if (event.key === "Enter" && nextButtonRef?.current) {
            event.preventDefault();
            nextButtonRef.current.click();
        }
    };

    const [viewMode, setViewMode] = useState("grid"); // 'grid' hoặc 'list'

    const books = [
        {
            id: 1,
            title: "MY 2BED FOR YOUR 3BED",
            date: "28 Feb 2025",
            location: "Hackney, London",
            image: "https://storage.googleapis.com/a1aa/image/ULHIleprXDjLAJs2cOc3nGBb20LPW0nw_tup7WcnvDo.jpg"
        },
        {
            id: 2,
            title: "2 bed N16. Need 3 bed.",
            date: "06 Feb 2025",
            location: "Hackney, London",
            image: "https://storage.googleapis.com/a1aa/image/qADS9fHiJMXRYyrRgISMQ4pUa5ZTpcjm0jR3DT0vU3U.jpg"
        }
    ];

    return (
        <div >

            <div className="container-fluid py-5 mb-5 hero-header">

                <div className="container">
                    <div className="row justify-content-center">
                        {/* Ô tìm kiếm sách */}
                        <div className="col-12 col-md-6 my-2">
                            <div className="input-group ">
                                <input
                                    type="text"
                                    className="form-control border-2 rounded-start-pill py-3 px-4"
                                    placeholder="Nhập tên sách, tác giả bạn muốn tìm..."
                                    aria-label="Search"
                                />
                                <button className="btn btn-primary border-2 rounded-end-pill px-4">
                                    <i className="fa fa-search"></i> Tìm kiếm
                                </button>
                            </div>
                        </div>

                        {/* Ô đăng sách */}
                        <div className="col-12 col-md-6 my-2 text-center">
                            <button className="btn btn-success border-2 rounded-pill px-4 py-3 w-100 ">
                                <i className="fa fa-upload"></i> Đăng sách
                            </button>
                        </div>
                    </div>

                    <h2 class="h2 mt-5 text-center">Chia sẻ tri thức</h2>
                    <div className="d-flex justify-content-end">

                        <div className="d-flex justify-content-between">
                            <div class="d-flex justify-content-end mb-3 me-2">
                                <select class="form-select w-auto">
                                    <option>Tất cả</option>
                                    <option>7 ngày qua</option>
                                    <option>30 ngày qua</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-end mb-3">
                                <button
                                    className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"} me-2`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <i className="bi bi-grid"></i>
                                </button>
                                <button
                                    className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <i className="bi bi-list"></i>
                                </button>
                            </div>

                        </div>

                    </div>

                    <div class="row">
                        <div class="col-lg-3 mb-4">
                            <div class="card p-3">
                                <h2 class="h5">Địa điểm</h2>

                                <div class="d-flex">
                                    <select class="form-select">
                                        <option>Chọn vị trí</option>
                                        <option>Hồ Chí Minh</option>
                                        <option>Hà Nội</option>
                                        <option>Đà Nẵng</option>
                                    </select>

                                </div>
                                <h2 class="h5 mt-3">Thể loại</h2>
                                <ul class="list-unstyled">
                                    <li></li>
                                    <li>
                                        <select class=" w-auto">
                                            <option><a href="#" class="text-primary">Tất cả</a></option>
                                            <option>7 ngày qua</option>
                                            <option>30 ngày qua</option>
                                        </select>
                                    </li>

                                </ul>
                                <h2 class="h5 mt-3">Tình trạng</h2>
                                <ul class="list-unstyled">
                                    <li><input type="radio" name="property-type" /> Mới <span class="text-muted">(6)</span></li>
                                    <li><input type="radio" name="property-type" /> Đã qua sử dụng <span class="text-muted">(10)</span></li>
                                    <li><input type="radio" name="property-type" /> Cũ <span class="text-muted">(4)</span></li>
                                </ul>
                                <h2 class="h5 mt-3">Người đăng</h2>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex justify-content-between">
                                        <label className="form-check-label me-4">
                                            <input type="radio" name="user-type" className="form-check-input" value="canhan" />
                                            Cá nhân
                                        </label>
                                        <label className="form-check-label">
                                            <input type="radio" name="user-type" className="form-check-input" value="cuahang" />
                                            Cửa hàng
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="col-lg-9 mt-3">

                            <div class="row g-3">
                                
                                <div className={`row ${viewMode === "grid" ? "g-3" : ""}`}>
                                    {books.map((book) => (
                                        <div key={book.id} className={`mt-2 ${viewMode === "grid" ? "col-md-6" : "col-12"}`}>
                                            <div className={`card p-3 d-flex ${viewMode === "grid" ? "flex-row" : "flex-row"}`}>
                                                <div className="position-relative me-3">
                                                    <img src={book.image} className="img-fluid rounded" width="150" height="150" alt={book.title} />
                                                </div>
                                                <div>
                                                    <h3 className="h6">{book.title}</h3>
                                                    <p className="text-muted mb-1">Date available: {book.date}</p>
                                                    <p className="text-muted">{book.location}</p>
                                                </div>
                                                <i className="far fa-heart ms-auto text-secondary"></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <div className=" bg-primary p-4 rounded-3 shadow container my-5 d-flex flex-wrap justify-content-center gap-5">

                {categoryBooks.map((cate, index) => (
                    <Link to={`/book-categories/${cate.nameCategory}/${cate._id}`}>
                        <div
                            key={index}
                            className="d-inline-flex flex-column align-items-center text-center p-2  rounded"
                            style={{ width: "90px" }}
                        >
                            <img
                                src={cate.image}
                                alt={'ảnh loại' + cate.nameCategory}
                                className="mb-1 rounded"
                                style={{ width: "64px", height: "64px" }}
                            />
                            <p className="small text-white m-0">{cate.nameCategory}</p>
                        </div>
                    </Link>
                ))}

            </div>
            <div class="container mt-3">
                <div class="d-flex align-items-center p-2" style={{ backgroundColor: "#fce4ec", borderRadius: "10px" }}>
                    <div class="d-flex align-items-center justify-content-center me-2" style={{ padding: "10px" }}>

                        <i class="fas fa-fire" style={{ fontSize: "24px", color: "#dc3545" }}></i>
                    </div>
                    <div class="fw-bold text-dark">
                        Xu Hướng Mua Sắm
                    </div>
                </div>
            </div>
            <div className="container mt-2">
                <Slider {...settings}>
                    {topBookSales &&
                        topBookSales.map((book) => book?._id && (
                            <div key={book?._id} className="p-2">
                                <BookDetail book={book} />
                            </div>
                        ))}
                </Slider>
            </div>
            <div className="d-flex justify-content-center mt-2">
                <Link to={`/hot-deal`}>
                    <button className="btn  d-flex align-items-center">
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                        <span className="ms-2">Xem thêm</span>
                    </button>
                </Link>
            </div>
            <div class="container mt-3">
                <div class="d-flex align-items-center p-2" style={{ backgroundColor: "#FFDAB9", borderRadius: "10px" }}>
                    <div class="d-flex align-items-center justify-content-center me-2" style={{ padding: "10px" }}>
                        <img alt="Trending icon" height="24" src="https://res.cloudinary.com/dyu419id3/image/upload/v1730313193/icon_dealhot_new_zfmnum.webp" width="24" />

                    </div>
                    <div class="fw-bold" style={{ color: "#333333" }}>
                        Khám phá sách mới
                    </div>
                </div>
            </div>
            <div className="container mt-2">
                <Slider {...settings}>
                    {newBookSales &&
                        newBookSales.map((book) => book?._id && (
                            <div key={book?._id} className="p-2">
                                <BookDetail book={book.bookId} />
                            </div>
                        ))}
                </Slider>
            </div>
            <div className="d-flex justify-content-center mt-2">
                <Link to={`/last-book`}>
                    <button className="btn  d-flex align-items-center">
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                        <span className="ms-2">Xem thêm</span>
                    </button>
                </Link>
            </div>
            <div className="container mt-3">
                <div
                    className="d-flex align-items-center p-2"
                    style={{
                        backgroundColor: "#E6F7FF", // Nền xanh nhạt hiện đại
                        borderRadius: "10px",
                    }}
                >
                    {/* Icon */}
                    <div
                        className="d-flex align-items-center justify-content-center me-2"
                        style={{ padding: "10px" }}
                    >
                        <i class="fa-solid fa-thumbs-up" style={{ color: "#007BFF" }}></i>
                    </div>

                    {/* Text */}
                    <div
                        className="fw-bold"
                        style={{
                            color: "#007BFF", // Chữ màu xanh dương nổi bật
                            fontSize: "1.1rem", // Tăng kích cỡ chữ
                        }}
                    >
                        Có thể bạn sẽ thích
                    </div>
                </div>
            </div>
            <div className="container mt-5 ms-5">

                <div className="row align-items-center">
                    {bookSales && bookSales.map(book => book?._id && (
                        <div key={book?._id} className="col-md-4 col-sm-6 col-lg-3">
                            <BookDetail book={book.bookId} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="d-flex justify-content-center mt-2">
                <Link to={`/others`}>
                    <button className="btn  d-flex align-items-center">
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                        <span className="ms-2">Xem thêm</span>
                    </button>
                </Link>
            </div>
            <div class="container-fluid features py-5">
                <div class="container py-5">
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fas fa-car-side fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>Vận chuyển khắp mọi miền</h5>
                                    <p class="mb-0">An toàn và nhanh chóng</p>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fas fa-user-shield fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>Thanh toán bảo mật</h5>
                                    <p class="mb-0">100% bảo mật thanh toán</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fas fa-exchange-alt fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>30 Ngày hoàn trả</h5>
                                    <p class="mb-0">Đảm bảo hoàn tiền trong 30 ngày</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fa fa-phone-alt fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>Hỗ trợ 24/7</h5>
                                    <p class="mb-0">Hỗ trợ mọi lúc nhanh chóng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />

        </div>

    );
}

export default HomeExchange;
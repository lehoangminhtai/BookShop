import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useBookContext } from "../hooks/useBookContext";
//service
import { fetchBooks } from "../services/bookService";
import { getBookSales, getTopCategoryBooks } from "../services/homeService";

import '../css/bootstrap.min.css'
import '../css/style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

//Component
import BookDetail from '../components/BookDetail';
import BookForm from "../components/BookForm";


const Home = () => {

    const { books, dispatch } = useBookContext();
    const [bookSales, setBookSales] = useState([])
    const [newBookSales, setNewBookSales] = useState([])
    const [categoryBooks, setCategoryBooks] = useState([])

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
            const response = await getBookSales();
            setBookSales(response.data)
        } catch (error) {

        }
    }
    const fetchNewBookSales = async () => {
        try {
            const response = await getBookSales();
            setNewBookSales(response.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchBookSales()
        fetchCategoryBooks();
        fetchNewBookSales();
    },[])

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

    return (
        <div >
            <div className="container-fluid py-5 mb-5 hero-header">
                <div className="container">
                    <div className="d-flex justify-content-center mb-5">
                        <div className="input-group" style={{ maxWidth: "500px" }}>
                            <input
                                type="text"
                                className="form-control border-2 rounded-start-pill py-3 px-4"
                                placeholder="Nhập tên sách bạn muốn tìm..."
                                aria-label="Search"
                            />
                            <button
                                className="btn btn-primary border-2 rounded-end-pill px-4"
                                type="submit"
                            >
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div
                            className="col-md-12 col-lg-6"

                        >
                            <h4 className="mb-3 text-primary">Mở ra thế giới tri thức từ những trang sách</h4>
                            <h3 className="mb-3 display-5 text-secondary">Một cuốn sách, muôn hành trình</h3>
                        </div>



                        <div className="col-md-12 col-lg-6">

                            <div id="carouselOne" className="carousel slide mb-4 position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/b7/45/59/b74559537f4ea86ef4f6e79a732263ed.jpg"
                                            className="img-fluid w-100 bg-secondary rounded"
                                            alt="First slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">50% sale</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/57/cf/2f/57cf2f93ff49e1725fcc31af7ee0b77a.jpg"
                                            className="img-fluid w-100 rounded"
                                            alt="Second slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Free ship</a>
                                    </div>
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselOne"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselOne"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>


                            <div id="carouselTwo" className="carousel slide position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/57/cf/2f/57cf2f93ff49e1725fcc31af7ee0b77a.jpg"
                                            className="img-fluid w-100 bg-secondary rounded"
                                            alt="First slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Flash Sale</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/b7/45/59/b74559537f4ea86ef4f6e79a732263ed.jpg"
                                            className="img-fluid w-100 rounded"
                                            alt="Second slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Special Offer</a>
                                    </div>
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselTwo"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselTwo"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-primary p-4 rounded-3 shadow container my-5 d-flex flex-wrap justify-content-center gap-5">

                {categoryBooks.map((cate, index) => (
                    <Link>
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
                        
                        <i class="fas fa-fire" style={{fontSize: "24px", color: "#dc3545"}}></i>
                    </div>
                    <div class="fw-bold text-dark">
                        Xu Hướng Mua Sắm
                    </div>
                </div>
            </div>
            <div className="container mt-2">
                <Slider {...settings}>
                    {bookSales &&
                        bookSales.map((book) => (
                            <div key={book._id} className="p-2 book-hover">
                                <BookDetail book={book.bookId} />
                            </div>
                        ))}
                </Slider>
            </div>
            <div className="d-flex justify-content-center mt-2">
                <button className="btn  d-flex align-items-center">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"></path>
                    </svg>
                    <span className="ms-2">Xem thêm</span>
                </button>
            </div>
            <div class="container mt-3">
                <div class="d-flex align-items-center p-2" style={{ backgroundColor: "#FFDAB9", borderRadius: "10px" }}>
                    <div class="d-flex align-items-center justify-content-center me-2" style={{ padding: "10px" }}>
                    <img alt="Trending icon" height="24" src="https://res.cloudinary.com/dyu419id3/image/upload/v1730313193/icon_dealhot_new_zfmnum.webp" width="24" />

                    </div>
                    <div class="fw-bold" style={{color:"#333333"}}>
                        Khám phá sách mới
                    </div>
                </div>
            </div>
            <div className="container mt-2">
                <Slider {...settings}>
                    {bookSales &&
                        newBookSales.map((book) => (
                            <div key={book._id} className="p-2 book-hover">
                                <BookDetail book={book.bookId} />
                            </div>
                        ))}
                </Slider>
            </div>
            <div className="d-flex justify-content-center mt-2">
                <button className="btn  d-flex align-items-center">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"></path>
                    </svg>
                    <span className="ms-2">Xem thêm</span>
                </button>
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
      <i class="fa-solid fa-thumbs-up" style={{color:"#007BFF"}}></i>
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

            <div class="container-fluid features py-5">
                <div class="container py-5">
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fas fa-car-side fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>Miễn phí vận chuyển</h5>
                                    <p class="mb-0">Miễn phí với đơn trên 300.000đ</p>
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
        // <div classNameNameName="home">
        //     <div classNameNameName="books">
        //         {books && books.map(book => (
        //             <BookDetail key={book._id} book={book} />
        //         ))}
        //     </div>
        //     <BookForm />
        // </div>
    );
}

export default Home;
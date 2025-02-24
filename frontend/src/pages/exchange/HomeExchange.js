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
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const searchButtonRef = useRef(null);

    const handleClickPost = () => {
        navigate(`/exchange-post-detail`)
    }
    
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
       handleShowModal();
    }, [])

    const handleChangeInput = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearch = (e) => {
        navigate(`/search/${searchQuery.replace(/\s+/g, '-').toLowerCase()}`)
    }

   

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
            title: "Từ Vựng IELTS 8.0 - Từ Vựng Đắt Để Đạt Điểm Cao 4 Kỹ Năng",
            date: "16/02/2025",
            location: "TP.Hồ Chí Minh",
            image: "https://res.cloudinary.com/dyu419id3/image/upload/v1734341567/uploads/cl3qool78uh38wytk29h.webp"
        },
        {
            id: 2,
            title: "Giải Thích Ngữ Pháp Tiếng Anh (Tái Bản 2024)",
            date: "11/02/2025",
            location: "TP. Hồ Chí Minh",
            image: "https://res.cloudinary.com/dyu419id3/image/upload/v1734341457/uploads/xjns2efi1m1ebwbsu8fz.webp"
        },
        {
            id: 3,
            title: "Giáo Trình Chuẩn HSK 2 - Bài Học",
            date: "15/02/2025",
            location: "Hà Nội",
            image: "https://res.cloudinary.com/dyu419id3/image/upload/v1734341319/uploads/q47iz5fx8axac68v4mg2.webp"
        },
        {
            id: 4,
            title: "Giáo Trình Chuẩn HSK 3 - Sách Bài Tập",
            date: "14/02/2025",
            location: "Đà Nẵng",
            image: "https://res.cloudinary.com/dyu419id3/image/upload/v1734341362/uploads/zlqtsy3zkdhvcf2qicrg.webp"
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
                            <button className="btn btn-success border-2 rounded-pill px-4 py-3 w-100" onClick={handleShowModal}>
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
                        <div class="col-lg-3 mb-4 ">
                            <div class="card p-3 shadow-lg">
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
                        <div className="col-lg-9 mt-3">
                            <div className="row g-3">
                                <div className={`row ${viewMode === "grid" ? "g-3" : ""}`}>
                                    {books.map((book) => (
                                        <div key={book.id}
                                            className={`mt-2 ${viewMode === "grid" ? "col-md-6" : "col-12"}`}
                                            onClick={handleClickPost}
                                            style={{
                                                transition: 'transform 0.2s ease-in-out',
                                                cursor: 'pointer',
                                                minHeight: "150px", // Cố định chiều cao tối thiểu cho item
                                                height: "160px" // Cố định chiều cao đồng đều
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>

                                            <div className={`card p-3 d-flex ${viewMode === "grid" ? "flex-row" : "flex-row"}`}
                                                style={{
                                                    height: "100%",
                                                    alignItems: "center"
                                                }}>

                                                <div className="position-relative me-3">
                                                    <img
                                                        src={book.image}
                                                        className="img-fluid rounded"
                                                        width="100"
                                                        height="100"
                                                        alt={book.title}
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: "8px"
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-grow-1">
                                                    <h3 className="h6 text-truncate" style={{ maxWidth: "200px" }}>{book.title}</h3>
                                                    <p className="text-muted mb-1">Ngày đăng: {book.date}</p>
                                                    <p className="text-muted"><i className="fa fa-map-marker-alt"></i> {book.location}</p>
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
            <ToastContainer />

            {showModal && (
                <div className="modal show fade" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Đăng sách</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Tiêu đề sách</label>
                                        <input type="text" className="form-control" id="title" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="author" className="form-label">Tác giả sách</label>
                                        <input type="text" className="form-control" id="author" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Mô tả ngắn</label>
                                        <textarea className="form-control" id="description"></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="images" className="form-label">Danh sách ảnh</label>
                                        <input type="file" className="form-control" id="images" multiple />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="publisher" className="form-label">Nhà xuất bản</label>
                                        <input type="text" className="form-control" id="publisher" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="publicationYear" className="form-label">Năm xuất bản</label>
                                        <input type="number" className="form-control" id="publicationYear" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="categoryId" className="form-label">ID thể loại sách</label>
                                        <input type="text" className="form-control" id="categoryId" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="condition" className="form-label">Tình trạng sách</label>
                                        <select className="form-select" id="condition">
                                            <option value="new">Mới</option>
                                            <option value="like-new">Cũ - như mới</option>
                                            <option value="used">Cũ - có dấu hiệu sử dụng</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exchangeType" className="form-label">Loại hình trao đổi</label>
                                        <select className="form-select" id="exchangeType">
                                            <option value="points">Dùng điểm</option>
                                            <option value="direct">Trao đổi trực tiếp</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="creditPoints" className="form-label">Số điểm tín dụng</label>
                                        <input type="number" className="form-control" id="creditPoints" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="ownerId" className="form-label">ID người sở hữu sách</label>
                                        <input type="text" className="form-control" id="ownerId" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="receiverId" className="form-label">ID người nhận sách</label>
                                        <input type="text" className="form-control" id="receiverId" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Trạng thái sách</label>
                                        <select className="form-select" id="status">
                                            <option value="available">Có sẵn</option>
                                            <option value="exchanging">Đang trao đổi</option>
                                            <option value="exchanged">Đã trao đổi</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="location" className="form-label">Địa điểm trao đổi</label>
                                        <input type="text" className="form-control" id="location" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="pageCount" className="form-label">Số trang của sách</label>
                                        <input type="number" className="form-control" id="pageCount" />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Đóng</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeExchange;
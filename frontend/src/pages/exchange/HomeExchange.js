import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
//service
import '../../css/user/HomeExchange.scss'
import { getBookExchanges } from "../../services/exchange/bookExchangeService";
import { getListCategoryBooks } from "../../services/exchange/bookExchangeService";

//userContext
import { useStateContext } from "../../context/UserContext";

//Component
import BookDetail from '../../components/BookDetail';
import PostForm from "../../components/customer/BookExchange/PostForm";



const HomeExchange = () => {

    const [exchangeBooks, setExchangeBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isChatBoxExpanded, setIsChatBoxExpanded] = useState(true);

    const navigate = useNavigate();
    const searchButtonRef = useRef(null);

    const { user } = useStateContext();

    const [filters, setFilters] = useState({
        location: "",
        categoryId: "",
        condition: "",
        dateFilter: "",
        search: "",
    });
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [provinces, setProvinces] = useState([]);

    const [keyword, setKeyword] = useState(''); //search

    const fetchExchangeBooks = async (page = 1, filters = {}) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(8),
                ...filters,
            });
            console.log("params", params.toString())
            const response = await getBookExchanges(params.toString());
            if (response.success) {
                setExchangeBooks(response.data);
                setTotalPages(response.pagination.totalPages);
                setCurrentPage(page);
            }
        } catch (error) {
            console.log("Lỗi khi tải sách trao đổi:", error);
        }
    };

    useEffect(() => {
        if (user) setAnimate(true);
        fetchExchangeBooks(1, filters);
    }, [filters]);

    useEffect(() => {
        fetchCategories();
        fetchProvinces();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFilterReset = () => {
        setFilters({
            location: "",
            categoryId: "",
            condition: "",
            dateFilter: "",
        });
    };

    const handlePageChange = (event, newPage) => {
        console.log("newPage", newPage);
        fetchExchangeBooks(newPage, filters);
    };

    const fetchCategories = async () => {
        try {
            const response = await getListCategoryBooks();
            setCategoryBooks(response.data);  // Store categories in state
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
            const data = await response.json();

            if (data.error === 0) {
                setProvinces(data.data);
            } else {
                console.error('Error fetching provinces:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch provinces:', error);
        }
    };

    const toggleChatBox = () => {
        setIsChatBoxExpanded(!isChatBoxExpanded);
    };

    const handleClickPost = (exchangeId) => {
        navigate(`/exchange-post-detail/${exchangeId}`)
    }

    const handleShowModal = () => {
        if (user) {
            setShowModal(true);
        }
        else {
            navigate('/auth');
        }
    }
    const handleCloseModal = () => setShowModal(false);

   

    const handleKeyDownClick = (event, nextButtonRef) => {
        if (event.key === "Enter" && nextButtonRef?.current) {
            event.preventDefault();
            nextButtonRef.current.click();
        }
    };



    const [viewMode, setViewMode] = useState("grid"); // 'grid' hoặc 'list'





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
                                    name="search"
                                    value={filters.search} 
                                    onChange={handleFilterChange}
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

                    <div className="hero-section">

                    </div>

                    <h2 class="h2 mt-5 text-center">Chia sẻ tri thức</h2>
                    <div className="d-flex justify-content-end">

                        <div className="d-flex justify-content-between">
                            <div class="d-flex justify-content-end mb-3 me-2">
                                <button className={`btn btn-secondary me-2 bg-transparent`}>
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>

                            </div>
                            <div class="d-flex justify-content-end mb-3 me-2">
                                <select className="form-select w-auto" name="dateFilter" value={filters.dateFilter} onChange={handleFilterChange}>
                                    <option value="">Tất cả</option>
                                    <option value="7">7 ngày qua</option>
                                    <option value="30">30 ngày qua</option>
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
                                    <select class="form-select" name="location" value={filters.location} onChange={handleFilterChange}>
                                        <option value="">Chọn vị trí</option>
                                        {provinces.map((province) => (
                                            <option key={province.id} value={province.full_name}>{province.full_name}</option>
                                        ))}
                                    </select>

                                </div>
                                <h2 class="h5 mt-3">Thể loại</h2>
                                <div class="d-flex">
                                    <select className="form-select" name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
                                        <option value="">Tất cả</option>
                                        {categoryBooks.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.nameCategory}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <h2 class="h5 mt-3">Tình trạng</h2>
                                <div class="d-flex">
                                    <select className="form-select" name="condition" value={filters.condition} onChange={handleFilterChange}>
                                        <option value="">Tất cả</option>
                                        <option value="new-unused">Mới - Chưa sử dụng</option>
                                        <option value="new-used">Mới - Đã sử dụng (ít)</option>
                                        <option value="old-intact">Cũ - Còn nguyên vẹn</option>
                                        <option value="old-damaged">Cũ - Không còn nguyên vẹn</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary border-2 mt-3" onClick={handleFilterReset}>Xóa bộ lọc</button>
                            </div>
                        </div>
                        <div className="col-lg-9 mt-3">
                            <div className="row g-3">
                                <div className={`row ${viewMode === "grid" ? "g-3" : ""}`}>
                                    {exchangeBooks.length > 0 ? (

                                        exchangeBooks.map((book) => (
                                            <div key={book?._id}
                                                className={`mt-2 ${viewMode === "grid" ? "col-md-6" : "col-12"}`}
                                                onClick={() => handleClickPost(book?._id)}
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
                                                            src={book?.images[0]}
                                                            className="img-fluid rounded"
                                                            width="100"
                                                            height="100"
                                                            alt={book?.title}
                                                            style={{
                                                                objectFit: "cover",
                                                                borderRadius: "8px"
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex-grow-1">
                                                        <h3 className={`h6 text-truncate text-danger`} style={{ maxWidth: viewMode === "grid" ? "200px" : "" }}>{book.title}</h3>
                                                        <p className="text-muted mb-1">Ngày đăng: {new Date(book?.createdAt).toLocaleDateString('vi-VN')}</p>
                                                        <p className="text-muted"><i className="fa fa-map-marker-alt text-primary"></i> {book?.location}</p>
                                                    </div>

                                                    <i className="far fa-heart ms-auto text-secondary"></i>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center">Không tìm thấy sách phù hợp.</p>
                                    )}
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        size="large"

                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {user && (
                    <div className={`chat-box  shadow rounded ${animate ? 'slide-in-right' : ''} ${isChatBoxExpanded ? '' : 'collapsed'}`} style={{ transition: "transform 0.3s ease, width 0.5s ease", cursor: 'pointer' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div className="chat-content"
                        >
                            <div className="text-center" onClick={toggleChatBox}>
                                <button className="btn" onClick={toggleChatBox}>
                                    {isChatBoxExpanded ? <i class="fa-solid fa-x text-danger"></i> : <i class="fa-solid fa-list text-primary"></i>}
                                </button>
                            </div>
                            {isChatBoxExpanded && (
                                <>
                                    <Link to={`/user-profile/${user?._id}`}>
                                        <div className="option-exchange mb-2">
                                            <i className="fa fa-book me-2"></i>
                                            <span className="fs-6">Bài đăng của tôi</span>
                                        </div>
                                    </Link>
                                    <hr />
                                    <Link to='/post-request'>
                                        <div className="option-exchange mb-2">
                                            <i className="fa fa-paper-plane me-2"></i>
                                            <span className="fs-6">Bài đăng đã gửi</span>
                                        </div>
                                    </Link>
                                    <hr />
                                    <Link to='/my-exchange'>
                                        <div className="option-exchange mb-2">
                                            <i className="fa fa-history me-2"></i>
                                            <span className="fs-6">Giao dịch của tôi</span>
                                        </div>
                                    </Link>
                                    <hr />
                                    <div className="option-exchange mb-2">
                                        <i className="fa fa-star me-2"></i>
                                        <span className="fs-6">Tổng điểm</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <ToastContainer />

            {showModal && (
                <PostForm handleCloseModal={handleCloseModal} />
            )}
        </div>
    );
}

export default HomeExchange;
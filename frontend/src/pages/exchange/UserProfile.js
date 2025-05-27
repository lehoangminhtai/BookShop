import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getBookExchangesAvailableByUser, getBookExchangesByUser } from "../../services/exchange/bookExchangeService";
import { getUser } from "../../services/accountService";
import { countUserExchanges } from "../../services/exchange/bookExchangeService";
import { getListCategoryBooks } from "../../services/exchange/bookExchangeService";
import { getPointHistoryByUserSer } from "../../services/exchange/pointHistoryService";
import { getReviewsByReviewedUser } from '../../services/exchange/userReviewService';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useStateContext } from "../../context/UserContext";
//store
import { useChatStore } from '../../store/useChatStore';

const UserProfile = () => {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [categories, setCategories] = useState([]);
    const [completedExchanges, setCompletedExchanges] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [selectedPointType, setSelectedPointType] = useState(null);
    const [pointHistory, setPointHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const navigate = useNavigate();

    const { user: currentUser } = useStateContext();

    const { setSelectedUser } = useChatStore();

    const [reviewsData, setReviewsData] = useState({
        averageRating: 0,
        ratingCounts: [0, 0, 0, 0, 0],
        reviews: [],
    });

    const [filters, setFilters] = useState({
        categoryId: "",
        status: "",
    });
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchReviews = async () => {
        try {
            const response = await getReviewsByReviewedUser(currentUser?._id);
            console.log('Response fetching reviews:', response);
            setReviewsData(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const { averageRating, ratingCounts, reviews } = reviewsData;

    const fetchPosts = async (filters = {}) => {

        let response;
        if (currentUser?._id === userId) {
            const params = new URLSearchParams({
                ...filters,
            });
            response = await getBookExchangesByUser(userId, params.toString());
        } else {
            response = await getBookExchangesAvailableByUser(userId, filters.categoryId);
        }
        console.log(response);
        if (response.data.success) {
            setPosts(response.data.bookExchanges);
        } else {
            setPosts([]);
            console.log("Failed to fetch posts: ", response.data.message);
        }
    };
    const fetchUser = async () => {
        const response = await getUser(userId);
        console.log(response);
        if (response.data.success) {
            setUser(response.data.user);
        } else {
            console.log("Failed to fetch user: ", response.data.message);
        }
    }
    const fetchCompletedExchanges = async () => {
        const response = await countUserExchanges(userId);
        console.log(response);
        if (response.data.success) {
            setCompletedExchanges(response.data.totalExchanges);
            setTotalPosts(response.data.totalPosts);
        } else {
            console.log("Failed to fetch completed exchanges: ", response.data.message);
        }
    }

    const fetchCategories = async () => {
        const response = await getListCategoryBooks();
        if (response) {
            setCategories(response.data);
        } else {
            console.error('Failed to fetch categories');
        }
    };

    const fetchPointHistory = async () => {
        const response = await getPointHistoryByUserSer(userId, selectedPointType);
        console.log('Point history response:', response);
        if (response.data.success) {
            setPointHistory(response.data.pointHistory);
        } else {
            console.log("Failed to fetch point history: ", response.data.message);
        }
    }

    const handleClickChatButton = () => {
        if (currentUser) {
            setSelectedUser(currentUser._id);
            navigate(`/exchange/chat`);
        } else {
            navigate('/auth?redirect=/exchange-post-detail/${bookExchangeId}`, { replace: true });');
        }
    }

    useEffect(() => {
        fetchPosts(filters);
        fetchUser();
        fetchCompletedExchanges();
        fetchReviews();
    }, [userId]);

    useEffect(() => {
        fetchPosts(filters);
    }, [userId, filters]);




    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPointHistory();
    }, [userId, selectedPointType]);

    const handleClickPost = (postId) => {
        navigate(`/exchange-post-detail/${postId}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="status-badge status-pending">⏳ Chưa được duyệt</span>;
            case "available":
                return <span className="status-badge status-pending">⏳ Đang đợi trao đổi</span>;
            case "processing":
                return <span className="status-badge status-processing">🔄 Đang trao đổi</span>;
            case "completed":
                return <span className="status-badge status-completed">✅ Đã đổi</span>;
            default:
                return null;
        }
    };


    return (
        <div className="container py-5">
            <div className="container-fluid page-header py-2 bg-primary">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                        {/* Thông tin người dùng */}
                        <div className="user-profile d-flex align-items-center text-decoration-none mb-2">
                            <img
                                alt="user-image"
                                className="rounded-circle me-2"
                                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                src={user?.image}
                            />
                            <span className="text-light fs-4 fw-bold" style={{ cursor: "pointer" }}>
                                {user?.fullName}
                            </span>
                        </div>

                        {/* Thống kê */}
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center me-4">
                                <div className="d-flex align-items-center">
                                    <div className="me-2">
                                        <span className="fw-bold text-light">{averageRating}</span>
                                    </div>
                                    <div className="star-rating" style={{ fontSize: '1rem' }}>
                                        {[...Array(5)].map((_, index) => {
                                            const filled = index + 1 <= Math.floor(averageRating);
                                            const half = index + 0.5 === Math.round(averageRating * 2) / 2;

                                            return (
                                                <i
                                                    key={index}
                                                    className={`bi ${filled
                                                        ? 'bi-star-fill'
                                                        : half
                                                            ? 'bi-star-half'
                                                            : 'bi-star'
                                                        } text-warning`}
                                                ></i>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center me-4">
                                <span className="text-light me-1">{completedExchanges}</span>
                                <span className="text-light">Lượt trao đổi</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="text-light me-1">{totalPosts}</span>
                                <span className="text-light">Bài Đăng</span>
                            </div>
                        </div>
                    </div>

                    {currentUser?._id !== userId ? (
                        <>
                            <button className='btn btn-light d-flex align-items-center align-self-center'
                                onClick={() => handleClickChatButton()}
                            ><span className='me-2'>Nhắn tin</span>
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </>


                    ) : (<></>)}
                </div>
            </div>
            {currentUser?._id === userId ? (
                <>
                    <div className="d-flex  mb-3">
                        <ul className="nav nav-tabs mb-4 w-100 d-flex">
                            <li className="nav-item flex-fill text-center">
                                <button
                                    className={`nav-link w-100 h-100 fs-5 fw-bold ${activeTab === "posts" ? "active fw-bold text-primary" : ""}`}
                                    onClick={() => setActiveTab("posts")}
                                >
                                    Danh sách bài đăng
                                </button>
                            </li>
                            <li className="nav-item flex-fill text-center">
                                <button
                                    className={`nav-link w-100 h-100 fs-5 fw-bold ${activeTab === "points" ? "active fw-bold text-primary" : ""}`}
                                    onClick={() => setActiveTab("points")}
                                >
                                    Lịch sử điểm
                                </button>
                            </li>
                        </ul>
                    </div>

                </>
            ) : (
                <h2 className="h2 text-center mt-5 mb-5 text-primary">
                    -- <span>Danh sách bài đăng</span> --
                </h2>
            )}
            {activeTab === "posts" ? (
                <>
                    <div className="d-flex justify-content-end">
                        <div className=" bg-white shadow  mb-3 rounded p-2">
                            <div className="d-flex gap-2">
                                {currentUser?._id === userId ? (
                                    <>
                                        <select className="form-select"
                                            onChange={handleFilterChange}
                                            name="status"
                                            value={filters.status}
                                            style={{ minWidth: '200px' }}
                                        >
                                            <option value="">Trạng thái</option>
                                            <option value="pending">⏳ Chưa được duyệt</option>
                                            <option value="available">⏳ Đang đợi trao đổi</option>
                                            <option value="processing">🔄 Đang trao đổi</option>
                                            <option value="completed">✅ Đã đổi</option>

                                        </select>
                                    </>
                                ) : (<></>)}
                                <select className="form-select" style={{ minWidth: '280px' }} name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
                                    <option value="">Thể loại</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.nameCategory}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {posts.length === 0 ? (
                            <div className="col-12 text-center mt-5">
                                <p className="text-center text-muted">Bạn chưa có bài đăng nào.</p>
                            </div>
                        ) : (
                            
                                posts.map((post) => (
                                    <div key={post?._id} className="col-md-6 col-lg-4 mb-4">
                                        <div
                                            className="card p-3 shadow-lg card-custom"
                                            onClick={() => handleClickPost(post?._id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="d-flex">
                                                <img
                                                    src={post?.images[0]}
                                                    className="img-fluid card-img-custom me-3"
                                                    alt={post?.title}
                                                />
                                                <div className="flex-grow-1">
                                                    <h3 className="h6 text-truncate-2 fw-bold text-dark">
                                                        {post?.title}
                                                    </h3>
                                                    <p className="text-muted mb-1">
                                                        📅 Ngày đăng: {new Date(post?.createdAt).toLocaleDateString('vi-VN')}
                                                    </p>

                                                    <div className="mt-2 d-flex justify-content-between align-items-center">
                                                        {getStatusBadge(post?.status)}
                                                        <span className="text-warning fw-bold fs-5">
                                                            {post?.creditPoints} điểm
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        
                    </div>
                </>
            ) : (
                <>
                    <div className="container mt-3">
                        {/* Thẻ điểm hiện tại */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="d-flex align-items-center" style={{ flex: 1 }}>
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
                                        <div className="ml-3 ms-2">
                                            <div className="d-flex align-items-center">
                                                <span className="fs-5 fw-bold text-warning">{currentUser.grade}</span>
                                                <span className="text-warning fw-bold ml-1 fs-5 ms-1"> điểm đang có</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right" >
                                        <button
                                            type="button"
                                            className="btn btn-link text-warning"
                                            title="Bạn có thể mua hàng hoặc thực hiện các đánh giá để có thêm điểm nhé!"
                                        >
                                            Nhận thêm điểm!
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="">
                            <div className="row">
                                <div className="col">
                                    <div className="nav nav-tabs ">
                                        <button
                                            className={`nav-link fw-bold ${selectedPointType === null || selectedPointType === '' ? "active fw-bold text-primary" : ""}`}
                                            onClick={() => setSelectedPointType('')}
                                        >
                                            TẤT CẢ LỊCH SỬ
                                        </button>
                                        <button
                                            className={`nav-link fw-bold ${selectedPointType === 'earn' ? "active fw-bold text-primary" : ""}`}
                                            onClick={() => setSelectedPointType('earn')}
                                        >
                                            ĐÃ NHẬN
                                        </button>
                                        <button
                                            className={`nav-link fw-bold ${selectedPointType === 'spend' ? "active fw-bold text-primary" : ""}`}
                                            onClick={() => setSelectedPointType('spend')}
                                        >
                                            ĐÃ DÙNG
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="tab-content">
                                <div className="tab-pane fade show active">
                                    {pointHistory.length === 0 ? (
                                        <p className="text-center mt-3 text-muted">Không có lịch sử điểm.</p>
                                    ) : (
                                        pointHistory.map(({ _id, points, type, description, createdAt }) => (
                                            <div key={_id} className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="d-flex justify-content-center align-items-center"
                                                            style={{
                                                                width: '64px',
                                                                height: '64px',
                                                                borderRadius: '50%',
                                                                backgroundColor: type === 'spend' ? '#e9ecef' : '#fff3cd',
                                                                color: type === 'spend' ? '#6c757d' : '#f0ad4e',
                                                                fontSize: '32px',
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-coins"></i>
                                                        </div>
                                                        <div style={{ flex: 0.6 }}>
                                                            <div className="font-weight-bold ms-2">
                                                                {type === 'earn' ? 'Nhận điểm' : 'Dùng điểm'}
                                                            </div>
                                                            <div className="text-muted small ms-2">{description || '-'}</div>
                                                            <div className="text-muted small ms-2">{new Date(createdAt).toLocaleString('vi-VN')}</div>
                                                        </div>

                                                        <div className={`ms-auto text-right fw-bold fs-5 ms-2 ${type === 'earn' ? 'text-warning' : ''}`}>
                                                            {type === 'earn' ? `+${points}` : `-${points}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
                <div className="bg-white p-5 rounded shadow w-100" >
                    <div>
                        <h3>Đánh giá</h3>

                        {/* Hiển thị số sao trung bình */}
                        <div className="d-flex align-items-center mb-3 mt-3">
                            <div className="me-2">
                                <span className="fw-bold fs-4">{averageRating}</span>
                            </div>
                            <div className="star-rating" style={{ fontSize: '1.5rem' }}>
                                {[...Array(5)].map((_, index) => {
                                    const filled = index + 1 <= Math.floor(averageRating);
                                    const half = index + 0.5 === Math.round(averageRating * 2) / 2;

                                    return (
                                        <i
                                            key={index}
                                            className={`bi ${filled
                                                ? 'bi-star-fill'
                                                : half
                                                    ? 'bi-star-half'
                                                    : 'bi-star'
                                                } text-warning`}
                                        ></i>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Thống kê số lượng sao */}
                        <div className="mb-4">
                            {[5, 4, 3, 2, 1].map((star, index) => (
                                <div key={star} className="d-flex align-items-center">
                                    <span className="me-2">{star} sao:</span>
                                    <div
                                        className="progress flex-grow-1"
                                        style={{ height: '1rem', marginRight: '1rem' }}
                                    >
                                        <div
                                            className="progress-bar bg-warning"
                                            role="progressbar"
                                            style={{
                                                width: `${(ratingCounts[star - 1] / reviews.length) * 100 || 0}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span>{ratingCounts[star - 1]}</span>
                                </div>
                            ))}
                        </div>

                        {/* Hiển thị danh sách đánh giá */}
                        <div>
                            {reviews.map((review) => (
                                <div key={review._id} className="mb-4 border-bottom pb-2">
                                    <div className="d-flex align-items-center mb-2">
                                        <img
                                            src={review.reviewerId.image}
                                            alt="avatar"
                                            className="rounded-circle me-2"
                                            style={{ width: '40px', height: '40px' }}
                                        />
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold">{review.reviewerId.fullName}</span>
                                            <small className="text-muted">
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="star-rating mb-1">
                                        {[...Array(5)].map((_, index) => (
                                            <i
                                                key={index}
                                                className={`bi ${index < review.rating ? 'bi-star-fill' : 'bi-star'
                                                    } text-warning`}
                                            ></i>
                                        ))}

                                    </div>
                                    <p>{review.comment}</p>
                                    {review.images && review.images.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                            {review.images.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`review-img-${index}`}
                                                    className="rounded"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
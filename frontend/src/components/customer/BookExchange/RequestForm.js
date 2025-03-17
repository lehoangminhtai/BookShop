import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


//context
import { useStateContext } from "../../../context/UserContext";
//services
import { getBookExchangesByUser } from "../../../services/exchange/bookExchangeService";
import { getListCategoryBooks } from "../../../services/categoryBookService";

const RequestForm = ({ handleCloseModal, availablePoints, onSubmitRequest }) => {
    const [openProgress, setOpenProgress] = useState(false);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeTab, setActiveTab] = useState("points"); // 'points' hoặc 'post'
    const [selectedPost, setSelectedPost] = useState(null);
    const { user } = useStateContext();
    const userId = user?._id;

    const fetchPosts = async () => {
        try {
            const response = await getBookExchangesByUser(userId);
            if (response.data.success) {
                setPosts(response.data.bookExchanges);
            }
        } catch (error) {
            console.log("Failed to fetch posts: ", error);
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

    useEffect(() => {
        fetchPosts();
        fetchCategories()
    }, [user._id]);

    const handleCloseProgress = () => {
        setOpenProgress(false);
    };
    const handleOpenProgress = () => {
        setOpenProgress(true);
    };

    const handleClose = () => {
        handleCloseModal();
    };

    const handleSubmit = () => {
        if (activeTab === "points") {
            onSubmitRequest({ type: "points", points: availablePoints });
        } else if (activeTab === "post") {
            if (!selectedPost) {
                toast.error("Vui lòng chọn bài đăng của bạn để trao đổi!");
                return;
            }
            onSubmitRequest({ type: "post", postId: selectedPost });
        }
        handleClose();
    };

    //setting Slider
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
        <div className="modal show fade" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Gửi yêu cầu trao đổi</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Nav Tabs */}
                        <ul className="nav nav-tabs" id="exchangeRequestTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "points" ? "active" : ""}`}
                                    type="button"
                                    role="tab"
                                    onClick={() => setActiveTab("points")}
                                >
                                    Trao đổi bằng điểm
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "post" ? "active" : ""}`}
                                    type="button"
                                    role="tab"
                                    onClick={() => setActiveTab("post")}
                                >
                                    Trao đổi bằng bài đăng
                                </button>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content mt-3">
                            {activeTab === "points" && (
                                <div className="tab-pane fade show active">
                                    <div className="p-3 bg-light rounded shadow-sm">

                                        <h1 className="h1 text-danger fw-bold">
                                            {user?.grade} đ

                                        </h1>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="usePointsCheckbox"
                                            //checked={usePoints}
                                            //onChange={(e) => setUsePoints(e.target.checked)}
                                            />
                                            <label className="form-check-label text-dark" htmlFor="usePointsCheckbox">
                                                Sử dụng {availablePoints} điểm để trao đổi sách
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            )}
                            {activeTab === "post" && (
                                <div className="tab-pane fade show active">
                                    <div className="d-flex align-items-center">
                                        <p className="text-dark me-2 fw-bold">Lọc:</p>
                                   
                                    <Autocomplete
                                        disablePortal
                                        options={categories}
                                        getOptionLabel={(option) => option.nameCategory}
                                        sx={{ width: 300 }}
                                        onChange={(event, newValue) => setSelectedCategory(newValue)} // Lưu toàn bộ object
                                        renderInput={(params) => <TextField {...params} label="Loại sách" />}
                                    />
                                     </div>
                                    <div className="d-flex flex-wrap mt-3 table-responsive">

                                        {posts && posts.length > 0 ? (
                                            posts.map((post) => (
                                                <div
                                                    key={post._id}
                                                    className={`card m-2  ${selectedPost === post._id ? "border-primary" : ""
                                                        }`}
                                                    style={{ width: "10rem", cursor: "pointer" }}
                                                    onClick={() => setSelectedPost(post._id)}
                                                >
                                                    <img
                                                        src={post?.images[0]}
                                                        className="card-img-top"
                                                        alt={post.title}
                                                        style={{
                                                            height: "10rem",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    <div className="card-body p-2">
                                                        <h6
                                                            className="card-title text-truncate"
                                                            style={{ fontSize: "0.9rem" }}
                                                        >
                                                            {post.title}
                                                        </h6>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted">Bạn chưa có bài đăng nào.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn"
                            onClick={handleClose}
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Gửi yêu cầu
                            <SendIcon className="ms-2" />
                        </button>
                    </div>
                </div>
            </div>
            {openProgress && (
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openProgress}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </div>
    );
};

export default RequestForm;

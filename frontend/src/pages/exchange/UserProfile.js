import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getBookExchangesAvailableByUser } from "../../services/exchange/bookExchangeService";
import { getUser } from "../../services/accountService";
import { countUserExchanges } from "../../services/exchange/bookExchangeService";
import ReviewUser from "../../components/customer/BookExchange/ReviewUser";
import { getListCategoryBooks } from "../../services/categoryBookService";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const UserProfile = () => {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [completedExchanges, setCompletedExchanges] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const navigate = useNavigate();

    const fetchPosts = async () => {

        const response = await getBookExchangesAvailableByUser(userId, selectedCategory);
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

    useEffect(() => {
        fetchPosts();
        fetchUser();
        fetchCompletedExchanges();
    }, [userId]);

    useEffect(() => {
        fetchPosts();
    }, [userId, selectedCategory]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleClickPost = (postId) => {
        navigate(`/exchange-post-detail/${postId}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "available":
                return <span className="status-badge status-pending">⏳ Đang đợi trao đổi</span>;
            case "processing":
                return <span className="status-badge status-processing">🔄 Đang xử lý</span>;
            case "completed":
                return <span className="status-badge status-completed">✅ Đã đổi</span>;
            default:
                return null;
        }
    };

    const handleChange = async (selectedOption) => {
        setSelectedCategory(selectedOption ? selectedOption._id : null);
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
                                <span className="text-warning h5 me-1">4.9</span>
                                <i className="fas fa-star text-warning"></i>
                                <i className="fas fa-star text-warning"></i>
                                <i className="fas fa-star text-warning"></i>
                                <i className="fas fa-star text-warning"></i>
                                <i className="fas fa-star text-warning"></i>
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

                    <button className="btn btn-light d-flex align-items-center align-self-center">
                        <span className='me-2'>Nhắn tin</span>
                        <i className="fas fa-paper-plane me-2"></i>
                    </button>
                </div>
            </div>

            <h2 className="h2 text-center mt-5 mb-5 text-primary">-- <span className=""> Danh sách bài đăng </span> --</h2>
            <div className="d-flex justify-content-end">
                <div className=" bg-white shadow  mb-3 rounded" style={{ width: "300px" }}>

                    <Autocomplete
                        disablePortal
                        options={categories}
                        getOptionLabel={(option) => option.nameCategory}
                        sx={{ width: 300 }}
                        onChange={(event, value) => handleChange(value)}
                        renderInput={(params) => <TextField {...params} label="Loại sách" />}
                    />
                </div>
            </div>
            <div className="row">
                {posts.map((post) => (
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

                                    <div className="mt-2">{getStatusBadge(post?.status)}</div>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
                <div className="bg-white p-5 rounded shadow w-100" >
                    <ReviewUser userId={userId} />
                </div>
            </div>
        </div>
    )
}

export default UserProfile
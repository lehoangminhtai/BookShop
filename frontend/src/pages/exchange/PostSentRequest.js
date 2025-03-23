import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useStateContext } from "../../context/UserContext";
import { getRequestsByRequesterSer } from "../../services/exchange/exchangeRequestService";
import { getBookExchangeSer } from "../../services/exchange/bookExchangeService";
//scss
import '../../css/user/MyPost.scss'

const PostSentRequest = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useStateContext();
    const userId = user?._id;
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const response = await getRequestsByRequesterSer(userId);
            if (response.data.success) {
                const requests = response.data.requests;

                const postsRequest = await Promise.all(
                    requests.map(async (request) => {
                        const bookRequested = await getBookExchangeSer(request.bookRequestedId);

                        let exchangeBook = null;

                        if (request.exchangeMethod === "book") {
                            exchangeBook = await getBookExchangeSer(request.exchangeBookId);
                        }
                        return {
                            id: request._id,
                            date: request.createdAt,
                            status: request.status,
                            exchangeMethod: request.exchangeMethod,
                            bookRequested: bookRequested.data.bookExchange,
                            exchangeBook: exchangeBook ? exchangeBook.data.bookExchange : null,
                        }

                    })
                );
                setPosts(postsRequest);
                console.log("Posts: ", postsRequest);
            }
        } catch (error) {
            console.log("Failed to fetch posts: ", error);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    const handleClickPost = (postId) => {
        navigate(`/exchange-post-detail/${postId}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="status-badge status-pending">⏳ Chưa phản hồi</span>;
            case "approved":
                return <span className="status-badge status-processing">🔄 Đã được chấp nhận</span>;
            case "completed":
                return <span className="status-badge status-completed">✅ Hoàn Thành</span>;
            default:
                return null;
        }
    };

    return (
        <div className="container py-5">
            <div class="container-fluid page-header py-5 bg-primary">
                <h1 class="text-center text-white display-6">Trao đổi <span>Sách 📚</span></h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
                    <li class="breadcrumb-item"><a href="#">Trao đổi sách</a></li>
                    <li class="breadcrumb-item active text-white">Yêu cầu</li>
                </ol>
            </div>
            <h2 className="h2 text-center mt-5 mb-5 text-primary">-- <span className=""> Danh sách yêu cầu </span> --</h2>
            <div className="row">
                {posts.map((post) => (

                    <div key={post?._id} className="col-md-6 col-lg-4 mb-4">
                        <div
                            className="card p-3 shadow-lg card-custom "

                            style={{ cursor: "pointer" }}
                        >
                            <div className="d-flex align-items-start">
                                <div className="flex-shrink-0 me-2"
                                    onClick={() => handleClickPost(post.bookRequested?._id)}>
                                    <img
                                        src={post.bookRequested?.images[0] || "/placeholder.jpg"}
                                        className="img-fluid card-img-custom "
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                        alt={post.bookRequested?.title || "Không có tiêu đề"}
                                    />
                                </div>

                                <div className="flex-grow-1">

                                    <h6 className="fw-bold mb-1"
                                        onClick={() => handleClickPost(post.bookRequested?._id)}
                                        onMouseEnter={(e) => e.target.style.color = "#007bff"}
                                        onMouseLeave={(e) => e.target.style.color = "#333"}>
                                        {post.bookRequested?.title
                                            ? post.bookRequested.title.length > 30
                                                ? post.bookRequested.title.substring(0, 30) + "..."
                                                : post.bookRequested.title
                                            : "Không có tiêu đề"}

                                    </h6>

                                    {/* Nếu có sách trao đổi, hiển thị bên dưới */}
                                    {post.exchangeMethod === "book" && post.exchangeBook ? (
                                        <div className="d-flex align-items-center p-2 bg-light rounded mt-2"
                                            onClick={() => handleClickPost(post.exchangeBook?._id)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "scale(1.05)"; // Hiệu ứng phóng to nhẹ
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "scale(1)"; // Kích thước về ban đầu
                                            }}
                                            >
                                            <img
                                                src={post.exchangeBook.images[0] || "/placeholder.jpg"}
                                                className=" me-1 "
                                                style={{ width: "40px", height: "45px", objectFit: "cover" }}
                                                alt={post.exchangeBook.title}
                                            />
                                            <span className="text-muted small">
                                                {post.exchangeBook?.title
                                                    ? post.exchangeBook.title.length > 25
                                                        ? post.exchangeBook.title.substring(0, 25) + "..."
                                                        : post.exchangeBook.title
                                                    : "Không có tiêu đề"}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="fw-bold text-warning d-flex align-items-center mt-3 mb-3">
                                            <span className="me-2 fs-4">{post.bookRequested.creditPoints}</span>
                                            <i className="fas fa-coins fs-5"></i>
                                        </div>
                                    )}


                                    <p className="text-muted mb-1">
                                        📅 Ngày yêu cầu: {new Date(post.date).toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="mt-2">{getStatusBadge(post.status)}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostSentRequest;
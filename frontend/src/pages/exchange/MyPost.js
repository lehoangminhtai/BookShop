import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//scss
import '../../css/user/MyPost.scss'

const MyPosts = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "Sách lập trình JavaScript",
            image: "https://m.media-amazon.com/images/I/71787OImkEL.jpg",
            date: "2024-02-10",
            location: "Hồ Chí Minh",
            status: "pending"
        },
        {
            id: 2,
            title: "Bộ truyện Harry Potter",
            image: "https://img.posterstore.com/zoom/wb0001-8harrypotter-sorcerersstone50x70.jpg",
            date: "2024-02-08",
            location: "Hà Nội",
            status: "processing"
        },
        {
            id: 3,
            title: "Sách kinh tế học vĩ mô",
            image: "https://hvpnvn.edu.vn/wp-content/uploads/sites/63/2024/02/26102016120000-0001.jpg",
            date: "2024-02-06",
            location: "Đà Nẵng",
            status: "completed"
        }
    ]);

    const navigate = useNavigate();

    const handleClickPost = (postId) => {
        navigate(`/exchange-post-detail/${postId}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="status-badge status-pending">⏳ Đang đợi trao đổi</span>;
            case "processing":
                return <span className="status-badge status-processing">🔄 Đang xử lý</span>;
            case "completed":
                return <span className="status-badge status-completed">✅ Đã đổi</span>;
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
                    <li class="breadcrumb-item active text-white">Bài đăng</li>
                </ol>
            </div>
            <h2 className="h2 text-center mt-5 mb-5 text-primary">-- <span className=""> Bài đăng của tôi </span> --</h2>
            <div className="row">
                {posts.map((post) => (
                    <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                        <div
                            className="card p-3 shadow-lg card-custom"
                            onClick={() => handleClickPost(post.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="d-flex">
                                <img
                                    src={post.image}
                                    className="img-fluid card-img-custom me-3"
                                    alt={post.title}
                                />
                                <div className="flex-grow-1">
                                    <h3 className="h6 text-truncate-2 fw-bold text-dark">
                                        {post.title}
                                    </h3>
                                    <p className="text-muted mb-1">
                                        📅 Ngày đăng: {post.date}
                                    </p>
                                    <p className="text-muted">
                                        📍 {post.location}
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

export default MyPosts;

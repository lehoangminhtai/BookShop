import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//context
import { useStateContext } from "../../context/UserContext";
//scss
import '../../css/user/MyPost.scss'
//services
import { getBookExchangesByUser } from "../../services/exchange/bookExchangeService";

const MyPosts = () => {
    
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    const { user } = useStateContext();
    const userId = user?._id;

    const fetchPosts = async () => {
        try {
            const response = await getBookExchangesByUser(userId);
            if(response.data.success){
                setPosts(response.data.bookExchanges);
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
                return <span className="status-badge status-pending">⏳ Đang chờ duyệt</span>;
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
        </div>
    );
};

export default MyPosts;

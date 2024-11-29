import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerSidebar from './CustomerSidebar';
import { useStateContext } from '../../context/UserContext';

const ReviewsList = () => {
    const { user } = useStateContext(); // Lấy thông tin user từ context

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user._id) { // Kiểm tra nếu user tồn tại và có _id
            const fetchReviews = async () => {
                try {
                    const response = await axios.get(`/api/reviews/account/${user._id}`);
                    setReviews(response.data.reviews);
                } catch (err) {
                    setError(err.response?.data?.message || 'Không thể lấy danh sách đánh giá');
                } finally {
                    setLoading(false);
                }
            };

            fetchReviews();
        } else {
            setLoading(false);
            setError('Bạn cần đăng nhập để xem danh sách đánh giá');
        }
    }, [user]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="auth-container">
            <div className="container p-4">
                <div className="d-flex">
                    <CustomerSidebar />
                    <div className="container mt-4">
                        {reviews.length === 0 ? (
                            <p className="text-muted text-center">Chưa có đánh giá nào.</p>
                        ) : (
                            <div className="list-group">
                                {reviews.map((review) => (
                                    <div key={review._id} className="list-group-item card shadow-sm border-0 mb-4 mt-4 bg-white shadow-sm">
                                        {/* Thông tin người dùng */}
                                        <div className="d-flex align-items-center mb-3">
                                            <img
                                                src={review.userId?.image}
                                                alt="User Avatar"
                                                className="rounded-circle"
                                                width="40"
                                                height="40"
                                            />
                                            <div className="ms-3">
                                                <h5 className="mb-1">{review.userId?.fullName}</h5>
                                                <div className="mb-1">
                                                    <div className="rating">
                                                        {Array.from({ length: 5 }, (_, i) =>
                                                            i < Math.floor(review.rating) ? (
                                                                <i key={i} className="bi bi-star-fill text-warning"></i>
                                                            ) : i < review.rating ? (
                                                                <i key={i} className="bi bi-star-half text-warning"></i>
                                                            ) : (
                                                                <i key={i} className="bi bi-star text-muted"></i>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    {new Date(review.createdAt).toLocaleTimeString()} -{' '}
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                        <div className='ms-5'>
                                            {/* Nội dung đánh giá */}
                                            <p className="mb-4 ms-2">{review.comment}</p>
                                            {/* Thông tin sách */}
                                            <div className="d-flex ms-2 align-items-center">
                                                <a href={`/chi-tiet/${review.bookId?._id}`}>
                                                    <img
                                                        src={review.bookId?.images[0]}
                                                        alt="Book"
                                                        className="rounded"
                                                        width="70"
                                                        height="100"
                                                    />
                                                </a>

                                                <div className="ms-3">
                                                    <h6 className="mb-0">

                                                        <a href={`/chi-tiet/${review.bookId?._id}`} className="text-decoration-none">
                                                            {review.bookId?.title}
                                                        </a>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsList;
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createReview } from "../../services/reviewService";


const ReviewForm = ({ onClose, onSubmit, orderBooks, userId, orderId }) => {
    const [reviews, setReviews] = useState(
        orderBooks.map((book) => ({
            bookId: book.bookId._id,
            rating: 5,
            comment: "",
        }))
    );

    useEffect(() => {
        // Khóa scroll khi mở modal
        document.body.style.overflow = "hidden";
        return () => {
            console.log(orderBooks);
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleStarClick = (bookId, value) => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.bookId === bookId ? { ...review, rating: value } : review
            )
        );
    };

    const handleCommentChange = (bookId, value) => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.bookId === bookId ? { ...review, comment: value } : review
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewData = reviews.map(({ rating, comment, bookId }) => ({
            userId,
            bookId,
            orderId,
            rating,
            comment,
        }));
        let error = false;
        try {
            // Gửi từng đánh giá đến API
            for (const review of reviewData) {
                if (await createReview(review)) {
                    error = false
                }
                else {
                    error = true
                }
            }
            if (!error) {

                toast.success("Đánh giá đơn hàng thành công!", {
                    autoClose: 1000,
                    onClose: () => {
                        // Đảm bảo đóng modal sau khi thông báo đã hoàn thành
                        onClose();
                    }
                });
            }
            else{
                toast.success("Đánh giá đơn hàng thất bại");
            }

        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi đánh giá!", {
                autoClose: 1000,
            });
        }
    };

    return (

        <div className="container">
              <ToastContainer />
            <h4
                className="mb-4 text-center"
                style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
                <strong>Đánh giá đơn hàng</strong>
            </h4>

            <form onSubmit={handleSubmit}>
                {orderBooks.map((book, index) => (
                    <div key={index} className="mb-4">
                        <div className="d-flex mb-3">
                            <img
                                src={book.bookId.images[0]}
                                alt={book.bookId.title}
                                className="img-thumbnail me-3"
                                style={{ width: 100, height: 100, objectFit: "cover" }}
                            />
                            <div>
                                <h5>{book.bookId.title}</h5>
                                <h5 style={{ color: "gray" }}>Tác giả: {book.bookId.author}</h5>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="d-block">Đánh giá (sao):</label>
                            <div className="rating-stars d-flex align-items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={`bi bi-star${reviews.find((r) => r.bookId === book.bookId._id).rating >= star
                                            ? "-fill text-warning"
                                            : ""
                                            }`}
                                        style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                        onClick={() => handleStarClick(book.bookId._id, star)}
                                    ></i>
                                ))}
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label>Bình luận để nhận được 1 điểm:</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={reviews.find((r) => r.bookId === book.bookId._id).comment}
                                onChange={(e) =>
                                    handleCommentChange(book.bookId._id, e.target.value)
                                }
                                required
                            ></textarea>
                        </div>
                    </div>
                ))}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <button type="submit" className="btn btn-primary">
                        Gửi đánh giá
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </form>
          
        </div>

    );
};

export default ReviewForm;
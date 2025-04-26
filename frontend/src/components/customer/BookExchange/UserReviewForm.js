import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDropzone } from 'react-dropzone';
//service
import { createUserReview } from "../../../services/exchange/userReviewService";
import 'react-toastify/dist/ReactToastify.css';

const UserReviewForm = ({ onClose, onSubmit, reviewerId, reviewedUser, requestId }) => {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);

    const reviewedUserId = reviewedUser?._id || null;

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImages((prev) => [...prev, reader.result]);
        };
    };

    const onDrop = async (acceptedFiles) => {
        acceptedFiles.forEach((file) => setFileToBase(file));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
    });
    const handleStarClick = (value) => {
        setRating((rating)

        );
    };
    const handleCommentChange = (comment) => {
        setComment(comment);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.warning("Vui lòng chọn số sao.");
            return;
        }


        try {
            const res = await createUserReview({
                reviewerId,
                reviewedUserId,
                exchangeId: requestId,
                rating,
                comment,
                images,
            });

            toast.success("Đánh giá thành công!");
            onSubmit?.();
            onClose?.();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Lỗi khi gửi đánh giá");
        }
    };



    return (
        <div className="container">
            <ToastContainer />
            <h4 className="mb-4 text-center" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Đánh giá người dùng
            </h4>

            <form onSubmit={handleSubmit}>
                {/* Rating stars */}
                <div className="mb-3 text-center">
                    {[...Array(5)].map((_, index) => {
                        const star = index + 1;
                        return (
                            <i
                                key={index}
                                className={`fa-star fa-2x me-2 cursor-pointer fas ${star <= (hover || rating) ? "text-warning" : ""}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            />
                        );
                    })}
                </div>

                {/* Comment */}
                <div className="mb-3">
                    <label className="form-label">Thêm bình luận để nhận 1 điểm:</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Viết nhận xét của bạn..."
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-3">
                    <label className="form-label">Thêm hình ảnh để nhận 1 điểm:</label>
                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? "active-dropzone" : ""}`}
                        style={{
                            border: "2px dashed #007bff",
                            padding: "20px",
                            textAlign: "center",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? <p>Thả file vào đây...</p> : <p>Kéo & thả ảnh hoặc nhấn để chọn</p>}
                    </div>

                    {images.length > 0 && (
                        <div className="mt-2 d-flex flex-wrap gap-2">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="position-relative"
                                    style={{ width: "100px", height: "100px" }}
                                >
                                    <img
                                        src={img}
                                        alt={`Ảnh ${index}`}
                                        className="img-thumbnail"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-close position-absolute"
                                        aria-label="Xóa"
                                        onClick={() => {
                                            setImages(images.filter((_, i) => i !== index));
                                        }}
                                        style={{
                                            top: "0.2rem",
                                            right: "0.1rem",
                                            backgroundColor: "white",
                                            padding: "0.5px"
                                            
                                        }}
                                    />

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary me-2">Gửi đánh giá</button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default UserReviewForm;

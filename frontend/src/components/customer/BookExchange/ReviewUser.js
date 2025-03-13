import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewUser = ({ bookId }) => {
  const [reviewsData, setReviewsData] = useState({
    averageRating: 0,
    ratingCounts: [0, 0, 0, 0, 0],
    reviews: []
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/reviews/${bookId}`);
        setReviewsData(data);
      } catch (error) {
        console.error('Lỗi khi tải đánh giá:', error);
      }
    };

    fetchReviews();
  }, [bookId]);

  const { averageRating, ratingCounts, reviews } = reviewsData;

  return (
    <div>
      <h3>Đánh giá người dùng</h3>

      {/* Hiển thị số sao trung bình */}
      <div className="d-flex align-items-center mb-3">
        <div className="me-2">
          <span className="fw-bold fs-4">{averageRating}</span>
        </div>
        <div className="star-rating" style={{ fontSize: '1.5rem' }}>
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`bi ${
                index < Math.round(averageRating) ? 'bi-star-fill' : 'bi-star'
              } text-warning`}
            ></i>
          ))}
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
                  width: `${(ratingCounts[star-1] / reviews.length) * 100 || 0}%`
                }}
              ></div>
            </div>
            <span>{ratingCounts[star-1]}</span>
          </div>
        ))}
      </div>

      {/* Hiển thị danh sách đánh giá */}
      <div>
        {reviews.map((review) => (
          <div key={review._id} className="mb-4 border-bottom pb-2">
            <div className="d-flex align-items-center mb-2">
              <img
                src={review.userId.image}
                alt="avatar"
                className="rounded-circle me-2"
                style={{ width: '40px', height: '40px' }}
              />
              <span className="fw-bold">{review.userId.fullName}</span>
            </div>
            <div className="star-rating mb-1">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`bi ${
                    index < review.rating ? 'bi-star-fill' : 'bi-star'
                  } text-warning`}
                ></i>
              ))}
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewUser;
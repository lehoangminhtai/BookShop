import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../services/config';

const BookReviews = ({ bookId }) => {
  const [reviewsData, setReviewsData] = useState({
    averageRating: 0,
    ratingCounts: [0, 0, 0, 0, 0],
    reviews: []
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/reviews/${bookId}`);
        console.log('Response fetching reviews:', data);
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
      <h3 className="fs-5">Đánh giá</h3>

      {averageRating === 0 ? (
        <div className="mt-3">
          <p className="text-muted">Chưa có đánh giá nào.</p>
        </div>
      ) : (
        <>
          {/* Hiển thị số sao trung bình */}
          <div className="d-flex align-items-center mb-3">
            <div className="me-2">
              <span className="fw-bold fs-4">{averageRating}</span>
            </div>
            <div className="star-rating" style={{ fontSize: '1.5rem' }}>
              {[...Array(5)].map((_, index) => {
                const currentStar = index + 1;

                return (
                  <i
                    key={index}
                    className={`bi ${averageRating >= currentStar
                      ? 'bi-star-fill'
                      : averageRating >= currentStar - 0.5
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
                    src={review.userId.image}
                    alt="avatar"
                    className="rounded-circle me-2"
                    style={{ width: '40px', height: '40px' }}
                  />

                  <div className="d-flex flex-column">
                    <span className="fw-bold">{review.userId.fullName}</span>
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookReviews;
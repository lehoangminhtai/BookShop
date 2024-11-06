import { useEffect, useState } from "react";
import { useBookContext } from "../hooks/useBookContext";
import { useNavigate } from 'react-router-dom';

const BookDetail = ({ book }) => {
  const { dispatch } = useBookContext();
  const navigate = useNavigate();
  const [bookSale, setBookSale] = useState({ price: 0, discount: 0, status: 'available' });

  useEffect(() => {
    const fetchBookSaleDetails = async () => {
      const response = await fetch(`http://localhost:4000/api/bookSales/${book._id}`);
      const data = await response.json();

      if (response.ok) {
        setBookSale(data); // Cập nhật giá, giảm giá và trạng thái từ bookSaleModel
      }
    };

    fetchBookSaleDetails();
  }, [book._id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const priceDiscount = bookSale.price * (1 - bookSale.discount / 100);

  const handleProductClick = (id) => {
    navigate(`/chi-tiet/${id}`);
  };

  const handleAddToCart = () => {
    alert('add to cart');
  };

  return (
    <div className="tw-w-full tw-max-w-sm tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-dark:bg-gray-800 tw-dark:border-gray-700" onClick={() => handleProductClick(book._id)}>
      <div>
        <img
          src={book.images}
          alt={`Book image`}
          className="tw-w-full tw-rounded-lg"
          style={{ objectFit: 'cover', height: '200px' }}
        />
      </div>
      <div className="tw-px-5 tw-pb-5">
        <h5 className="tw-text-xl tw-font-semibold tw-tracking-tight tw-text-gray-900 tw-dark:text-white">
          {book.title}
        </h5>
        <p><strong>Tác giả:</strong> {book.author}</p>
      
        <div className="tw-flex tw-items-center tw-mt-2.5 tw-mb-5"></div>
        <div className="d-flex align-items-center mb-3">
          <span className="fs-3 text-danger fw-bold">{formatCurrency(priceDiscount)}</span>
          <span className="ms-2 text-muted text-decoration-line-through">{formatCurrency(bookSale.price)}</span>
          <span className="ms-2 bg-danger text-white px-2 rounded">{bookSale.discount} %</span>
        </div>
        <div className="tw-flex tw-items-center tw-justify-between">
          <button
            className="tw-text-white tw-bg-blue-700 tw-hover:bg-blue-800 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-dark:bg-blue-600 tw-dark:hover:bg-blue-700 tw-dark:focus:ring-blue-800"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddToCart();
            }}
          >
            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { useBookContext } from "../hooks/useBookContext";
import { useStateContext } from '../context/UserContext'
//service
import { addItemToCart } from '../services/cartService';

const BookDetail = ({ book }) => {
  const { dispatch } = useBookContext();
  const navigate = useNavigate();
  const [bookSale, setBookSale] = useState({ price: 0, discount: 0, status: 'available' });
  const { user } = useStateContext();

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

  const handleAddItemToCart = async (itemData) => {
    try {
        await addItemToCart(itemData);
    }
    catch (error) {
        console.log("lỗi, không thể thêm giỏ hàng", error)
    }
}

  const addToCart = () => {
    if (user) {
        const itemData = { userId: user._id, bookId: book._id, quantity: 1, price: priceDiscount }
        handleAddItemToCart(itemData);
    }
    else {


        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.find(item => item.id === book._id);
        if (existingProduct) {
            // Nếu có, cập nhật số lượng sản phẩm trong giỏ hàng
            existingProduct.quantity += 1;
        } else {
            // Nếu không, thêm sản phẩm mới vào giỏ hàng
            cart.push({ id: book._id, quantity: 1, price: priceDiscount });
        }

        // Lưu giỏ hàng vào Local Storage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
   
};


  const handleAddToCart = () => {
    addToCart()
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

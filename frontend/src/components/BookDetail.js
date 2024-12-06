import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

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

    toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
      Sản phẩm đã được thêm vào giỏ hàng

    </div>,
      {
        position: "top-center", // Hiển thị toast ở vị trí trung tâm trên
        autoClose: 1500, // Đóng sau 3 giây
        hideProgressBar: true, // Ẩn thanh tiến độ
        closeButton: false, // Ẩn nút đóng
        className: "custom-toast", // Thêm class để tùy chỉnh CSS
        draggable: false, // Tắt kéo di chuyển
        rtl: false, // Không hỗ trợ RTL
      }
    );
  };


  return (<div className=" mt-3 card tw-w-full tw-max-w-sm tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg tw-dark:bg-gray-800 tw-dark:border-gray-700 hover:tw-shadow-xl transition-shadow duration-300"
    onClick={() => handleProductClick(book._id)}>

    {/* Hình ảnh chiếm toàn bộ chiều rộng của thẻ với padding để có thể nhìn thấy toàn bộ ảnh */}
    <div className="d-flex justify-content-center tw-px-2 tw-pt-2">
      <img
        src={book.images}
        alt={`Book image`}
        className="card-img-top tw-rounded-t-lg tw-object-cover"
        style={{ height: '190px', width: '140px' }} // Điều chỉnh chiều cao của ảnh nhỏ hơn để thẻ nhỏ hơn
      />
    </div>

    <div className="card-body tw-px-2 tw-py-2">
      <h5 className="card-title tw-text-sm tw-font-semibold tw-tracking-tight tw-text-gray-900 tw-dark:text-white">
        {book.title}
      </h5>
      <p className="card-text tw-text-xs"><strong>Tác giả:</strong> {book.author}</p>

      {/* Hiển thị giá bán */}
      <div className="tw-mt-2">
        {bookSale.discount > 0 ? (
          <div className="d-flex align-items-center mb-1">
            <span className="fs-5 text-danger fw-bold">{formatCurrency(priceDiscount)}</span>
            <span className="ms-2 text-muted text-decoration-line-through">{formatCurrency(bookSale.price)}</span>
          </div>
        ) : (
          <div className="d-flex align-items-center mb-1">
            <span className="fs-5 text-danger fw-bold">{formatCurrency(bookSale.price)}</span>
          </div>
        )}
      </div>

      {/* Nút thêm vào giỏ hàng */}
      <div className="d-flex justify-content-between mt-2">
        <button
          className="btn btn-primary tw-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-lg tw-shadow-sm tw-bg-blue-600 tw-hover:bg-blue-700 tw-focus:ring-2 tw-focus:ring-blue-300"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleAddToCart();
          }}>
          <i className="fas fa-cart-plus me-2"></i> Thêm vào giỏ
        </button>
      </div>
    </div>

  </div>


);
};

export default BookDetail;
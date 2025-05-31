import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { useBookContext } from "../hooks/useBookContext";
import { useStateContext } from '../context/UserContext';
import useWishlistStore from "../store/useWishListStore";
//service
import { addItemToCart } from '../services/cartService';
import { serverUrl } from "../services/config";
import { clickInteractionSer } from "../services/suggestion/suggestionService";
import { addToWishlistSer, removeFromWishlistSer } from "../services/wishListService";

const BookDetail = ({ book }) => {
  const wishlist = useWishlistStore(state => state.wishlist);
  
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);

  const { dispatch } = useBookContext();
  const navigate = useNavigate();
  const [bookSale, setBookSale] = useState({ price: 0, discount: 0, status: 'available' });
  const { user } = useStateContext();
  const [isWishlist, setIsWishlist] = useState();
  const [animationClass, setAnimationClass] = useState(`${isWishlist ? 'text-danger' : ''}`); // Khởi tạo với class dựa trên isWishListed


  useEffect(() => {
    const fetchBookSaleDetails = async () => {
      const response = await fetch(`${serverUrl}/api/bookSales/${book._id}`);
      const data = await response.json();

      if (response.ok) {
        setBookSale(data); // Cập nhật giá, giảm giá và trạng thái từ bookSaleModel
      }
    };

    fetchBookSaleDetails();
   
  }, [book._id]);

  useEffect(() => {
  if (!bookSale?._id) return;

  const isWishListed = wishlist.some(item => item === bookSale._id); 
  setIsWishlist(isWishListed);
  setAnimationClass(isWishListed ? 'text-danger' : '');
}, [bookSale, wishlist]);


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const priceDiscount = bookSale.price * (1 - bookSale.discount / 100);

  const handleProductClick = async (id) => {
    if (user) {
      const response = await clickInteractionSer(user._id, bookSale._id)
      console.log("response click interaction", response)
    }
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

  const addToWishlist = () => {
    if (user) {
      toggleWishlist(user._id, bookSale._id)
      setIsWishlist(prev => !prev); // Chuyển đổi trạng thái wishlist
    }
   else{
     toggleWishlist(null, bookSale._id)
      setIsWishlist(prev => !prev);
   }
  }

  const handleAddToWishlist = () => {
    addToWishlist()


  }

  return (
    <div
      className=" book-hover mt-3 card tw-w-60 tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg tw-dark:bg-gray-800 tw-dark:border-gray-700 hover:tw-shadow-xl transition-shadow duration-300"
      style={{ width: "240px" }} // Đặt chiều ngang cụ thể cho thẻ
      onClick={() => handleProductClick(book?._id)}
    >
      {/* Hình ảnh */}
      <div className="book-hover position-relative d-flex justify-content-center tw-px-2 tw-pt-2">
        <img
          src={book?.images}
          alt={`Book image`}
          className="card-img-top tw-rounded-t-lg tw-object-cover"
          style={{ height: "190px", width: "140px" }}
        />

        {/* Overlay mờ khi hover */}
        <div className="hover-overlay d-flex justify-content-end align-items-start p-2">
          <div className="heart-icon bg-white rounded-circle d-flex justify-content-center align-items-center shadow">
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleAddToWishlist();
              }}
              className="border-0 bg-transparent"
            >
              <i className={`fas fa-heart ${animationClass}`} ></i>
            </button>
          </div>
        </div>
      </div>


      {/* Nội dung */}
      <div className="card-body tw-px-2 tw-py-2">
        {/* Tên sách */}
        <h5
          className="card-title tw-text-sm tw-font-semibold tw-tracking-tight tw-text-gray-900 tw-dark:text-white"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {book?.title}
        </h5>

        {/* Tác giả */}
        <p
          className="card-text tw-text-xs"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <strong>Tác giả:</strong> {book?.author}
        </p>

        {/* Giá bán và nút */}
        <div className="d-flex justify-content-between align-items-center tw-mt-2">
          <div>
            {bookSale.discount > 0 ? (
              <div className="d-flex align-items-center">
                <span className="fs-5 text-danger fw-bold">
                  {formatCurrency(priceDiscount)}
                </span>
                <span className="ms-2 text-muted text-decoration-line-through tw-text-sm">
                  {formatCurrency(bookSale.price)}
                </span>
              </div>
            ) : (
              <span className="fs-5 text-danger fw-bold">
                {formatCurrency(bookSale.price)}
              </span>
            )}
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <button
            className="btn btn-primary tw-flex tw-items-center tw-px-4 tw-py-2 tw-rounded-lg tw-shadow-sm tw-bg-blue-600 tw-hover:bg-blue-700 tw-focus:ring-2 tw-focus:ring-blue-300"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddToCart();
            }}
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );

};

export default BookDetail;
import React, { useEffect, useState } from 'react';
import { serverUrl } from '../../services/config';
import useWishlistStore from '../../store/useWishListStore';
import { useStateContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { addItemToCart } from '../../services/cartService';

const WishListItem = ({ item }) => {
  const bookId = item;
  const [bookSale, setBookSale] = useState();
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  const { user } = useStateContext();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);

  const priceDiscount = bookSale?.price * (1 - bookSale?.discount / 100);

  useEffect(() => {
    const fetchBookSaleDetails = async () => {
      const response = await fetch(`${serverUrl}/api/bookSales/get/${bookId}`);
      const data = await response.json();
      if (response.ok) {
        setBookSale(data.data);
      }
    };
    fetchBookSaleDetails();
  }, [bookId]);

  const toggleToWishlist = () => {
    if (user) {
      toggleWishlist(user._id, bookId)
    }
   else{
     toggleWishlist(null, bookId)
   }
  }

  const addToCart = () => {
      if (user) {
        const itemData = { userId: user._id, bookId: bookSale?.bookId?._id, quantity: 1, price: priceDiscount }
        handleAddItemToCart(itemData);
      }
      else {
  
  
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.find(item => item.id === bookSale?.bookId?._id);
        if (existingProduct) {
          // Nếu có, cập nhật số lượng sản phẩm trong giỏ hàng
          existingProduct.quantity += 1;
        } else {
          // Nếu không, thêm sản phẩm mới vào giỏ hàng
          cart.push({ id: bookSale?.bookId?._id, quantity: 1, price: priceDiscount });
        }
  
        // Lưu giỏ hàng vào Local Storage
        localStorage.setItem('cart', JSON.stringify(cart));
      }
  
    };
  const handleAddItemToCart = async (itemData) => {
      try {
        await addItemToCart(itemData);
      }
      catch (error) {
        console.log("lỗi, không thể thêm giỏ hàng", error)
      }
    }
  
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
  

  return (
    <div>
      {bookSale ? (
        <div className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded shadow-sm">
          {/* Nút xóa */}
          <button className="btn btn-sm btn-outline-danger me-2"
            onClick={()=>toggleToWishlist()}>
            <i className="fa fa-trash"></i>
          </button>

        <Link to={`chi-tiet/${bookSale?.bookId?._id}`}>
          <div className="d-flex align-items-center flex-grow-1 mx-2">
            <img
              src={bookSale?.bookId?.images || 'https://via.placeholder.com/70'}
              alt="Book Cover"
              style={{ width: 70, height: 70, objectFit: 'cover', marginRight: 10 }}
            />
            <div>
              <p className="m-0 text-truncate" style={{ maxWidth: '150px' }}>
                {bookSale?.bookId?.title
                  ?.split(' ')
                  .slice(0, 3)
                  .join(' ') +
                  (bookSale?.bookId?.title?.split(' ').length > 3 ? '...' : '')}
              </p>

              {bookSale?.discount > 0 ? (
                <div className="d-flex align-items-center">
                  <span className="fs-6 text-danger fw-bold">
                    {formatCurrency(priceDiscount)}
                  </span>
                  <span className="ms-2 text-muted text-decoration-line-through">
                    {formatCurrency(bookSale?.price)}
                  </span>
                </div>
              ) : (
                <span className="fs-6 text-danger fw-bold">
                  {formatCurrency(bookSale?.price)}
                </span>
              )}
            </div>
          </div>
</Link>
          {/* Nút thêm giỏ hàng */}
          <button className="btn btn-sm btn-primary ms-2"
            onClick={()=>handleAddToCart()}
          >
            <i className="fa fa-shopping-cart"></i>
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <div
            className="spinner-border text-primary me-2"
            role="status"
            style={{ width: '1.5rem', height: '1.5rem' }}
          ></div>
          <strong>Đang tải...</strong>
        </div>
      )}
    </div>
  );
};

export default WishListItem;

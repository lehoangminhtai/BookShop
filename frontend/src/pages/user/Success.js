import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from '../../context/UserContext'
import { useLocation } from 'react-router-dom';
import { getPaymentByOrderId } from "../../services/paymentService";
import { fetchBook } from "../../services/bookService";
import { Link } from "react-router-dom";

const SuccessPage = () => {
    const navigate = useNavigate();
    const { user } = useStateContext();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [payment, setPayment] = useState(null);

    const orderId = queryParams.get('orderId');
    console.log(orderId);

    useEffect(() => {
        async function fetchPaymentData() {
            try {
                // Lấy dữ liệu thanh toán
                const result = await getPaymentByOrderId(orderId);
                setPayment(result.data); // Lưu dữ liệu vào state
                console.log(result.data);

                // Duyệt qua các mục trong itemsPayment để lấy ảnh sách
                const itemsWithImages = await Promise.all(result.data.orderId.itemsPayment.map(async (item) => {
                    const book = await fetchBook(item.bookId);  // Gọi API để lấy sách theo bookId
                    if (book && book.images && book.images.length > 0) {
                        item.bookImage = book.images[0];  // Giả sử lấy ảnh đầu tiên trong mảng images
                        item.bookTitle = book.title;  // Lấy tên sách
                    }
                    return item;
                }));

                // Cập nhật lại itemsPayment với ảnh và tên sách
                setPayment(prevPayment => ({
                    ...prevPayment,
                    orderId: {
                        ...prevPayment.orderId,
                        itemsPayment: itemsWithImages
                    }
                }));

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
            }
        }

        fetchPaymentData();
    }, [orderId]);

    const handleToHome = () => {
        navigate("/")
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    if (!payment) {
        return <div>Loading...</div>; // You can customize the loading state
    }

    return (
        <div className="min-vh-100 bg-white d-flex flex-column align-items-center py-5">
            <div className="container bg-white shadow-sm rounded p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <img src="https://res.cloudinary.com/dyu419id3/image/upload/v1731439369/check_nnsn14.png" alt="Nest logo" className="me-2" style={{ height: "50px", width: "50px" }} />
                        <h1 className="h3 fw-bold text-success mb-0">BOOKSHOP</h1>
                        <span className="text-muted ms-2">Đơn hàng</span>
                    </div>
                </div>

                <div className="d-flex">
                    {/* Customer Information Section */}
                    <div className="col-6 pe-3">
                        <h3 className="h5 fw-semibold mb-3">Thông tin khách hàng</h3>
                        <div className="text-secondary">
                            <p className="mb-3"><span className="fw-semibold">Họ tên:</span> <span className="text-primary">{user?.fullName}</span></p>
                            <p className="mb-3"><span className="fw-semibold">Điện thoại:</span> <span className="text-primary">{user?.phone}</span></p>
                            <p className="mb-3"><span className="fw-semibold">Email:</span> <span className="text-primary">{user?.email}</span></p>
                            <p className="mb-3"><span className="fw-semibold">Địa chỉ:</span> <span className="text-primary">{payment.orderId.address}</span></p>
                            <p className="mb-3"><span className="fw-semibold">Phương thức thanh toán:</span> <span className="text-primary">{payment.paymentMethod} </span><span className="badge bg-warning text-white">{payment.paymentStatus === 'success' ? "Đã thanh toán" : "Chưa thanh toán"}</span></p>
                            <p className="mb-3"><span className="fw-semibold">Trạng thái đơn hàng:</span> <span className="badge bg-warning text-white">{payment.orderId.orderStatus === 'pending' ? "Chờ xác nhận" : ""}</span></p>
                        </div>
                    </div>

                    {/* Order Information Section */}
                    <div className="col-6 ps-3" style={{ maxHeight: "16rem", overflowY: "auto" }}>
                        <h3 className="h5 fw-semibold mb-3">Mã vận đơn: {payment.orderId._id}</h3>

                        {/* Lặp qua itemsPayment để hiển thị sách */}
                        {payment.orderId.itemsPayment.map((item, index) => (
                            <div className="d-flex align-items-center mb-3" key={index}>
                                <img src={item.bookImage || "https://placehold.co/50x50"} alt={item.bookTitle || "Book"} className="me-3" style={{ height: "50px", width: "50px" }} />
                                <div>
                                    <p className="fw-semibold mb-0">{item.bookTitle || "Tên sách"}</p>
                                    <p className="text-muted small mb-0">({item.quantity} x {formatCurrency(item.price)})</p>
                                </div>
                                <p className="ms-auto fw-semibold mb-0">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        ))}

                        {/* Shipping and Total */}
                        <div className="d-flex justify-content-between text-secondary mb-1">
                            <p className="mb-0">Phí vận chuyển:</p>
                            <p className="mb-0">{formatCurrency(payment.orderId.shippingFee)}</p>
                        </div>
                        <div className="d-flex justify-content-between text-secondary fw-semibold">
                            <p className="mb-0">Tổng tiền:</p>
                            <p className="mb-0">{formatCurrency(payment.orderId.totalPrice)}</p>
                        </div>
                        <div className="d-flex justify-content-between text-secondary fw-semibold">
                            <p className="mb-0">Giảm giá:</p>
                            <p className="mb-0">{formatCurrency(payment.orderId.totalPrice + payment.orderId.shippingFee - payment.orderId.finalAmount)}</p>
                        </div>
                        <div className="d-flex justify-content-between text-secondary fw-semibold">
                            <p className="mb-0">Thanh toán:</p>
                            <p className="mb-0">{formatCurrency(payment.orderId.finalAmount - payment.finalAmount)}</p>
                        </div>
                        <div className="d-flex justify-content-between text-secondary fw-semibold">
                            <p className="mb-0">Còn lại:</p>
                            <p className="mb-0">{formatCurrency(payment.finalAmount)}</p>
                        </div>
                    </div>
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-4 text-center d-flex justify-content-center position-relative">
                    <button className="btn btn-primary px-4 py-2" onClick={handleToHome}>Tiếp tục mua sắm</button>
                    <Link to={'/account/orders'} className="text-danger position-absolute end-0 d-flex align-items-center">
                        Đơn hàng của tôi <i className="fa-solid fa-arrow-right ms-2"></i>
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default SuccessPage;

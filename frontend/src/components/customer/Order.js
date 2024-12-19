import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import React, { useState } from "react";


const Order = ({ orders, userId }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleSubmitReview = (reviewData) => {
        console.log("Dữ liệu đánh giá:", reviewData);
        // Gửi reviewData tới server qua API
        handleCloseModal();
    };

    const getOrderStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'confirm':
                return 'Chờ lấy hàng';
            case 'shipping':
                return 'Đang giao hàng';
            case 'completed':
                return 'Hoàn thành';
            case 'failed':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    return (
        <div className="container mt-5">
            {orders.map((order) => (
                <Link to={`/payment/success?orderId=${order._id}`}>
                <div className="card shadow-sm border-0 mb-4" key={order._id}>
                    <div className="card-body">
                        <h5 className="fw-bold mb-3">
                            Mã đơn hàng: {order._id}
                        </h5>
                        <div>
                            {order.itemsPayment.map((item, index) => (
                            
                                <div className="d-flex mb-4" key={index}>
                                    <img
                                        src={item.bookId.images[0]}
                                        alt={`Product image of ${item.bookId.title}`}
                                        className="img-thumbnail me-3"
                                        style={{ width: 100, height: 100, objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-1">{item.bookId.title}</h6>

                                        <p className="mb-0">Số lượng: x{item.quantity}</p>
                                    </div>
                                    <div className="text-end">

                                        <p className="text-danger fw-bold mb-0">
                                            {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div>
                            <p className="text-muted mb-2">
                                Tổng tiền sản phẩm:{" "}
                                <span className="text-danger">{formatCurrency(order.totalPrice)}</span>
                            </p>
                            <p className="text-muted mb-2">
                                Phí vận chuyển:{" "}
                                <span className="text-danger">{formatCurrency(order.shippingFee)}</span>
                            </p>
                            <p className="text-muted mb-2">
                                Thành tiền:{" "}
                                <span className="text-danger">{formatCurrency(order.finalAmount)}</span>
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="mb-0 text-primary">
                                        Trạng thái: {getOrderStatusText(order.orderStatus)}
                                    </p>
                                    <p className="text-muted">
                                        Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="d-flex gap-2">

                                    {order.orderStatus === 'completed' && (
                                        <>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleShowModal(order)}
                                            >
                                                Đánh Giá
                                            </button>
                                            <button className="btn btn-outline-secondary">
                                                Mua Lại
                                            </button>
                                        </>
                                    )}
                                    <button className="btn btn-outline-secondary">
                                        Liên Hệ Người Bán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Link>
            ))
            }
            {selectedOrder && (
                <div className="modal-overlay" style={{marginTop:"50px"}}>
                    <div className="modal-content">
                        <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        <ReviewForm
                            
                            onClose={handleCloseModal}
                            onSubmit={handleSubmitReview}
                            orderBooks={selectedOrder.itemsPayment} // Truyền danh sách sách của đơn hàng vào ReviewForm
                            userId={userId}
                            orderId={selectedOrder._id}
                        />
                      
                    </div>
                </div>

            )}
        </div>
    );
};

export default Order;
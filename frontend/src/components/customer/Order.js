import React from "react";


const Order = ({ orders }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="container mt-5">
            {orders.map((order) => (
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
                                        <p className="text-decoration-line-through text-muted mb-1">
                                            {formatCurrency(item.price)}
                                        </p>
                                        <p className="text-danger fw-bold mb-0">
                                            {formatCurrency(item.price )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div>
                            <p className="text-muted mb-2">
                                Tổng tiền sản phẩm:{" "}
                                <span className="text-danger">₫{order.totalPrice}</span>
                            </p>
                            <p className="text-muted mb-2">
                                Phí vận chuyển:{" "}
                                <span className="text-danger">₫{order.shippingFee}</span>
                            </p>
                            <p className="text-muted mb-2">
                                Thành tiền:{" "}
                                <span className="text-danger">₫{order.finalAmount}</span>
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="mb-0 text-primary">
                                        Trạng thái: {order.orderStatus}
                                    </p>
                                    <p className="text-muted">
                                        Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-danger text-white">Đánh Giá</button>
                                    <button className="btn btn-outline-secondary">
                                        Liên Hệ Người Bán
                                    </button>
                                    <button className="btn btn-outline-secondary">Mua Lại</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Order;
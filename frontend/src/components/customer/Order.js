import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import React, { useState, useEffect } from "react";
import { checkReview } from "../../services/reviewService";
import { updateStatusOrder, userUpdateOrder } from "../../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from '../../context/UserContext';
import { useChatStore } from '../../store/useChatStore';
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/accountService";

const AdminId = '6730ed8eb4d8865f974afcf5'

const Order = ({ orders, userId }) => {
    const { user } = useStateContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewStatus, setReviewStatus] = useState({});
    const [orderList, setOrderList] = useState([]);
    const { setSelectedUser } = useChatStore();
    const navigate = useNavigate();

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
            case 'shipped':
                return 'Đã giao hàng';
            case 'completed':
                return 'Hoàn thành';
            case 'failed':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const checkReviewExist = async () => {
        try {
            const statusMap = {};
            for (const order of orders) {
                for (const item of order.itemsPayment) {
                    const bookId = item.bookId._id;
                    const orderId = order._id;

                    const res = await checkReview({ bookId, userId, orderId });
                    statusMap[`${orderId}_${bookId}`] = res?.data?.exists || false;
                }
            }
            setReviewStatus(statusMap);
        } catch (error) {
            console.error("Lỗi khi kiểm tra đánh giá:", error);
        }
    };


    useEffect(() => {
        if (orders.length > 0 && userId) {
            setOrderList(orders);
            checkReviewExist();
        }
    }, [orders, userId]);

    const handleUpdateStatus = async (orderId, orderStatus) => {
        const userId = user._id
        const data = { userId, orderId, orderStatus }
        try {
            const response = await userUpdateOrder(data);
            if (response.data.success) {
                if (orderStatus === 'cancel') {
                    setOrderList(prev => prev.filter(order => order._id !== orderId));
                    toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                        Sản phẩm đã được hủy

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
                }
                if (orderStatus === 'completed') {
                    setOrderList(prev =>
                        prev.map(order =>
                            order._id === orderId ? { ...order, orderStatus: 'completed' } : order
                        )
                    );
                    toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                        Vui lòng đánh giá để nhận điểm thưởng

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
                }
            } else {
                toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                      Hệ thống lỗi!
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
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái!');
        }
    }

     const handleClickChatButton = async () => {
        const admin = await getUser(AdminId)
        console.log('admin',admin.data.user)
        setSelectedUser(admin.data.user);
        navigate(`/exchange/chat`);
    }

    return (
        <div className="container mt-5">
            {orderList.map((order) => (
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
                                        {order.orderStatus === 'pending' && (
                                            <>
                                                <button className="btn btn-danger"
                                                onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                               handleUpdateStatus(order._id, 'cancel');
                                                            }}
                                                 >Hủy đơn hàng</button>
                                            </>
                                        )}
                                        {order.orderStatus === 'shipped' && (
                                            <>
                                                <button className="btn btn-primary"
                                                onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                               handleUpdateStatus(order._id, 'completed');
                                                            }}>Xác nhận thành công</button>
                                            </>
                                        )}

                                        {order.orderStatus === 'completed' && (
                                            <>
                                                {/* Kiểm tra nếu còn sách chưa đánh giá */}
                                                {order.itemsPayment.some(item =>
                                                    !reviewStatus[`${order._id}_${item.bookId._id}`]
                                                ) && (
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                handleShowModal(order);
                                                            }}
                                                        >
                                                            Đánh Giá
                                                        </button>
                                                    )}
                                                <button className="btn btn-outline-secondary">Mua Lại</button>
                                            </>
                                        )}

                                        <button className="btn btn-outline-secondary" onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                handleClickChatButton();
                                                            }}>
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
                <div className="modal-overlay" style={{ marginTop: "50px" }}>
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
            <ToastContainer />
        </div>
    );
};

export default Order;
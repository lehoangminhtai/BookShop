import React, { useState, useEffect } from "react";
import AdSidebar from "../../components/admin/AdSidebar";
import { useStateContext } from '../../context/UserContext'
import { useParams } from "react-router-dom";
import { fetchBook } from "../../services/bookService";
import { getOrderByOrderId } from "../../services/orderService";
import { getPaymentByTransactionId } from "../../services/paymentService";
import { getPaymentByOrderId } from "../../services/paymentService";
import { Link } from "react-router-dom";

const AdOrderDetail = () => {
    const { user } = useStateContext()
    const [payment, setPayment] = useState(null);
    const { orderId } = useParams();
    console.log(orderId)

    useEffect(() => {
        async function fetchPaymentData() {
            try {
                // Lấy dữ liệu thanh toán
                const result = await getPaymentByOrderId(orderId);
                setPayment(result.data); // Lưu dữ liệu vào state
                console.log(result)

                // Duyệt qua các mục trong itemsPayment để lấy ảnh sách
                const itemsWithImages = await Promise.all(result.data.orderId.itemsPayment.map(async (item) => {
                    const book = await fetchBook(item.bookId);  // Gọi API để lấy sách theo bookId
                    if (book && book.images && book.images.length > 0) {
                        item.image = book.images[0];  // Giả sử lấy ảnh đầu tiên trong mảng images
                        item.title = book.title;
                        item.author = book.author
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

    if (!payment) {
        return <div>Loading...</div>; // You can customize the loading state
    }
    const totalQuantity = payment.orderId.itemsPayment.reduce((total, item) => total + item.quantity, 0);
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                <div className="card shadow-lg">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="h4">Thông tin đơn hàng #{payment.orderId._id} </h1>
                            <button className={`btn ${payment.orderId.orderStatus === 'completed' ? 'bg-success' : 'bg-warning'}`}>{payment.orderId.orderStatus === 'completed' ? 'Hoàn Thành' :
                                payment.orderId.orderStatus === 'shipping' ? 'Đang Vận Chuyển' :
                                    payment.orderId.orderStatus === 'confirm' ? 'Đã Xác Nhận' :
                                        payment.orderId.orderStatus === 'failed' ? 'Thất Bại' :
                                            'Đang chờ'}</button>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="mb-4">
                                    {payment.orderId.itemsPayment.map((item, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">

                                            <div className="d-flex align-items-center">
                                                <img src={item.image || "https://placehold.co/50x50"} alt={item.title || "Book"} className="rounded me-3" style={{ height: "100px", width: "70px" }} />
                                                <div>
                                                    <h5 className="mb-1">{item.title || "Tên sách"}</h5>
                                                    <small className="text-muted">{item.author || "Tác Giả"}</small><br />
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <p className="mb-0 fw-bold">{formatCurrency(item.price)}</p>
                                                <small className="text-muted">x {item.quantity}</small>
                                                <p className="mb-0 fw-bold">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td>Số lượng</td>
                                                <td className="text-end">{totalQuantity}</td>
                                            </tr>
                                            <tr>
                                                <td>Tiền hàng</td>
                                                <td className="text-end">{formatCurrency(payment.orderId.totalPrice)}</td>
                                            </tr>
                                            <tr>
                                                <td>Giảm giá</td>
                                                <td className="text-end">{formatCurrency(payment.orderId.totalPrice + payment.orderId.shippingFee - payment.orderId.finalAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td>Phí vận chuyển</td>
                                                <td className="text-end">
                                                    {formatCurrency(payment.orderId.shippingFee)}
                                                </td>
                                            </tr>

                                            <tr className="fw-bold text-primary">
                                                <td>Tổng thanh toán</td>
                                                <td className="text-end">{formatCurrency(payment.finalAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td>Đã thanh toán</td>
                                                <td className="text-end">{formatCurrency(payment.orderId.finalAmount - payment.finalAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td>Còn lại</td>
                                                <td className="text-end">{formatCurrency(payment.finalAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td>Phương thức thanh toán</td>
                                                <td className="text-end text-primary"><Link>{payment.paymentMethod === 'cash' ? 'Tiền mặt' : payment.paymentMethod === 'zalopay' ? 'Zalo Pay' : 'Momo'}</Link></td>
                                            </tr>
                                            <tr>
                                                <td>Trạng thái thanh toán</td>
                                                <td className={`fw-bold fb-1 text-end ${payment.paymentStatus === 'success' ? 'text-success' : 'text-warning'}`}> {payment.paymentStatus === 'success' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-success me-3">In hóa đơn</button>
                                        <button className="btn btn-warning">Tải hóa đơn</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
    <div className="card">
        <div className="card-body">
            <div className="d-flex align-items-center mb-4">
                <img
                    src={user?.image || "https://placehold.co/50x50"}
                    alt="avatar"
                    className="rounded-circle me-3"
                    style={{ height: "50px" }}
                />
                <div>
                    <h5 className="mb-1">{payment?.userId?.fullName}</h5>
                    <small className="text-primary">
                        <Link to={`mailto:${payment?.userId?.email}`}>
                            {payment?.userId?.email}
                        </Link>
                    </small>
                    <br />
                    <small className="text-primary">
                        <Link to={`tel:${payment?.userId?.phone}}`}>
                            {payment?.userId?.phone}
                        </Link>
                    </small>
                    <br />
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-3">Thông tin vận chuyển</h6>
                <button
                    className="btn btn-link p-2"
                    style={{ fontSize: "1.5rem", color: "#007bff" }}
                    onClick={() => alert('Chỉnh sửa thông tin vận chuyển')}
                >
                    <i className="fas fa-pencil-alt"></i>
                </button>
            </div>

            <ul className="list-unstyled">
                <li className="h5">{payment?.userId?.fullName}</li>
                <li className="text-primary mt-2">
                    <i className="fas fa-phone-alt me-2"></i>
                    <Link to={`tel:${payment?.userId?.phone}}`}>
                        {payment?.userId?.phone}
                    </Link>
                </li>
                <li className="text-primary mt-2">
                    <i className="fas fa-envelope me-2"></i>
                    <Link to={`mailto:${payment?.userId?.email}`}>
                        {payment?.userId?.email}
                    </Link>
                </li>
                <li className="mt-3 text-danger">{payment?.orderId?.address}</li>

                <li className="text-dark mt-1">
                    <Link
                        to="#"
                        onClick={() => {
                            window.open(
                                `https://www.google.com/maps?q=${encodeURIComponent(payment?.orderId?.address)}`,
                                "_blank"
                            );
                        }}
                    >
                        <i className="fas fa-map-marker-alt me-2"></i> Xem bản đồ
                    </Link>
                </li>
            </ul>

            <button className="btn btn-primary w-100 mt-3">Đặt lại</button>
        </div>
    </div>
</div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdOrderDetail
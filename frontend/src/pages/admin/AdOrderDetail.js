import React, { useState, useEffect } from "react";

import { useStateContext } from '../../context/UserContext'
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
//Service
import { fetchBook } from "../../services/bookService";
import { updateStatusOrder } from "../../services/orderService"
import { getPaymentByOrderId } from "../../services/paymentService";
import { updateBookSale } from "../../services/bookSaleService";
import { getBookSaleByBookId } from "../../services/bookSaleService";
//Component
import AdSidebar from "../../components/admin/AdSidebar";
import AdUpdateOrder from "../../components/admin/AdUpdateOrder";
//Toast
import { toast, ToastContainer } from 'react-toastify';

const AdOrderDetail = () => {
    const { user } = useStateContext()
    const [payment, setPayment] = useState(null);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderFailed, setOrderFailed] = useState(false);
    const { orderId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [showModalCancelOrder, setShowModalCancelOrder] = useState(false);

    const reloadData = async () => {
        try {
            // Lấy dữ liệu thanh toán
            const result = await getPaymentByOrderId(orderId);
            setPayment(result.data); 
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
            
    };

    useEffect(() => {
        async function fetchPaymentData() {
            try {
                // Lấy dữ liệu thanh toán
                const result = await getPaymentByOrderId(orderId);
                setPayment(result.data); // Lưu dữ liệu vào state

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

    
    const updateQuantityBookSale = async (calculate) =>{
        for (const item of payment.orderId.itemsPayment) {
            const bookSale = await getBookSaleByBookId(item.bookId);
            const bookSaleId = bookSale.data._id
            const quantityBookSale = bookSale.data.quantity;
            const quantityOrder = item.quantity
            if(calculate ==='minus'){
                const quantity = quantityBookSale - quantityOrder;
                const dataUpdate = {quantity}
                if(await updateBookSale(bookSaleId,dataUpdate))
                    return true
                else
                    return false
            }
            if(calculate ==='plus'){
                const quantity = quantityBookSale + quantityOrder;
                const dataUpdate = {quantity}
                if(await updateBookSale(bookSaleId,dataUpdate))
                    return true
                else
                    return false
            }
        }
    }
    useEffect(() => {
        if (payment && payment.orderId.orderStatus !== 'pending') {
            setOrderConfirmed(true);
        }
        if (payment && payment.orderId.orderStatus === 'failed') {
            setOrderFailed(true);
        }
        
    }, [payment]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);

    if (!payment) {
        return <div>Loading...</div>; // You can customize the loading state
    }
    const totalQuantity = payment.orderId.itemsPayment.reduce((total, item) => total + item.quantity, 0);

    const confirmOrder = async () => {
        try {
            const orderStatus = 'confirm';
            const orderData = { orderStatus };
            const response = await updateStatusOrder(orderId, orderData); // Giả sử updateStatusOrder trả về một response.
            console.log(response)
            if (response.data.success) {
                return true; // Trả về true nếu thành công
            } else {
                return false; // Trả về false nếu không thành công
            }
        } catch (error) {
            console.log(error);
            return false; // Trả về false nếu có lỗi
        }
    }

    const handleConfirmOrder = async () => {
        if (await confirmOrder() && updateQuantityBookSale('minus')) { 
          
            setPayment(prevPayment => ({
                ...prevPayment,
                orderId: {
                    ...prevPayment.orderId,
                    orderStatus: 'confirm'
                }
            }));
            toast.success('Xác nhận đơn hàng thành công')
            setOrderConfirmed(true);
        } else {
            toast.error('Có lỗi khi xác nhận đơn hàng')

        }
    };

    const handleUpdateOrder = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);

    };

    const openCancelOrder = () =>{
        setShowModalCancelOrder(true)
    }
    const closeCancelOrder = () =>{
        setShowModalCancelOrder(false)
    }

    const cancelOrder = async () =>{
        try {
            const orderStatus = 'failed';
            const orderData = { orderStatus };
            const response = await updateStatusOrder(orderId, orderData); // Giả sử updateStatusOrder trả về một response.
            if (response.data.success) {
                return true; // Trả về true nếu thành công
            } else {
                return false; // Trả về false nếu không thành công
            }
        } catch (error) {
            console.log(error);
            return false; // Trả về false nếu có lỗi
        }
    }

    const handleCancelOrder = async () =>{
        if(await updateQuantityBookSale('plus') && await cancelOrder()){
            setOrderFailed(true)
            reloadData();
            toast.success('HỦY ĐƠN HÀNG thành công', {
                    autoClose: 1000,
                    onClose: () => {
                       closeCancelOrder();
                    }
                });
        }
        else{
            toast.error('Có lỗi khi hủy đơn', {
                autoClose: 1000,
                onClose: () => {
                    // Đảm bảo đóng modal sau khi thông báo đã hoàn thành
                    closeCancelOrder();
                }
            });
        }
    }
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
                            <button className={`text-white btn ${payment.orderId.orderStatus === 'completed' ? 'bg-success' : payment.orderId.orderStatus === 'failed' ? 'bg-danger': 'bg-warning'}`}>{payment.orderId.orderStatus === 'completed' ? 'Hoàn Thành' :
                                payment.orderId.orderStatus === 'pending' && orderConfirmed ? 'Đã Xác Nhận' : payment.orderId.orderStatus === 'pending' ? 'Đang Chờ' :
                                    payment.orderId.orderStatus === 'confirm' ? 'Đã Xác Nhận' :
                                        payment.orderId.orderStatus === 'failed' ? 'Đã Hủy' :
                                            'Đang Vận Chuyển'}</button>
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
                                                <td className="text-end">{formatCurrency(payment.orderId.finalAmount)}</td>
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
                                        <button className="btn" style={{ backgroundColor: "orange", color: "white" }}>Tải hóa đơn</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-4">
                                            <img
                                                src={payment?.userId?.image || "https://placehold.co/50x50"}
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
                        <div className="container py-5">
                            <div className="border-bottom pb-4 mb-4">
                                <div className="border-bottom mb-3">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className={`fas ${orderConfirmed ? 'fa-check text-success' : 'fa-shopping-cart text-secondary'} me-2`}></i>
                                        <h5 className="mb-0 fw-bold">{orderConfirmed ? 'ĐƠN HÀNG ĐÃ ĐƯỢC XÁC NHẬN' : 'XÁC NHẬN ĐƠN HÀNG'}</h5>
                                        {!orderConfirmed && (
                                            <button className="btn btn-warning ms-auto" onClick={handleConfirmOrder}>
                                                Xác Nhận <i className="fas fa-check me-2"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <i className={`fas ${payment.paymentStatus !== 'success' ? 'fa-credit-card text-secondary' : 'fa-check text-success'} me-2`}></i>
                                    <h5 className="mb-0 fw-bold">
                                        {payment.paymentStatus !== 'success' ? 'XÁC NHẬN THANH TOÁN' : 'ĐÃ THANH TOÁN'}
                                    </h5>
                                    {payment.paymentStatus !== 'success' ? (
                                        <button className="btn btn-primary ms-auto">
                                            Xác Nhận <i className="fas fa-check me-2"></i>
                                        </button>
                                    ) : (
                                        <button className="btn btn-info ms-auto">
                                            Hoàn Tiền <i className="fas fa-undo  me-2"></i>

                                        </button>
                                    )}
                                </div>

                            </div>
                            <div>
                                <div className="d-flex align-items-center mb-3">
                                    {!orderFailed ?  <i className="fas fa-check text-success me-2"></i>:<i className="fas fa-times text-danger me-2"></i>}
                                   
                                    <h5 className="mb-0 fw-bold">GIAO HÀNG</h5>
                                </div>
                                <div className="row g-4 mb-4">

                                    <div className="col-md-4">
                                        <div className="text-muted small">TRẠNG THÁI</div>
                                        <span className={`badge ${payment.orderId.orderStatus === 'shipping' ? 'bg-warning' : payment.orderId.orderStatus === 'completed' ? 'bg-success' : payment.orderId.orderStatus === 'failed' ? 'bg-danger' : 'bg-info'} bg-success`}>{payment.orderId.orderStatus === 'shipping' ? 'Đang vận chuyển' : payment.orderId.orderStatus === 'completed' ? 'Hoàn thành' : payment.orderId.orderStatus === 'failed' ? 'Đã Hủy': 'Đang chờ'}</span>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="text-muted small">Cập nhật lần cuối</div>
                                        <div>{new Date(payment.orderId.updatedAt).toLocaleString()}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="text-muted small">{payment.paymentMethod === 'cash' ? 'TIỀN MẶT' : payment.paymentMethod === 'zalopay' ? 'Zalo Pay' : 'Momo'}</div>
                                        <div>{formatCurrency(payment.finalAmount)}</div>
                                    </div>
                                </div>
                                {!orderFailed &&(
                                <div className="d-flex gap-3">
                                    {(payment.orderId.orderStatus !== 'pending' || orderConfirmed) && (
                                        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleUpdateOrder}>
                                            <i className="fas fa-truck me-2"></i> Cập nhật trạng thái
                                        </button>
                                    )}
                                    {payment.orderId.orderStatus !== 'completed' && ( <button className="btn btn-danger d-flex align-items-center" onClick={openCancelOrder}>
                                        <i className="fas fa-times me-2"></i> Hủy Đơn Hàng
                                    </button>)}
                                   
                                </div>
                                )}
                                {showModal && (
                                    <div className="modal-overlay ">
                                        <div className="modal-content">
                                            <button className="close-btn" onClick={closeModal}>&times;</button>
                                            <AdUpdateOrder onClose={closeModal} initialOrderStatus={payment.orderId.orderStatus} orderId={orderId} reloadData = {reloadData} />
                                            <button className="" onClick={closeModal}>Quay lại</button>
                                        </div>
                                    </div>
                                )}
                                {showModalCancelOrder && (
    <div className="modal-overlay" style={{marginBottom:"100px"}} >
        <div className="modal-content">
            <button className="close-btn" onClick={closeCancelOrder}>&times;</button>
            <div className="d-flex justify-content-center">
            <h5 className="h5">Bạn có chắc chắn muốn hủy đơn hàng?</h5> 
            </div>
            <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-danger" onClick={handleCancelOrder}>Hủy đơn hàng</button> 
            </div>
                
                <button className="btn" onClick={closeCancelOrder}>Quay lại</button> 
           
        </div>
    </div>
)}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
export default AdOrderDetail
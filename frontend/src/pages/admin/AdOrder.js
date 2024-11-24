import React, { useState, useEffect } from "react";
import AdSidebar from "../../components/admin/AdSidebar";
import { getAllPayments } from "../../services/paymentService";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom"; 


const AdOrder = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();
   
    const fetchPayment = async () => {
        try {
            const response = await getAllPayments(); 
            const paymentData = response.data;
            setPayments(paymentData); 
            console.log(payments);
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra khi lấy dữ liệu thanh toán!");
        } finally {
            setLoading(false); 
        }
    };

    
    useEffect(() => {
        fetchPayment();
    }, []);

    const handleViewDetails = (orderId) => {
        navigate(`/admin/order/edit/${orderId}`);  // Chuyển hướng đến trang chỉnh sửa đơn hàng
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex">
                        <button className="btn btn-secondary me-2">Bulk Actions</button>
                        <button className="btn btn-secondary">Filters</button>
                    </div>
                    <input type="text" placeholder="Search..." className="form-control w-25" />
                    <div className="d-flex">
                        <button className="btn btn-primary ms-2">Export</button>
                        <button className="btn btn-primary ms-2">Import</button>
                        <button className="btn btn-primary ms-2">Create</button>
                    </div>
                </div>

                {/* Hiển thị Loading nếu đang tải dữ liệu */}
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <table className="table  table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">STT</th>
                                <th className="text-center">Người Dùng</th>
                                <th className="text-center">Thành Tiền</th>
                                <th className="text-center">Phương thức TT</th>
                                <th className="text-center">Trạng thái TT</th>
                                <th className="text-center">Trạng Thái</th>
                                <th className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render danh sách thanh toán từ state payments */}
                            {payments.map((payment, index) => (
                                <tr key={payment._id}>
                                    <td className="text-center">
                                       
                                        <span>{index + 1}</span>
                                    </td>
                                    <td >
                                        <div>{payment.userId.fullName}</div>
                                        <div className="text-primary">{payment.userId.email}</div>
                                        <div className="text-muted">{payment.userId.phone}</div>
                                    </td>
                                    <td className="text-center text-danger">{formatCurrency(payment.orderId.finalAmount)}</td>
                                    <td className="text-center">{payment.paymentMethod === 'cash' ? 'Tiền mặt' : payment.paymentMethod === 'zalopay' ? 'Zalo Pay' : 'Momo'}</td>
                                    <td className="text-center">
                                        <span className={`badge ${payment.paymentStatus === 'success' ? 'bg-success' : 'bg-warning'}`}>
                                            {payment.paymentStatus === 'success' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <span className={`badge 
                                                ${payment.orderId.orderStatus === 'completed' ? 'bg-success' :
                                                payment.orderId.orderStatus === 'shipping' ? 'bg-info' :
                                                    payment.orderId.orderStatus === 'confirm' ? 'bg-primary' :
                                                        payment.orderId.orderStatus === 'failed' ? 'bg-danger' :
                                                            'bg-warning'}`}>

                                            <i className={`fas me-1 
                                                    ${payment.orderId.orderStatus === 'completed' ? 'fa-check-circle' :
                                                    payment.orderId.orderStatus === 'shipping' ? 'fa-truck' :
                                                        payment.orderId.orderStatus === 'confirm' ? 'fa-thumbs-up' :
                                                            payment.orderId.orderStatus === 'failed' ? 'fa-times-circle' :
                                                                'fa-clock'}`}>
                                            </i>

                                            {/* Hiển thị tên trạng thái */}
                                            {payment.orderId.orderStatus === 'completed' ? 'Hoàn Thành' :
                                                payment.orderId.orderStatus === 'shipping' ? 'Đang Vận Chuyển' :
                                                    payment.orderId.orderStatus === 'confirm' ? 'Đã Xác Nhận' :
                                                        payment.orderId.orderStatus === 'failed' ? 'Thất Bại' :
                                                            'Đang chờ'}
                                        </span>
                                    </td>

                                    <td className="text-center">
                                        <button className="btn btn-primary" onClick={() => handleViewDetails(payment.orderId._id)}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdOrder;

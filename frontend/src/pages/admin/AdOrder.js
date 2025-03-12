import React, { useState, useEffect } from "react";
import AdSidebar from "../../components/admin/AdSidebar";
import { getAllPayments } from "../../services/paymentService";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const AdOrder = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate();

    const fetchPayments = async (page = 1, limit = 10) => {
        try {
            const response = await getAllPayments(page, limit);
            setPayments(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalItems(response.data.totalItems);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thanh toán:", error);
        }
    };


    useEffect(() => {
        fetchPayments(currentPage, limit);
    }, [currentPage, limit]);

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

                    </div>
                    <input type="text" placeholder="Search..." className="form-control w-25" />
                    <div className="d-flex">

                        <button className="btn btn-primary ms-2">Thêm mới</button>
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
                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <select
                            className="form-control d-inline w-auto"
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                        <span className="ml-2">
                            Hiển thị {payments.length > 0 ? (currentPage - 1) * limit + 1 : 0} -{' '}
                            {Math.min(currentPage * limit, totalItems)} trong tổng {totalItems} thanh toán
                        </span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        {/* Nút Previous */}
                        <button
                            className="btn btn-link text-warning"
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        {/* Nút phân trang */}
                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;

                            // Hiển thị nút đầu tiên
                            if (pageNumber === 1) {
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`btn btn-link ${currentPage === pageNumber ? 'btn-danger text-white px-3 py-1 rounded' : 'text-dark'}`}
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }

                            // Hiển thị nút cuối cùng
                            if (pageNumber === totalPages) {
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`btn btn-link ${currentPage === pageNumber ? 'btn-danger text-white px-3 py-1 rounded' : 'text-dark'}`}
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }

                            // Hiển thị nút liền kề currentPage
                            if (pageNumber === currentPage - 1 || pageNumber === currentPage || pageNumber === currentPage + 1) {
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`btn btn-link ${currentPage === pageNumber ? 'btn-danger text-white px-3 py-1 rounded' : 'text-dark'}`}
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }

                            // Hiển thị dấu ...
                            if (
                                (pageNumber < currentPage - 1 && pageNumber === 2) || // ... trước
                                (pageNumber > currentPage + 1 && pageNumber === totalPages - 1) // ... sau
                            ) {
                                return <span key={pageNumber} className="text-dark">...</span>;
                            }

                            return null; // Không hiển thị các trang còn lại
                        })}

                        {/* Nút Next */}
                        <button
                            className="btn btn-link text-warning"
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

            </div>
            <ToastContainer />
        </div>
    );
}

export default AdOrder;

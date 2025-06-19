import React, { useState, useEffect } from "react";
import AdSidebar from "../../components/admin/AdSidebar";
import { getAllPayments } from "../../services/paymentService";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { getPaymentByOrderId, updatePaymentStatus } from '../../services/paymentService';
import { updateOrderStatusWithoutPayment, updateQuantityBookSale } from '../../services/orderService';
import { updateBookSale } from "../../services/bookSaleService";
import { getBookSaleByBookId } from '../../services/bookSaleService';

const AdOrder = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate();

    const [searchKeyword, setSearchKeyword] = useState("");

    const [filters, setFilters] = useState({
        paymentStatus: "",
        orderStatus: "",
        paymentMethod: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchPayments = async (page = 1, limit = 10, filters = {}, search = "") => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                search: search.trim(),
                ...filters,
            });
            const response = await getAllPayments(params.toString());
            if (response.success) {
            let paymentList = response.data;
            const now = new Date();

            // Kiểm tra các đơn chưa thanh toán đã quá thời gian
            const updatedList = await Promise.all(paymentList.map(async (payment) => {
                try {
                    const createdAt = new Date(payment.orderId.createdAt);
                    const diffInMinutes = Math.floor((now - createdAt) / (1000 * 60));

                    if (
                        diffInMinutes >= 15 &&
                        payment &&
                        payment.paymentMethod !== 'cash' &&
                        payment.paymentStatus === 'pending'
                    ) {
                        // Cập nhật trạng thái thanh toán và đơn hàng
                        await updatePaymentStatus({
                            paymentId: payment._id,
                            status: 'canceled'
                        });

                        const data = { orderId: payment.orderId._id, orderStatus: 'failed' };
                        await updateOrderStatusWithoutPayment(data);
                        await updateQuantityBookSale(payment.orderId);

                        // Trả về bản ghi đã cập nhật
                        return {
                            ...payment,
                            paymentStatus: 'canceled',
                            orderId: {
                                ...payment.orderId,
                                orderStatus: 'failed'
                            }
                        };
                    }

                    return payment;
                } catch (err) {
                    console.error("Lỗi xử lý payment:", err);
                    return payment;
                }
            }));
            setPayments(updatedList);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);
            setLoading(false);
        }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thanh toán:", error);
        }
    };


    useEffect(() => {
        fetchPayments(currentPage, limit, filters, searchKeyword);
    }, [currentPage, limit, filters, searchKeyword]);

    const handleViewDetails = (orderId) => {
        navigate(`/admin/order/edit/${orderId}`);  // Chuyển hướng đến trang chỉnh sửa đơn hàng
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const updateQuantityBookSale = async (order) => {
            for (const item of order.itemsPayment) {
                const bookSale = await getBookSaleByBookId(item.bookId);
                const bookSaleId = bookSale.data._id
                const quantityBookSale = bookSale.data.quantity;
                const quantityOrder = item.quantity
    
                const quantity = quantityBookSale + quantityOrder;
                const dataUpdate = { quantity }
                if (await updateBookSale(bookSaleId, dataUpdate))
                    return true
                else
                    return false
    
            }
        }
    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container " >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc mã đơn hàng..."
                        className="form-control w-25"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') fetchPayments(1, limit, filters, searchKeyword);
                        }}
                    />
                </div>

                {/* Hiển thị Loading nếu đang tải dữ liệu */}
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table  table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">STT</th>
                                    <th className="text-center">Mã đơn hàng</th>
                                    <th className="text-center">Người Dùng</th>
                                    <th className="text-center">Thành Tiền</th>
                                    <th className="text-center"> Phương Thức

                                    </th>
                                    <th className="text-center">
                                        Thanh toán
                                    </th>
                                    <th className="text-center">

                                        Trạng thái
                                    </th>
                                    <th className="text-center"></th>
                                </tr>
                            </thead>
                            <thead>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>
                                    <select className="text-center" name="paymentMethod" onChange={handleFilterChange} value={filters.paymentMethod}>

                                        <option value="">Tất cả</option>
                                        <option value="cash">Tiền mặt</option>
                                        <option value="momo">Momo</option>
                                        <option value="zalopay">ZaloPay</option>
                                    </select>
                                </th>
                                <th>
                                    <select className="text-center" name="paymentStatus" onChange={handleFilterChange} value={filters.paymentStatus}>

                                        <option value="">Tất cả</option>
                                        <option value="pending">Chưa thanh toán</option>
                                        <option value="success">Đã thanh toán</option>
                                    </select>
                                </th>
                                <th>
                                    <select className="text-center" name="orderStatus" onChange={handleFilterChange} value={filters.orderStatus}>

                                        <option value="">Tất cả</option>
                                        <option value="pending">Đang chờ</option>
                                        <option value="confirm">Đã xác nhận</option>
                                        <option value="shipping">Đang vận chuyển</option>
                                        <option value="shipped">Đã vận chuyển</option>
                                        <option value="completed">Hoàn thành</option>
                                        <option value="failed">Thất bại</option>
                                    </select>
                                </th>
                                <th></th>
                            </thead>
                            <tbody>
                                {/* Render danh sách thanh toán từ state payments */}
                                {Array.isArray(payments) && payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            <span>Không có đơn hàng nào phù hợp</span>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment, index) => (
                                        <tr key={payment?._id}>
                                            <td className="text-center">

                                                <span>{index + 1}</span>
                                            </td>
                                            <td>{payment.orderId?._id}</td>

                                            <td>
                                                <div>{payment.userId.fullName}</div>
                                                <div className="text-primary">{payment.userId.email.slice(0, 15)}...</div>
                                                <div className="text-muted">{payment.userId.phone}</div>
                                            </td>
                                            <td className="text-center text-danger">{formatCurrency(payment.orderId?.finalAmount)}</td>
                                            <td className="text-center">{payment?.paymentMethod === 'cash' ? 'Tiền mặt' : payment?.paymentMethod === 'zalopay' ? 'Zalo Pay' : 'Momo'}</td>
                                            <td className="text-center">
                                                <span className={`badge ${payment?.paymentStatus === 'success' ? 'bg-success' : 'bg-warning'}`}>
                                                    {payment.paymentStatus === 'success' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </span>
                                            </td>
                                            <td className="text-center" style={{ width: '100px' }}>
                                                <span className={`badge 
                                                ${payment.orderId?.orderStatus === 'completed' ? 'bg-success' :
                                                        payment.orderId?.orderStatus === 'shipped' ? 'bg-info' :
                                                            payment.orderId?.orderStatus === 'shipping' ? 'bg-info' :
                                                                payment.orderId?.orderStatus === 'confirm' ? 'bg-primary' :
                                                                    payment.orderId?.orderStatus === 'failed' ? 'bg-danger' :
                                                                        'bg-warning'}`}>

                                                    <i className={`fas me-1 
                                                    ${payment.orderId?.orderStatus === 'completed' ? 'fa-check-circle' :
                                                            payment.orderId?.orderStatus === 'shipped' ? 'fa-truck' :
                                                                payment.orderId?.orderStatus === 'shipping' ? 'fa-truck' :
                                                                    payment.orderId?.orderStatus === 'confirm' ? 'fa-thumbs-up' :
                                                                        payment.orderId?.orderStatus === 'failed' ? 'fa-times-circle' :
                                                                            'fa-clock'}`}>
                                                    </i>

                                                    {/* Hiển thị tên trạng thái */}
                                                    {payment.orderId?.orderStatus === 'completed' ? 'Hoàn Thành' :
                                                        payment.orderId?.orderStatus === 'shipped' ? 'Đã Vận Chuyển' :
                                                            payment.orderId?.orderStatus === 'shipping' ? 'Đang Vận Chuyển' :
                                                                payment.orderId?.orderStatus === 'confirm' ? 'Đã Xác Nhận' :
                                                                    payment.orderId?.orderStatus === 'failed' ? 'Thất Bại' :
                                                                        'Đang chờ'}
                                                </span>
                                            </td>

                                            <td className="text-center">
                                                <button className="btn btn-primary" onClick={() => handleViewDetails(payment.orderId._id)}>Xem chi tiết</button>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
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

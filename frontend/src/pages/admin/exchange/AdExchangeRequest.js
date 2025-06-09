import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
//component
import AdSidebar from '../../../components/admin/AdSidebar';
//service
import { getExchangeRequests, getRequestByRequestId } from '../../../services/exchange/exchangeRequestService';

const AdExchangeRequest = () => {

    const [exchangeBooks, setExchangeBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [status, setStatus] = useState('');

    const navigate = useNavigate();

    const fetchExchangeRequests = async () => {
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(limit),
                status: String(status),
            });
            const response = await getExchangeRequests(params.toString());
            const data = response.data.data;
            console.log("response", response);
            if (response.data.success) {
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalExchanges); // Tổng số sách
                const requests = await Promise.all(
                    data.map(async (request) => {
                        const exchangeRequest = await getRequestByRequestId(request._id)
                        return {
                            id: request._id,
                            request: exchangeRequest.data.data,
                            requester: exchangeRequest.data.requester,
                            owner: exchangeRequest.data.owner,
                        }
                    })
                )
                console.log('request: ', requests)
                setExchangeBooks(requests);
            }
        } catch (error) {
            console.log("Lỗi khi tải sách trao đổi:", error);
        }
    };
    useEffect(() => {
        fetchExchangeRequests();
    }, [currentPage, limit, status]);

    const handleViewDetails = (exchangeId) => {
        navigate(`/exchange/exchange-info-detail/${exchangeId}`)
    }
    const getStatusBadge = (status) => {
        const config = {
            pending: { color: "bg-warning", icon: "fa-clock", text: "Chờ chấp nhận" },
            accepted: { color: "bg-success", icon: "fa-check-circle", text: "Đã chấp nhận" },
            processing: { color: "bg-info", icon: "fa-sync-alt", text: "Đang trao đổi" },
            completed: { color: "bg-primary", icon: "fa-star", text: "Hoàn thành" },
        };

        const { color, icon, text } = config[status] || { color: "bg-secondary", icon: "fa-question-circle", text: "Không xác định" };

        return (
            <span className={`badge ${color} text-white`}>
                <i className={`fas me-1 ${icon}`}></i>
                {text}
            </span>
        );
    };



    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                {/* Header actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input type="text" placeholder="Search..." className="form-control w-25" />
                    <select className="form-select w-auto rounded-pill shadow-sm border-0 bg-light text-dark"
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ minWidth: '180px' }}
                    >
                        <option value="">Tất cả</option>
                        <option value="pending">Chờ chấp nhận</option>
                        <option value="accepted">Đã chấp nhận</option>
                        <option value="processing">🔄 Đang trao đổi</option>
                        <option value="completed">🌟 Hoàn thành</option>

                    </select>

                </div>

                {/* Book Table */}
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>STT</th>
                            <th>Sách yêu cầu</th>
                            <th>Chủ sách</th>
                            <th>Phương thức</th>
                            <th>Người yêu cầu</th>
                            <th>Trạng thái</th>
                            <th></th> {/* Cột hành động: xem, sửa, xóa */}
                        </tr>
                    </thead>

                    {exchangeBooks && exchangeBooks.length > 0 ? (
                        <tbody>
                            {exchangeBooks.map((book, index) => (
                                <tr key={book.id}>
                                    <td>{(currentPage - 1) * limit + index + 1}</td>
                                    <td>
                                        <img
                                            src={book.request.bookRequestedId.images[0]}
                                            alt={book.request.bookRequestedId.title}
                                            style={{ width: '50px' }}
                                        />
                                        <div> {book.request.bookRequestedId.title} </div>
                                        <span className="badge text-warning fs-6 rounded-pill">
                                            💰 {book.request.bookRequestedId.creditPoints} đ
                                        </span>
                                    </td>
                                    <td>
                                        <div>{book.owner.fullName}</div>
                                        <div>{book.owner.email}</div>
                                        <div>{book.owner.phone}</div>
                                    </td>
                                    <td>
                                        {book.request.exchangeBookId ? (
                                            <>
                                                <img
                                                    src={book.request.exchangeBookId.images[0]}
                                                    alt={book.request.exchangeBookId.title}
                                                    style={{ width: '50px' }}
                                                />
                                                <div> {book.request.exchangeBookId.title} </div>
                                                <span className="badge text-warning fs-6 rounded-pill">
                                                    💰 {book.request.exchangeBookId.creditPoints} đ
                                                </span>
                                            </>
                                        ) : (
                                            <span className="badge text-warning fs-5 rounded-pill">
                                                💰 {book.request.bookRequestedId.creditPoints} đ
                                            </span>

                                        )}
                                    </td>
                                    <td>
                                        <div>{book.requester.fullName}</div>
                                        <div>{book.requester.email}</div>
                                        <div>{book.requester.phone}</div>
                                    </td>

                                    <td>
                                        {getStatusBadge(book.request.status)}
                                    </td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleViewDetails(book.id)}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="7" className="text-center">
                                    Không có giao dịch trao đổi
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>

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
                            Hiển thị{' '}
                            {exchangeBooks.length > 0 ? (currentPage - 1) * limit + 1 : 0} -{' '}
                            {Math.min(currentPage * limit, totalItems)} trong tổng {totalItems} sách
                        </span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
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
                            if (
                                pageNumber === currentPage - 1 ||
                                pageNumber === currentPage ||
                                pageNumber === currentPage + 1
                            ) {
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
                                return (
                                    <span key={pageNumber} className="text-dark">
                                        ...
                                    </span>
                                );
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

export default AdExchangeRequest
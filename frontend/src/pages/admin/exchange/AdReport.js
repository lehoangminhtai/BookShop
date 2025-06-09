import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
//component
import AdSidebar from '../../../components/admin/AdSidebar';
//service
import { getReportSer } from '../../../services/exchange/reportExchangeService';

const AdReport = () => {

    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const navigate = useNavigate();

    const fetchExchangeRequests = async () => {
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(limit),
            });
            const response = await getReportSer(params.toString());
            console.log("response", response);
            if (response.success) {
                setTotalPages(response.pagination.totalPages);
                setTotalItems(response.pagination.totalReports); // Tổng số sách
                setReports(response.data);
            }
        } catch (error) {
            console.log("Lỗi khi tải sách trao đổi:", error);
        }
    };
    useEffect(() => {
        fetchExchangeRequests();
    }, [currentPage, limit]);

    const handleViewDetails = (exchangeId) => {
        navigate(`/exchange/exchange-info-detail/${exchangeId}`)
    }

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">

                {/* Book Table */}
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>STT</th>
                            <th>Nội dung</th>
                            <th>Hình ảnh</th>
                            <th>Người gửi</th>
                            <th>Mã giao dịch</th>
                            <th>Trạng thái</th>
                            <th></th> {/* Cột hành động: xem, sửa, xóa */}
                        </tr>
                    </thead>

                    {reports && reports.length > 0 ? (
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={report._id}>
                                    <td>{(currentPage - 1) * limit + index + 1}</td>
                                    <td>{report?.content}</td>
                                    <td>
                                        <img
                                            src={report?.images[0]}
                                            style={{ width: '50px' }}
                                        />
                                    </td>
                                    <td>
                                        <div>{report?.reporterId?.fullName}</div>
                                        <div>{report?.reporterId?.email}</div>
                                        <div>{report?.reporterId?.phone}</div>
                                    </td>
                                    <td>{report?.requestId?._id}</td>
                                    <td>{report?.status==='pending' ? (<span>Đang chờ</span>): (<span>Đã xử lý</span>)}</td>

                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleViewDetails(report?.requestId?._id)}>Xem chi tiết</button>
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
                            {reports.length > 0 ? (currentPage - 1) * limit + 1 : 0} -{' '}
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

export default AdReport
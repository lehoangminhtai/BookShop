import React, { useState, useEffect } from "react";
//component
import AdSidebar from '../../components/admin/AdSidebar';
//service
import { getLogs } from "../../services/logService";

const AdLog = () => {
    const [logs, setLogs] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);


    const fetchLog = async (page, limit) => {
        const response = await getLogs(page, limit);
        if (response.success) {
            setLogs(response.logs);
            setTotalPages(response.totalPages);
            setCurrentPage(response.currentPage);
            setTotalItems(response.totalLogs);
        }
    };

    useEffect(() => {
        fetchLog(currentPage, limit);
    }, [currentPage, limit]);


    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                <div className="d-flex justify-content-between">
                    <h3 className="h3">Kiểm tra Log</h3>
                    <select className="w-25 form-select">
                        <option value="all">Tất cả</option>
                        <option value="active">Người dùng</option>
                        <option value="lock">Quản trị</option>
                    </select>
                </div>

                <table className="table table-hover mt-4">
                    <thead className="thead-light">
                        <tr>
                            <th>Thời gian</th>
                            <th>Hành động</th>
                            <th>Người dùng</th>
                            <th>Mô tả</th>

                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(logs) ? (
                            logs.map((log, index) => (
                                <tr key={log._id}>
                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="fw-bold">{log.action}</td>
                                    <td className={`${log.user?.role === 1 && 'text-danger'}`}>{log.user?.role === 0 ? 'Người dùng ' : 'Quản trị: '}{log.user?.fullName}
                                        <p className="small text-dark"><i>{log.user?.email}</i></p>
                                    </td>
                                    <td>{log?.description}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-danger">Không có dữ liệu</td>
                            </tr>
                        )}

                    </tbody>
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
                            Hiển thị {logs.length > 0 ? (currentPage - 1) * limit + 1 : 0} -
                            {Math.min(currentPage * limit, totalItems)} trong tổng {totalItems} log
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
                            if (pageNumber === 1 || pageNumber === totalPages ||
                                pageNumber === currentPage - 1 || pageNumber === currentPage || pageNumber === currentPage + 1) {
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
                            if (pageNumber === 2 || pageNumber === totalPages - 1) {
                                return <span key={pageNumber} className="text-dark">...</span>;
                            }
                            return null;
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
        </div>
    );
}
export default AdLog
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import debounce from 'lodash.debounce';
//component
import AdSidebar from '../../components/admin/AdSidebar';
import AdBookSaleEdit from "../../components/admin/AdBookSaleEdit";
//service
import { getBookSales, getBookSalesAdmin, updateBookSale, getBookSalesNotAvailable, searchBookSale } from "../../services/bookSaleService";

const AdBookSale = () => {
    const [bookSales, setBookSales] = useState([]);
    const [bookSale, setBookSale] = useState();
    const [loading, setLoading] = useState(true);  // State cho việc loading
    const [isEdit, setIsEdit] = useState(false);
    const [isActive, setIsActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [filterValue, setFilterValue] = useState('all'); // Giá trị lọc
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0); // Thêm state totalItems


    const fetchBookSales = async (page = 1, limit = 10, filter = 'all', query = '') => {
       
        try {
            let response;
            if (filter === 'available') {
                response = await getBookSales({ page, limit });
                console.log(response)
                setBookSales(response.data)
                setTotalPages(response.totalPages);
                setTotalItems(response.totalBookSales || 0);

            } else if (filter === 'hide') {
                response = await getBookSalesNotAvailable({ page, limit });
                setBookSales(response.data)
                setTotalPages(response.totalPages);
                setTotalItems(response.totalBookSales || 0);

            } else if (query) { // Tìm kiếm
                response = await searchBookSale(query, { page, limit });
                console.log(response.totalPages)
                setBookSales(response.data)
                setTotalPages(response.totalPages);
                setTotalItems(response.totalBookSales || 0);
                
            } else { // Tất cả
                response = await getBookSalesAdmin({ page, limit });
                setBookSales(response.data.data)
                setTotalPages(response.data.totalPages);
                setTotalItems(response.data.totalBookSales || 0);
                
            }

            setCurrentPage(page);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching book sales:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookSales(currentPage, limit, filterValue, searchQuery);
    }, [currentPage, limit, filterValue, searchQuery]);



    const handleChangeActive = async (bookSale) => {
        try {
            let status = 'hide'
            if (bookSale.status === 'hide') {
                status = 'available'
            }
            const dataBookSale = { status: status }
            const response = await updateBookSale(bookSale._id, dataBookSale)
            if (response.data.success) {
                fetchBookSales();
            }
        } catch (error) {

        }

    };

    const handleFilterBookSale = (e) => {
        setFilterValue(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
    };

    const searchBooks = useCallback(
        debounce(async (query) => {
            setSearchQuery(query)
            setCurrentPage(1);
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        console.log(query)
        searchBooks(query); // Gọi hàm tìm kiếm khi có thay đổi
    }



    const handleShowEdit = (bookSale) => {
        setIsEdit(true);
        setBookSale(bookSale)
    }
    const closeModal = () => {
        setIsEdit(false);
        fetchBookSales();
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="d-flex">
            {/* Sidebar Component */}
            <AdSidebar />

            {/* Main content */}
            <div className="p-4 w-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {/* Search box */}
                    <div className="position-relative">
                        <input type="text" placeholder="Tìm kiếm..." className="form-control w-100"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e)}
                        />
                        <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                    </div>

                    {/* Reload button */}
                    <select className="w-25 form-select" onChange={(e) => handleFilterBookSale(e)}>
                        <option value="all">Tất cả</option>
                        <option value="available">Đang bán</option>
                        <option value="hide">Ngưng kinh doanh</option>
                    </select>


                </div>

                {/* Table */}
                <div className="table-responsive">
                    
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-start">STT</th>
                                    <th className="text-start">Ảnh</th>
                                    <th className="text-center">Sách</th>
                                    <th className="text-center">Số lượng (Tồn kho)</th>
                                    <th className="text-center">Giá (VNĐ)</th>
                                    <th className="text-start text-nowrap">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookSales.length > 0 ? (
                                    bookSales.map((bookSale, index) => (
                                        <tr key={bookSale?._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Link to={bookSale?.status !== 'hide' ? `/chi-tiet/${bookSale.bookId?._id}` : ''}>
                                                    <img
                                                        src={bookSale.bookId?.images[0] || "https://placehold.co/50x50"}
                                                        alt="Product image"
                                                        className="img-fluid"
                                                        style={{ width: "50px" }}
                                                    />
                                                </Link>
                                            </td>
                                            <td onClick={() => handleShowEdit(bookSale)} style={{ cursor: "pointer" }}>
                                                <div className="text-primary">{bookSale.bookId?.title}</div>
                                                <div className="text-muted">{bookSale.bookId?.author}</div>
                                            </td>
                                            <td className="text-center">
                                                <div className={`${bookSale.quantity === 0 ? 'text-danger' : 'text-primary'}`}>
                                                    {bookSale.quantity}
                                                </div>
                                            </td>
                                            <td className="text-start text-nowrap">
                                                {bookSale?.discount !== 0 ? (
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className="fs-5 text-danger fw-bold">
                                                            {formatCurrency(bookSale?.price - (bookSale?.price * bookSale?.discount) / 100)}
                                                        </span>
                                                        {bookSale?.price && bookSale?.discount > 0 && (
                                                            <div>
                                                                <span className="ms-2 text-muted text-decoration-line-through">
                                                                    {formatCurrency(bookSale?.price)}
                                                                </span>
                                                                <span className="ms-2 bg-danger text-white px-2 rounded">
                                                                    {bookSale?.discount} %
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span className="fs-5 text-danger fw-bold">
                                                            {formatCurrency(bookSale?.price)}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`isActive-${bookSale?._id}`}
                                                        checked={bookSale?.status !== 'hide'}
                                                        onChange={() => handleChangeActive(bookSale)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-danger">
                                            Không tìm thấy cuốn sách phù hợp
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                

                </div>
                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <select
                            className="form-control d-inline w-auto"
                            value={limit}
                            onChange={(e) => {
                                setLimit(parseInt(e.target.value));
                                setCurrentPage(1); // Reset về trang 1 khi thay đổi limit
                            }}
                        >
                            

                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                        <span className="ml-2">
                            Hiển thị{' '}
                            {bookSales.length > 0 ? (currentPage - 1) * limit + 1 : 0} -{' '}
                            {Math.min(currentPage * limit, totalItems)} trên tổng {totalItems} sách
                        </span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-link text-warning"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        {/* Page numbers - Logic render được đặt trực tiếp ở đây */}
                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;

                            if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`btn btn-link ${currentPage === pageNumber ? 'btn-danger text-white px-3 py-1 rounded' : 'text-dark'}`}
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (pageNumber === 2 && currentPage > 3 || pageNumber === totalPages - 1 && currentPage < totalPages - 2) {
                                return <span key={pageNumber} className="text-dark">...</span>
                            }
                            return null;
                        })}

                        <button
                            className="btn btn-link text-warning"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            {isEdit && (
                <div className="modal-overlay ">
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModal}>&times;</button>
                        <AdBookSaleEdit bookSale={bookSale} onClose={closeModal} />
                        <button className="" onClick={closeModal}>Quay lại</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdBookSale;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//component
import AdSidebar from '../../components/admin/AdSidebar';
import AdBookSaleEdit from "../../components/admin/AdBookSaleEdit";
//service
import {  getBookSalesAdmin,updateBookSale } from "../../services/bookSaleService";

const AdBookSale = () => {
    const [bookSales, setBookSales] = useState([]);
    const [bookSale, setBookSale] = useState();
    const [loading, setLoading] = useState(true);  // State cho việc loading
    const [isEdit, setIsEdit] = useState(false);
    const [isActive, setIsActive] = useState(false)

    const fetchBookSales = async () => {
        try {
            const response = await getBookSalesAdmin();
            setBookSales(response.data);
            setLoading(false);  // Thay đổi trạng thái loading
        } catch (err) {
            console.error('Error fetching book sales:', err);
            setLoading(false);
        }
    };

    useEffect(() => {


        fetchBookSales();
    }, []);

    
    const handleChangeActive = async (bookSale) => {
        try {
            let status = 'hide'
            if(bookSale.status ==='hide'){
                status = 'available'
            }
            const dataBookSale = {status: status}
            const response = await updateBookSale(bookSale._id,dataBookSale)
            if(response.data.success){
                fetchBookSales();
            }
        } catch (error) {
            
        }
       
    };

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
    return (
        <div className="d-flex">
            {/* Sidebar Component */}
            <AdSidebar />

            {/* Main content */}
            <div className="p-4 w-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {/* Search box */}
                    <div className="position-relative">
                        <input type="text" placeholder="Tìm kiếm..." className="form-control w-100" />
                        <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                    </div>

                    {/* Reload button */}
                    <button className="btn btn-outline-secondary d-flex align-items-center">
                        <i className="fas fa-sync-alt me-2"></i> Tải lại
                    </button>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center">Đang tải dữ liệu...</div>  // Hiển thị khi đang tải dữ liệu
                    ) : (
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-start">STT</th>
                                    <th className="text-start">Ảnh</th>
                                    <th className="text-start">Sách</th>
                                    <th className="text-start">Số lượng (Tồn kho)</th>
                                    <th className="text-start">Giá (VNĐ)</th>

                                    <th className="text-start">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookSales.map((bookSale, index) => (
                                    <tr key={bookSale._id} >
                                        <td >{index + 1}</td>
                                        <td>
                                            <Link to={bookSale.status !== 'hide' ? `/chi-tiet/${bookSale.bookId._id}` : ''}>
                                                <img
                                                    src={bookSale.bookId?.images[0] || "https://placehold.co/50x50"}
                                                    alt="Product image"
                                                    className="img-fluid"
                                                    style={{ width: "50px" }}
                                                />
                                            </Link>
                                        </td>
                                        <td onClick={() => handleShowEdit(bookSale)} style={{ cursor: "pointer" }}>
                                            <div className="text-primary">{bookSale.bookId.title}</div>
                                            <div className="text-muted">{bookSale.bookId.author}</div>
                                        </td>
                                        <td>
                                            <div className={`${bookSale.quantity === 0 ? ' text-danger' : 'text-primary'}`}>{bookSale.quantity}</div>
                                        </td>

                                        <td>
                                            {
                                                bookSale.discount !== 0 ? <div className="d-flex align-items-center mb-3">
                                                    <span className="fs-5 text-danger fw-bold">
                                                        {bookSale.discount === 0 ? formatCurrency(bookSale.price) : formatCurrency(bookSale.price - (bookSale.price * bookSale.discount) / 100)}
                                                    </span>
                                                    {(bookSale.price && bookSale.discount > 0) && (
                                                        <div>
                                                            <span className="ms-2 text-muted text-decoration-line-through">{formatCurrency(bookSale.price)}</span>
                                                            <span className="ms-2 bg-danger text-white px-2 rounded">{bookSale.discount} %</span>
                                                        </div>
                                                    )}


                                                </div> :
                                                <div>
                                                     <span className="fs-5 text-danger fw-bold">{formatCurrency(bookSale.price)}</span>
                                                </div>
                                            }

                                        </td>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`isAcitve-${bookSale._id}`}
                                                    checked={bookSale.status !== 'hide'}
                                                    onChange={() => handleChangeActive(bookSale)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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

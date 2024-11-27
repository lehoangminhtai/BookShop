import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//component
import AdSidebar from '../../components/admin/AdSidebar';
import AdDiscountForm from '../../components/admin/AdDiscountForm';
//services
import { getAllDiscount } from '../../services/discountService';

const AdDiscount = () => {
    const [books, setBooks] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
    const navigate = useNavigate();


    const fetchBooks = async () => {
        const response = await fetch('/api/books');
        const data = await response.json();
        if (response.ok) {
            setBooks(data);
        }
    };

    const fetchDiscounts = async () => {
        const response = await getAllDiscount();
        const data = response.data;
        if (data) {
            setDiscounts(data.discounts)
        }

    }

    useEffect(() => {
        fetchDiscounts();
    }, []);

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

    const handleDelete = async (bookId) => {
        const response = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
        if (response.ok) {
            setBooks(books.filter(book => book._id !== bookId));
        }
    };

    const handleEdit = (bookId) => {
        navigate(`/edit/${bookId}`);
    };

    const handleCreateBook = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        fetchDiscounts();
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                {/* Header actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex">
                        <button className="btn btn-secondary me-2">Bulk Actions</button>
                        <button className="btn btn-secondary">Filters</button>
                    </div>
                    <input type="text" placeholder="Search..." className="form-control w-25" />
                    <div className="d-flex">
                        <button className="btn btn-primary ms-2">Export</button>
                        <button className="btn btn-primary ms-2">Import</button>
                        <button className="btn btn-primary ms-2" onClick={handleCreateBook}>Create</button>
                    </div>
                </div>

                {/* Book Table */}
                <table className="table ">
                    <thead className="thead-light">
                        <tr>
                            <th>STT</th>
                            <th>Thông Tin</th>
                            <th>Đã Sử Dụng</th>
                            <th>Ngày Bắt Đầu</th>
                            <th>Ngày Kết Thúc</th>

                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.map((discount, index) => (
                            <tr key={discount._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="bg-primary text-white p-3 rounded">
                                        <span> MÃ GIẢM: <span>{discount.discountCode} </span> <i className="far fa-copy"></i></span>
                                        <br />
                                        <small className="text-warning fst-italic h6">
                                            {discount.discountName}
                                        </small>
                                        <br />
                                        <small>Giảm {discount.discountType === 'percentage' ? discount.percent + `% (tối đa ${formatCurrency(discount.maxAmountDiscount)})` : formatCurrency(discount.amount)} cho 
                                            đơn hàng từ {formatCurrency(discount.minOfTotalPrice)} trở lên</small>

                                    </div>
                                </td>
                                <td className='text-center'>{discount.usedBy.length}</td>
                                <td>{new Date(discount.dateStart).toLocaleString()}</td>
                                <td className={`${discount.dateExpire ? '' :'text-center'}`}>{discount.dateExpire ? new Date(discount.dateExpire).toLocaleString() : '--'}</td>

                                <td>
                                    <button className="btn btn-link text-primary" >
                                        Xem Chi Tiết
                                    </button>
            
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <select className="form-control d-inline w-auto">
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </select>
                        <span className="ml-2">Show from 1 to 10 in 24 records</span>
                    </div>
                    <div className="btn-group" role="group">
                        <button className="btn btn-secondary">Previous</button>
                        <button className="btn btn-primary">1</button>
                        <button className="btn btn-secondary">2</button>
                        <button className="btn btn-secondary">3</button>
                        <button className="btn btn-secondary">Next</button>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay ">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                            <AdDiscountForm onClose={closeModal} />
                            <button className="" onClick={closeModal}>Quay lại</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdDiscount;

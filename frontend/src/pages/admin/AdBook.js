import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
//component
import AdSidebar from '../../components/admin/AdSidebar';
import BookForm from '../../components/BookForm';
import BookFormEdit from '../../components/admin/AdBookFormEdit';

const AdBook = () => {
    const [books, setBooks] = useState([]);
    const [book, setBook] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0); // Tổng số sách


    const fetchBooks = async () => {
        try {
            const response = await fetch(`/api/books?page=${currentPage}&limit=${limit}`);
            const data = await response.json();
            if (response.ok) {
                setBooks(data.data); // Mảng sách
                setTotalPages(data.totalPages); // Tổng số trang
                setTotalItems(data.totalItems); // Tổng số sách
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách sách:', error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [currentPage, limit]);

    const handleDelete = async (bookId) => {
        const response = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
        if (response.ok) {
            setBooks(books.filter((book) => book._id !== bookId));
        }
    };

    const handleCreateBook = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        fetchBooks();
    };
    const handleUpdateBook = (book) => {
        setBook(book);
        setShowModalEdit(true);
    };

    const closeModalEdit = () => {
        setShowModalEdit(false);
        fetchBooks();
    };

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                {/* Header actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input type="text" placeholder="Search..." className="form-control w-25" />
                    <button className="btn btn-primary ms-2" onClick={handleCreateBook}>
                        Thêm mới
                    </button>
                </div>

                {/* Book Table */}
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>STT</th>
                            <th>Ảnh</th>
                            <th>Tiêu đề</th>
                            <th>Tác giả</th>
                            <th>Nhà xuất bản</th>
                            <th>Ngày tạo</th>
                            <th></th>
                        </tr>
                    </thead>
                    {books && books.length > 0 ? (
                        <tbody>
                            {books.map((book, index) => (
                                <tr key={book._id}>
                                    <td>{(currentPage - 1) * limit + index + 1}</td>
                                    <td>
                                        <img
                                            src={book.images}
                                            alt={book.title}
                                            style={{ width: '50px' }}
                                        />
                                    </td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.publisher}</td>
                                    <td>{new Date(book.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <button
                                            className="btn btn-link text-primary"
                                            onClick={() => handleUpdateBook(book)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-link text-danger"
                                            onClick={() => handleDelete(book._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="7" className="text-center">
                                    Không có sách nào
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
                            {books.length > 0 ? (currentPage - 1) * limit + 1 : 0} -{' '}
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

                {/* Modals */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModal}>
                                &times;
                            </button>
                            <BookForm onClose={closeModal} />
                        </div>
                    </div>
                )}
                {showModalEdit && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModalEdit}>
                                &times;
                            </button>
                            <BookFormEdit book={book} onClose={closeModalEdit} />
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdBook;

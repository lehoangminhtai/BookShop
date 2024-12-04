import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//component
import AdSidebar from '../../components/admin/AdSidebar';
import BookForm from '../../components/BookForm';
import BookFormEdit from '../../components/admin/AdBookFormEdit';

const AdBook = () => {
    const [books, setBooks] = useState([]);
    const [book, setBook] = useState()
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const navigate = useNavigate();


    const fetchBooks = async () => {
        const response = await fetch('/api/books');
        const data = await response.json();
        if (response.ok) {
            setBooks(data);
        }
    };

    useEffect(() => {
        fetchBooks();
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

  

    const handleCreateBook = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        fetchBooks();
    };
    const handleUpdateBook = (book) => {
        setBook(book)
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
                    <div className="d-flex">
                        <button className="btn btn-secondary mr-2">Bulk Actions</button>
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
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={book.images} alt={book.title} style={{ width: '50px' }} />
                                </td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{new Date(book.createdAt).toLocaleDateString("vi-VN")}</td>
                                <td>
                                    <button className="btn btn-link text-primary" onClick={() => handleUpdateBook(book)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn btn-link text-danger" onClick={() => handleDelete(book._id)}>
                                        <i className="fas fa-trash"></i>
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
                            <BookForm onClose={closeModal} />
                            <button className="" onClick={closeModal}>Quay lại</button>
                        </div>
                    </div>
                )}
                {showModalEdit && (
                    <div className="modal-overlay ">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModalEdit}>&times;</button>
                            <BookFormEdit book={book} onClose={closeModalEdit} />
                            <button className="" onClick={closeModalEdit}>Quay lại</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdBook;

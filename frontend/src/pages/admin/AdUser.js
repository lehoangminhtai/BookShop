import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { ToastContainer } from "react-toastify";
//component
import AdSidebar from '../../components/admin/AdSidebar';
import AdUserForm from '../../components/admin/AdUserForm';

//service
import { getAllUsers, filterUser, searchUser } from '../../services/userService';

import { useStateContext } from '../../context/UserContext';

const AdUser = () => {
    const [users, setUsers] = useState([]);
    const [userSelected, setUserSelected] = useState()
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { user } = useStateContext()
    const userId = user._id
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const fetchUsers = async (page = 1, limit = 10) => {
        const response = await getAllUsers(page, limit);
        if (response.data.success) {
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setTotalItems(response.data.totalUsers);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, limit);
    }, [currentPage, limit]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
        setCurrentPage(1); // Reset về trang 1 khi đổi số lượng
    };

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

    const handleCreateUser = () => {
        setIsEdit(false)
        setUserSelected()
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEdit(false)
    };
    const closeModalWithSuccess = () => {
        setShowModal(false);
        setIsEdit(false)
        fetchUsers()
    };
    const handleUpdateUser = (user) => {
        setUserSelected(user)
        setIsEdit(true)
        setShowModal(true);
    };


    const handleFilterUser = async (e) => {
        const value = e.target.value;
        if (value === 'all') {
            fetchUsers();
        } else {
            try {
                const userData = { status: value }
                const response = await filterUser(userData);
                setUsers(response.users);

            } catch (err) {
                console.error('Error fetching book sales:', err);

            }
        }
    };

    const searchUsers = useCallback(
        debounce(async (query) => {
            try {
                const response = await searchUser(query); // Gọi API tìm kiếm
                console.log(response);

                if (response.success) {
                    setUsers(response.users); // Cập nhật kết quả vào state
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        console.log(query)
        searchUsers(query); // Gọi hàm tìm kiếm khi có thay đổi
    }

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                {/* Header actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <input type="text" placeholder="Tìm kiếm..." className="form-control w-25"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e)}
                    />
                    <div className="d-flex">
                        <button className="btn btn-primary me-2" onClick={handleCreateUser}>Tạo mới</button>
                        <select className="w-50 form-select" onChange={handleFilterUser}>
                            <option value="all">Tất cả</option>
                            <option value="active">Hoạt động</option>
                            <option value="lock">Bị Khóa</option>
                        </select>
                    </div>
                </div>

                {/* Book Table */}
                <table className="table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th>STT</th>
                            <th>Ảnh</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Vai trò</th>
                            <th>Ngày tạo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user._id} className={user._id === userId ? 'bg-info' : ''}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={user.image} alt='avatar' className='rounded' style={{ height: '50px', width: '50px' }} />
                                    </td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td className={user.role === 1 ? 'text-danger' : 'text-muted'}>{user.role === 1 ? 'Quản trị' : 'Người dùng'}</td>
                                    <td>{user.createdAt ? new Date(user?.createdAt).toLocaleDateString("vi-VN") : '---'}</td>
                                    <td>
                                        <button className="btn btn-link text-primary" onClick={() => handleUpdateUser(user)}>
                                            <i className="fas fa-edit"></i>
                                        </button>

                                    </td>

                                </tr>

                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-danger">
                                    Không tìm thấy người dùng phù hợp
                                </td>
                            </tr>
                        )
                        }

                    </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <select
                            className="form-control d-inline w-auto"
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            value={limit}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                        <span className="ml-2">
                            Hiển thị {users.length > 0 ? (currentPage - 1) * limit + 1 : 0} -
                            {Math.min(currentPage * limit, totalItems)} trong tổng {totalItems} người dùng
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

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay ">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                            <AdUserForm onClose={closeModalWithSuccess} isEdit={isEdit} user={userSelected} />
                            <button className="" onClick={closeModal}>Quay lại</button>
                        </div>
                    </div>
                )}


            </div>
            <ToastContainer />
        </div>
    );
};

export default AdUser;

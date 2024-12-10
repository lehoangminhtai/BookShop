import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ToastContainer } from "react-toastify";
//component
import AdSidebar from '../../components/admin/AdSidebar';
import AdUserForm from '../../components/admin/AdUserForm';

//service
import { getAllUsers } from '../../services/userService';

import { useStateContext } from '../../context/UserContext';

const AdUser = () => {
    const [users, setUsers] = useState([]);
    const [userSelected, setUserSelected] = useState()
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const navigate = useNavigate();
    const {user} = useStateContext()
    const userId = user._id


    const fetchUsers = async () => {
        const response = await getAllUsers();
        if (response.data.success) {
            setUsers(response.data.users);
        }
    };

    useEffect(() => {
        fetchUsers();
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

    const handleCreateUser = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    const closeModalWithSuccess = () => {
        setShowModal(false);
        fetchUsers()
    };
    const handleUpdateUser = (user) => {
        setUserSelected(user)
        setShowModalEdit(true);
    };

    const closeModalEdit = () => {
        setShowModalEdit(false);
        fetchUsers();
    };

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                {/* Header actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    
                    <input type="text" placeholder="Search..." className="form-control w-25" />
                    <div className="d-flex">
                        
                        <button className="btn btn-primary ms-2" onClick={handleCreateUser}>Create</button>
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
                        {users.map((user, index) => (
                            <tr key={user._id}  className={user._id === userId  ? 'bg-info' : ''}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={user.image} alt='avatar' className='rounded' style={{height:'50px', width: '50px' }} />
                                </td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td className={user.role === 1 ? 'text-danger': 'text-muted'}>{user.role === 1 ? 'Quản trị': 'Người dùng'}</td>
                                <td>{user.createdAt ? new Date(user?.createdAt).toLocaleDateString("vi-VN"):'---'}</td>
                                <td>
                                    <button className="btn btn-link text-primary" onClick={() => handleUpdateUser(user)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn btn-link text-danger" >
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
                           <AdUserForm onClose ={closeModalWithSuccess}/>
                            <button className="" onClick={closeModal}>Quay lại</button>
                        </div>
                    </div>
                )}
                {showModalEdit && (
                    <div className="modal-overlay ">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModalEdit}>&times;</button>
                            
                            <button className="" onClick={closeModalEdit}>Quay lại</button>
                        </div>
                    </div>
                )}

            </div>
            <ToastContainer/>
        </div>
    );
};

export default AdUser;

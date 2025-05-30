import React, { useState } from 'react'
import { toast } from "react-toastify";
import CustomerSidebar from './CustomerSidebar'
import { useStateContext } from '../../context/UserContext'
import { useDropzone } from 'react-dropzone'
import { updateUser, getUser } from '../../services/accountService' // Import service update user

const MyAccount = () => {
    const { user, setUser } = useStateContext(); // Thêm setUser để cập nhật thông tin người dùng
    const [userSelected, setUserSelected] = useState()
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
    });
    const [images, setImages] = useState(user?.image || null); // Lưu ảnh
    const [errors, setErrors] = useState({}); // Lưu lỗi

    const fetchUser = async () =>{
        try {
            const response = await getUser(user?._id);
            
            
        } catch (error) {
            
        }
    }

    // Xử lý khi thay đổi dữ liệu trong form
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý khi chọn ảnh
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFileToBase(file);
        }
    };

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImages(reader.result); // Cập nhật ảnh
            const updatedErrors = { ...errors };
            delete updatedErrors.images; // Xoá lỗi nếu có
            setErrors(updatedErrors);
        };
    };

    // Set up useDropzone
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    });

    // Xử lý khi nhấn nút "Lưu"
    const handleSave = async () => {
        try {
            const updatedData = { ...formData, image: images }; // Gộp dữ liệu form và ảnh
            const response = await updateUser(user?._id, updatedData);
            if(response.data.success){
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Đã cập nhật thông tin
                </div>,
                    {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeButton: false,
                        className: "custom-toast",
                        draggable: false,
                        rtl: false,
                    }
                );
            }
            console.log(response) // Gửi yêu cầu cập nhật
            setUser(response.data.user);
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            alert('Cập nhật thông tin thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className='auth-container'>
            <div className="container p-4">
                <div className="d-flex">
                    <CustomerSidebar />
                    <div className="d-flex flex-column flex-md-row w-100">
                        <div className="container p-4 flex-grow-1">
                            <h1 className="h4 fw-bold mb-3">Hồ Sơ Của Tôi</h1>
                            <p className="text-muted mb-4">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                            <div className="row g-4">
                                <div className="col-md-8">
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Tên</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled  // Thêm thuộc tính disabled để không thể chỉnh sửa
                                            style={{
                                                opacity: 0.6,  // Tạo hiệu ứng mờ đi
                                            }}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-muted">Số điện thoại</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Ngày sinh</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button className="btn btn-danger text-white" onClick={handleSave}>
                                        Lưu
                                    </button>
                                </div>
                                <div className="col-md-4 text-center mt-4 mt-md-0">
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <img
                                            src={images}
                                            alt="avatar"
                                            className="rounded-circle img-fluid mb-2"
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                objectFit: 'cover',
                                                border: '2px solid black',
                                            }}
                                        />
                                        <div {...getRootProps()} className="btn btn-primary mb-2">
                                            Chọn Ảnh
                                            <input {...getInputProps()} />
                                        </div>
                                        <p className="text-muted small mt-2">Dung lượng file tối đa 1 MB</p>
                                        <p className="text-muted small">Định dạng: JPEG, .PNG</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
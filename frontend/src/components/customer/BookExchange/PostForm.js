import React, { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

//context
import { useStateContext } from "../../../context/UserContext";
//service
import { createBookExchange } from "../../../services/exchange/bookExchangeService";
import { getListCategoryBooks } from "../../../services/categoryBookService";

const PostForm = ({ handleCloseModal }) => {
    const { user } = useStateContext();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        publisher: "",
        publicationYear: "2025",
        categoryId: "",
        condition: "",
        ownerId: user?._id,
        location: "",
        pageCount: "",
        images: [],
    });

    const [errors, setErrors] = useState({})
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);

    const [openProgress, setOpenProgress] = React.useState(false);
    const handleCloseProgress = () => {
        setOpenProgress(false);
    };
    const handleOpenProgress = () => {
        setOpenProgress(true);
    };



    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
            const data = await response.json();

            if (data.error === 0) {
                setProvinces(data.data);
            } else {
                console.error('Error fetching provinces:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch provinces:', error);
        }
    };

    const fetchCategories = async () => {
        const response = await getListCategoryBooks();
        if (response) {
            setCategories(response.data);
        } else {
            console.error('Failed to fetch categories');
        }
    };

    //useEffect
    useEffect(() => {
        fetchProvinces();
        fetchCategories();
    }, []);


    const handleRemoveFile = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }))

    };

    const handleClose = () => {
        handleCloseModal();
    };

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData((prevData) => ({
                ...prevData,
                images: [...prevData.images, reader.result],
            }));
        };
    };

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => setFileToBase(file));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const labels = {
        title: "Tiêu đề",
        author: "Tác giả",
        description: "Mô tả",
        publisher: "Nhà xuất bản",
        publicationYear: "Năm xuất bản",
        categoryId: "Thể loại",
        condition: "Tình trạng",
        ownerId: "ID chủ sở hữu",
        location: "Địa điểm",
        pageCount: "Số trang",
        images: "Hình ảnh",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Dữ liệu gửi lên:', formData);

        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key].toString().trim()) {
                newErrors[key] = `${labels[key]} không được để trống`;
            }
        });


        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;
        try {
            handleOpenProgress();
            const response = await createBookExchange(formData);
            const result = response.data;
            if (result.success) {
                handleCloseProgress();
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Đăng sách thành công
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
            handleClose();

        } catch (error) {
            console.error(error);
        }
    };




    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Đăng sách</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className=" mb-3">
                                    <label className="form-label fw-bold text-dark">Tiêu đề</label>
                                    <div className="col-sm-12 mb-4">
                                        <input
                                            type="text"
                                            value={formData.title}
                                            name="title"
                                            onChange={(e) => handleChange(e)}
                                            className={`form-control ${errors.title ? "is-invalid" : ""} mb-1`}
                                        />
                                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                    </div>
                                    <hr />
                                </div>
                                <div className=" mb-3">
                                    <label className="form-label fw-bold text-dark">Tác giả</label>
                                    <div className="col-sm-12 mb-4">
                                        <input
                                            type="text"
                                            value={formData.author}
                                            name="author"
                                            onChange={(e) => handleChange(e)}
                                            className={`form-control ${errors.author ? "is-invalid" : ""} mb-1`}
                                        />
                                        {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                                    </div>
                                    <hr />
                                </div>
                                <div className=" mb-3">
                                    <label className="form-label fw-bold text-dark">Mô tả</label>
                                    <div className="col-sm-12 mb-4">
                                        <input
                                            type="text"
                                            value={formData.description}
                                            name="description"
                                            onChange={(e) => handleChange(e)}
                                            className={`form-control ${errors.description ? "is-invalid" : ""} mb-1`}
                                        />
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>
                                    <hr />
                                </div>

                                <div className=" mb-3">
                                    <label className="form-label fw-bold text-dark">Nhà xuất bản</label>
                                    <div className="col-sm-12 mb-4">
                                        <input
                                            type="text"
                                            value={formData.publisher}
                                            name="publisher"
                                            onChange={(e) => handleChange(e)}
                                            className={`form-control ${errors.publisher ? "is-invalid" : ""} mb-1`}
                                        />
                                        {errors.publisher && <div className="invalid-feedback">{errors.publisher}</div>}
                                    </div>
                                    <hr />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Năm xuất bản</label>
                                    <div className="col-sm-12 mb-4">
                                        <select
                                            value={formData.publicationYear || new Date().getFullYear()} // Mặc định là năm hiện tại (2025)
                                            name="publicationYear"
                                            onChange={(e) => handleChange(e)}
                                            className={`form-select ${errors.publicationYear ? "is-invalid" : ""} mb-1`}
                                        >
                                            <option value="">Chọn năm xuất bản</option>
                                            {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        {errors.publicationYear && <div className="invalid-feedback">{errors.publicationYear}</div>}
                                    </div>
                                    <hr />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Thể loại: </label>
                                    <select
                                        className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                                        onChange={(e) => handleChange(e)}
                                        value={formData.categoryId}
                                        name="categoryId"
                                    >
                                        <option value="">Chọn thể loại</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.nameCategory}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Tình trạng: </label>
                                    <select
                                        className={`form-select ${errors.condition ? 'is-invalid' : ''}`}
                                        onChange={(e) => handleChange(e)}
                                        value={formData.condition}
                                        name="condition"
                                    >
                                        <option value="">Chọn tình trạng sách</option>
                                        <option value="new-unused">Mới - Chưa sử dụng</option>
                                        <option value="new-used">Mới - Đã sử dụng (ít)</option>
                                        <option value="old-intact">Cũ - Còn nguyên vẹn</option>
                                        <option value="old-damaged">Cũ - Không còn nguyên vẹn</option>

                                    </select>
                                    {errors.condition && <div className="invalid-feedback">{errors.condition}</div>}
                                </div>

                                <div className=" mb-3">
                                    <label className="form-label fw-bold text-dark">Số trang</label>
                                    <div className="col-sm-12 mb-4">
                                        <input
                                            type="number"
                                            min={5}
                                            value={formData.pageCount}
                                            name="pageCount"
                                            onChange={(e) => handleChange(e)}
                                            className={`form-control ${errors.pageCount ? "is-invalid" : ""} mb-1`}
                                        />
                                        {errors.pageCount && <div className="invalid-feedback">{errors.pageCount}</div>}
                                    </div>
                                    <hr />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Hình ảnh:</label>
                                    <div
                                        {...getRootProps()}
                                        className={`dropzone ${isDragActive ? 'active-dropzone' : ''} ${errors.images ? "is-invalid" : ""}`}
                                        style={{
                                            border: '2px dashed #007bff',
                                            padding: '20px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        {isDragActive ? <p>Thả file vào đây...</p> : <p>Kéo & thả ảnh hoặc nhấn để chọn</p>}
                                    </div>
                                    {formData.images.length > 0 ? (
                                        <div className="mt-2 d-flex flex-wrap">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="position-relative d-inline-block me-2 mb-2">
                                                    <img
                                                        src={img}
                                                        alt="preview"
                                                        className="img-thumbnail"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                        onClick={() => handleRemoveFile(index)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>

                                            ))}
                                        </div>
                                    ) : (<p className="text-danger mt-2">*Vui lòng chọn một hoặc nhiều ảnh cho cuốn sách</p> // Thay đổi cách hiển thị
                                    )

                                    }
                                </div>
                                <div className="form-group row mb-3 mt-3">
                                    <label className="form-label fw-bold text-dark">Tỉnh/Thành phố trao đổi</label>
                                    <div className="col-sm-12 mb-4 mt-2">
                                        <select className={`form-control ${errors.location ? 'is-invalid' : ''} mb-1`} onChange={(e) => handleChange(e)} value={formData.location} name="location">
                                            <option value="">Chọn Tỉnh Thành</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.full_name}>{province.full_name}</option>
                                            ))}
                                        </select>
                                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                                    </div>
                                    <hr />
                                </div>

                                <button type="submit" className="mt-3 btn btn-primary col-sm-12">Chia sẻ sách ngay!!</button>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn" onClick={handleClose}>Đóng</button>
                        <button type="submit" className="btn btn-primary">Lưu</button>
                    </div>
                </div>
            </div>
            { openProgress && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openProgress}
              
            >
                <CircularProgress color="inherit" />
            </Backdrop>}
        </div>
    );
};

export default PostForm;
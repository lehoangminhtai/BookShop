import React, { useState } from 'react';

const ExchangeInfoForm = ({ onSubmit }) => {
    const [form, setForm] = useState({
        location: '',
        date: '',
        time: '',
        deliveryMethod: '',
        phone: '',
        note: ''
    });

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        publisher: "",
        publicationYear: "2025",
        categoryId: "",
        condition: "",
        location: "",
        pageCount: "",
        images: []
    });

    const [errors, setErrors] = useState({})
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    return (
        <div className="container py-5">
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


            <button type="submit" className="mt-3 btn btn-primary col-sm-12">Chia sẻ sách ngay!!</button>
        </form>
        </div>
    );
};

export default ExchangeInfoForm;

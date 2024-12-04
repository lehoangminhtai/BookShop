import React, { useState, useEffect } from 'react';

const AdBookSaleEdit = ({ bookSale }) => {
    const [bookSaleUpdate, setBookSaleUpdate] = useState()
    const [quantity, setQuantity] = useState(bookSale.quantity || 0);
    const [price, setPrice] = useState(bookSale.price || 0);
    const [discount, setDiscount] = useState(bookSale.discount || 0);
     const [status, setStatus] = useState(bookSale.status || 'active');
    const [errors, setErrors] = useState({});


    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        const updatedErrors = { ...errors };

        if (value.trim() !== '') {
            delete updatedErrors[field]; // Remove error if input is not empty
        }

        setErrors(updatedErrors);

        if (field === "quantity") setQuantity(value);
        if (field === "price") setPrice(value);
        if (field === "discount") {
            setDiscount(value);
        }

    };
    
  

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="">
                        <div className=" text-center">
                            <h4><i className="fas fa-edit"></i> Chỉnh sửa sách bán</h4>
                        </div>
                        <div className="card-body mt-3">
                            <div className="d-flex justify-content-between">

                                <div>
                                    <h3 className=" h3 text-primary">{bookSale.bookId.title}</h3>
                                    <div className="text-muted">{bookSale.bookId.author}</div>
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="fs-3 text-danger fw-bold">
                                            {discount === 0 ? formatCurrency(price) : formatCurrency(price - (price *discount)/100)}
                                        </span>
                                        {(price && discount > 0) && (
                                            <div>
                                                <span className="ms-2 text-muted text-decoration-line-through">{formatCurrency(price)}</span>
                                                <span className="ms-2 bg-danger text-white px-2 rounded">{discount} %</span>
                                            </div>
                                            )}
                                       

                                    </div>
                                </div>
                                <img
                                    src={bookSale.bookId?.images[0] || "https://placehold.co/50x50"}
                                    alt="Product image"
                                    className="img-fluid"
                                    style={{ width: "80px" }}
                                />
                            </div>
                            <form onSubmit={handleSubmit}>
                                {/* Trường giá */}
                                <div className="mb-3">
                                    <label className="form-label">Số lượng</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                        value={quantity}
                                        onChange={(e) => handleInputChange(e, 'quantity')}
                                        min="0"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Giá gốc (VNĐ)</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                        value={price}
                                        onChange={(e) => handleInputChange(e, 'price')}
                                        min="0"
                                    />
                                </div>

                                {/* Trường giảm giá */}
                                <div className="mb-3">
                                    <label className="form-label">Giảm giá (%)</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                                        value={discount}
                                        onChange={(e) => handleInputChange(e, 'discount')}
                                        min="0"
                                        max="100"
                                    />
                                </div>


                                {/* Nút lưu và hủy */}
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-primary d-flex align-items-center">
                                        <i className="fas fa-save me-2"></i> Cập nhật
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdBookSaleEdit;

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
//service
import { updateBookSale } from '../../services/bookSaleService';


const AdBookSaleEdit = ({ bookSale, onClose }) => {
    const [bookSaleUpdate, setBookSaleUpdate] = useState()
    const [quantity, setQuantity] = useState(bookSale.quantity);
    const [price, setPrice] = useState(bookSale.price);
    const [discount, setDiscount] = useState(bookSale.discount);
     const [status, setStatus] = useState(bookSale.status || 'active');
    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        
        if (quantity === '' || quantity === null || quantity === undefined) {
            newErrors.quantity = 'Vui lòng nhập số lượng';
        }
        if (price === '' || price === null || price === undefined) {
            newErrors.price = 'Vui lòng nhập giá';
        }
        if (discount === '' || discount === null || discount === undefined) {
            newErrors.discount = 'Vui lòng nhập giảm giá';
        }        

        setErrors(newErrors);


        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const bookSaleData = {quantity: quantity, price: price, discount: discount}
            const responseUpdateBookSale = await updateBookSale(bookSale._id, bookSaleData)

            if(responseUpdateBookSale.data.success){
                toast.success('Đã cập nhật sách', {
                    autoClose: false, 
                  });
                  
                  setTimeout(() => {
                    onClose()  
                  }, 1500);  
                  
            }
            else if(responseUpdateBookSale.data.success){
                toast.error('Lỗi cập nhật sách')
            }
        } catch (error) {
            toast.error('Lỗi cập nhật sách' + error)
        }
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
                                        {(price > 0 && discount > 0) && (
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
                                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
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
                                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
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
                                    {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
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
            <ToastContainer/>
        </div>
    );
};

export default AdBookSaleEdit;

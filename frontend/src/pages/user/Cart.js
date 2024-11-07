import React, { useEffect, useState } from 'react';
import { fetchBook } from '../../services/bookService';
import { useStateContext } from '../../context/UserContext'
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const { user } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    }, []);

    useEffect(() => {
        const fetchAllProductDetails = async () => {
            const productsData = {};
            for (const item of cartItems) {
                try {
                    const book = await fetchBook(item.id);
                    productsData[item.id] = book;
                    if(item.quantity>=50)
                        item.quantity=50;
                } catch (error) {
                    console.error('Error fetching book:', error);
                }
            }
            setProducts(productsData);
        };

        if (cartItems.length > 0) {
            fetchAllProductDetails();
        }
    }, [cartItems]);

    const handleDeleteItemCart = (id) => {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
    };

    const handleQuantityChange = (id, delta) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + delta;
                // Giới hạn tối đa là 50
                return { ...item, quantity: Math.min(newQuantity, 50) };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };
    

    const getTotalPrice = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cartItems.find(item => item.id === itemId);
            
            return total + (item ? item.price * item.quantity : 0);
        }, 0);
    };

    const checkOut = () => {
        navigate("/checkout");
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card mb-4 shadow-lg border-0">
                        <div className="card-body">
                            <h5 className="card-title fw-bold mb-3">Giỏ Hàng ({cartItems.length} sản phẩm)</h5>
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">
                                <div className="form-check">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        id="selectAll" 
                                        checked={selectedItems.length === cartItems.length}
                                        onChange={handleSelectAll}
                                    />
                                    <label className="form-check-label" htmlFor="selectAll">
                                        Chọn tất cả ({cartItems.length} sản phẩm)
                                    </label>
                                </div>
                                <div className="d-none d-md-flex" style={{ width: '300px' }}>
                                    <span className="me-4 text-center fw-semibold" style={{ width: '80px', marginLeft: '50px' }}>Số lượng</span>
                                    <span className="text-center fw-semibold" style={{ width: '120px' }}>Thành tiền</span>
                                </div>
                            </div>
                            <div className='' style={{ height: "50vh", overflowY: "auto" }}>
                                {cartItems.map(item => {
                                    const product = products[item.id];
                                    return (
                                        <div key={item.id} className="row align-items-center pb-3">
                                            <div className="col-3 col-md-2 d-flex align-items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input me-1" 
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => handleSelectItem(item.id)}
                                                />
                                                <img
                                                    src={product ? product.images : 'https://placehold.co/100x150'}
                                                    alt={product ? product.title : 'Loading...'}
                                                    className="img-fluid rounded"
                                                    style={{ width: '60px', height: '90px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}
                                                />
                                            </div>

                                            <div className="col-9 col-md-6">
                                                <p className="mb-1 fw-bold" style={{ fontSize: '16px' }}>
                                                    {product ? product.title : 'Loading...'}
                                                </p>
                                                <p className="text-danger fw-semibold mb-0" style={{ fontSize: '14px' }}>
                                                    {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <div className="col-12 col-md-4 d-flex align-items-center" style={{ marginTop: '10px' }}>
                                                <div className="d-flex align-items-center me-4">
                                                    <button 
                                                        className="btn btn-outline-secondary btn-sm px-2"
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2 text-center" style={{ width: '30px', fontWeight: '500' }}>{item.quantity}</span>
                                                    <button 
                                                        className="btn btn-outline-secondary btn-sm px-2"
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="text-danger fw-semibold ms-4 text-center" style={{ width: '120px', fontSize: '16px' }}>
                                                    {formatCurrency(item.quantity * item.price)}
                                                </span>
                                                <button className="btn btn-link text-muted ms-3" onClick={() => handleDeleteItemCart(item.id)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card mb-4 shadow-lg border-0">
                        <div className="card-body">
                            <h5 className="text-primary fw-bold mb-3">Khuyến mãi</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Mã giảm 10K - Toàn sàn</span>
                                <a href="#" >Xem thêm</a>
                            </div>
                            <p className="text-muted mb-2" style={{ fontSize: '13px' }}>
                                Đơn hàng từ 130k - Xem chi tiết để biết thêm về thể lệ chương trình.
                            </p>
                            <div className="progress mb-3">
                                <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <button className="btn btn-primary w-100">Mua Thêm</button>
                        </div>
                    </div>

                    <div className="card mb-4 shadow-lg border-0">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Thành tiền</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Tổng số tiền (gồm VAT)</span>
                                <span className="text-danger fw-semibold">{formatCurrency(getTotalPrice())}</span>
                            </div>
                            <button className="btn btn-danger w-100 mb-2" onClick={checkOut}>THANH TOÁN</button>
                            <p className="text-muted small text-center">(Giảm giá trên web chỉ áp dụng cho bán lẻ)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

import React, { useEffect, useState } from 'react';
import { useStateContext } from '../../context/UserContext'
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
//service
import { fetchBook } from '../../services/bookService';
import { getCart, updateCartItem, removeItemFromCart } from '../../services/cartService';
import { getBookSale } from '../../services/bookSaleService';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const { user } = useStateContext();
    const navigate = useNavigate();

    const fetchProductDetails = async (cartItems) => {
        const productsData = {};
        for (const item of cartItems) {
            try {
                const bookId = item.bookId ? item.bookId._id : item.id;
                const book = await fetchBook(bookId);  // Giả sử bạn gọi API để lấy thông tin chi tiết của sách
                productsData[bookId] = book;
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        }
        return productsData;
    };
    

    useEffect(() => {
        const fetchCartData = async () => {
            if (user) {
                const response = await getCart(user._id);
                const cartData = response?.data?.cartItems || [];
                setCartItems(cartData);
            } else {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                setCartItems(cart);
            }
        };

        fetchCartData();
    }, [user]);

    useEffect(() => {
        const fetchAllProductDetails = async () => {
            const productsData = {};
            for (const item of cartItems) {
                try {
                    const bookId = item.bookId ? item.bookId._id : item.id;
                    const book = await fetchBook(bookId);
                    productsData[bookId] = book;
                    if (item.quantity >= 50)
                        item.quantity = 50;
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


    const handleDeleteItemCart = (itemId) => {
        const updatedCartItems = cartItems.filter(item => (item.bookId ? item.bookId._id : item.id) !== itemId);
        if (user) {
            try {
                removeItemFromCart(user._id, itemId);
            }
            catch (error) {
                console.error('Có lỗi khi xóa sản phẩm ra giỏ hàng', error);
            }
        }
        else {
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        }


        setCartItems(updatedCartItems);
        setSelectedItems(selectedItems.filter(selectedId => selectedId !== itemId));

    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => (item.bookId ? item.bookId._id : item.id)));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => prev.includes(itemId) ? prev.filter(selectedId => selectedId !== itemId) : [...prev, itemId]);
    };

    const handleQuantityChange = async (itemId, delta) => {
        const updatedCartItems = cartItems.map(item => {
            const currentItemId = item.bookId ? item.bookId._id : item.id;
            if (currentItemId === itemId) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: Math.min(newQuantity, 50) };
            }
            return item;
        });

        if (!user) {

            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        } else {

            try {

                const cartData = {
                    userId: user._id,
                    bookId: itemId,
                    quantity: updatedCartItems.find(item => itemId === (item.bookId ? item.bookId._id : item.id)).quantity // Số lượng mới
                };
                await updateCartItem(cartData);

            } catch (error) {
                console.error('Có lỗi khi cập nhật giỏ hàng vào cơ sở dữ liệu:', error);
            }

        }
        setCartItems(updatedCartItems);
    };


    const getTotalPrice = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cartItems.find(item => (item.bookId ? item.bookId._id : item.id) === itemId);
            return total + (item ? item.price * item.quantity : 0);
        }, 0);
    };

    const checkOut = async () => {
        
        const itemsToCheckOut = cartItems.filter(item => 
            selectedItems.includes(item.bookId ? item.bookId._id : item.id)
        );
        
        if (!user) {
            const productsData = await fetchProductDetails(cartItems);
            itemsToCheckOut.forEach(item => {
                const bookId = item.bookId ? item.bookId._id : item.id;
                item.bookId = productsData[bookId];
            });
        }
        const insufficientStockItems = [];
        
        for (const item of itemsToCheckOut) {
            const bookId = item.bookId ? item.bookId._id : item.id;

            const response = await getBookSale(bookId)
           console.log(response.data)
           const bookSale = response.data

    
           if (item.quantity > bookSale.quantity) {
               insufficientStockItems.push({
                   title: bookSale.bookId.title,
                   requested: item.quantity,
                   available: bookSale.quantity,
               });
           }
        }

        if (insufficientStockItems.length > 0) {
                   
            insufficientStockItems.map(item=>{
                toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                        {item.title}: chỉ còn lại {item.available} cuốn
                    </div>,
                        {
                            position: "top-center", // Hiển thị toast ở vị trí trung tâm trên
                            autoClose: 4000, 
                            hideProgressBar: true, // Ẩn thanh tiến độ
                            closeButton: false, // Ẩn nút đóng
                            className: "custom-toast", // Thêm class để tùy chỉnh CSS
                            draggable: false, // Tắt kéo di chuyển
                            rtl: false, // Không hỗ trợ RTL
                        }
                    );
            })
            
            return; // Dừng thanh toán nếu có sản phẩm không đủ số lượng
        }
        localStorage.setItem('itemsPayment', JSON.stringify(itemsToCheckOut));
        localStorage.removeItem('discount');
        
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
                                    const itemId = item.bookId ? item.bookId._id : item.id;
                                    const product = products[itemId];

                                    if (!product) return null;
                                    return (
                                        <div key={itemId} className="row align-items-center pb-3">
                                            <div className="col-3 col-md-2 d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-1"
                                                    checked={selectedItems.includes(itemId)}
                                                    onChange={() => handleSelectItem(itemId)}
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
                                                        onClick={() => handleQuantityChange(itemId, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2 text-center" style={{ width: '30px', fontWeight: '500' }}>{item.quantity}</span>
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm px-2"
                                                        onClick={() => handleQuantityChange(itemId, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="text-danger fw-semibold ms-4 text-center" style={{ width: '120px', fontSize: '16px' }}>
                                                    {formatCurrency(item.quantity * item.price)}
                                                </span>
                                                <button className="btn btn-link text-muted ms-3" onClick={() => handleDeleteItemCart(itemId)}>
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
                            <h5 className="fw-bold mb-3">Thành tiền</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Tổng số tiền (gồm VAT)</span>
                                <span className="text-danger fw-semibold">{formatCurrency(getTotalPrice())}</span>
                            </div>
                            {(getTotalPrice() > 0) ? (
                                <div>
                                    <button className="btn btn-danger w-100 mb-2" onClick={checkOut}>THANH TOÁN</button>
                                </div>
                            ) : (
                                <div>
                                    <div>
                                        <button
                                            className="btn btn-danger w-100 mb-2"
                                            onClick={checkOut}
                                            disabled={getTotalPrice() <= 0}
                                        >
                                            THANH TOÁN
                                        </button>
                                    </div>
                                </div>
                            )}


                           
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Cart;

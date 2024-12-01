import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from 'react';
import { fetchBook } from '../../services/bookService';
import { addItemToCart } from '../../services/cartService';
import { useStateContext } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import '../../css/user/ProductDetail.scss'

import BookReviews from '../../components/BookReviews';


const ProductDetail = () => {
    const { productId } = useParams();
    const [bookDetail, setBookDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(1);
    const [expanded, setExpanded] = useState(false);
    const { user } = useStateContext();
    const navigate = useNavigate();

    const [bookSale, setBookSale] = useState({ price: 0, discount: 0 });
    const priceDiscount = bookSale.price - (bookSale.price * (bookSale.discount / 100));

    useEffect(() => {
        const fetchBookSaleDetails = async () => {
            const response = await fetch(`http://localhost:4000/api/bookSales/${productId}`);
            const data = await response.json();

            if (response.ok) {
                setBookSale(data); // Cập nhật giá và trạng thái của sách từ bookSaleModel
            }
        };

        fetchBookSaleDetails();
    }, [productId]);


    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };


    useEffect(() => {
        const getBookDetail = async () => {
            try {
                const book = await fetchBook(productId);
                setBookDetail(book);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching book:', error);
                setError('Không thể tải dữ liệu sách');
                setLoading(false);
            }
        };
        getBookDetail();
    }, [productId]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;
    if (!bookDetail) return <p>Không tìm thấy sách</p>;

    const getBook = () => {
        alert(productId);
    }

    const increaseAmount = () => {
        setAmount((prevAmount) => prevAmount + 1);
    };

    const decreaseAmount = () => {
        setAmount((prevAmount) => (prevAmount > 1 ? prevAmount - 1 : 1));
    };

    const fullText = bookDetail.description;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const isTextLong = () => {
        const tempElement = document.createElement("div");
        tempElement.style.visibility = "hidden";
        tempElement.style.position = "absolute";
        tempElement.style.maxWidth = "600px"; // Width of the card
        tempElement.style.fontSize = "1rem"; // Match the font size
        tempElement.innerText = fullText;
        document.body.appendChild(tempElement);
        const isLong = tempElement.scrollHeight > 100; // Compare to max height
        document.body.removeChild(tempElement);
        return isLong;
    };

    const showMoreButton = isTextLong();

    const handleAddItemToCart = async (itemData) => {
        try {
            await addItemToCart(itemData);
        }
        catch (error) {
            console.log("lỗi, không thể thêm giỏ hàng", error)
        }
    }

    const addToCart = (product) => {
        if (user) {
            const itemData = { userId: user._id, bookId: product._id, quantity: amount, price: priceDiscount }
            handleAddItemToCart(itemData);
        }
        else {


            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingProduct = cart.find(item => item.id === product._id);
            if (existingProduct) {
                // Nếu có, cập nhật số lượng sản phẩm trong giỏ hàng
                existingProduct.quantity += amount;
            } else {
                // Nếu không, thêm sản phẩm mới vào giỏ hàng
                cart.push({ id: product._id, quantity: amount, price: priceDiscount });
            }

            // Lưu giỏ hàng vào Local Storage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
       
        setAmount(1);
        toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
            Sản phẩm đã được thêm vào giỏ hàng
           
          </div>, 
          {
            position: "top-center", // Hiển thị toast ở vị trí trung tâm trên
            autoClose: 1500, // Đóng sau 3 giây
            hideProgressBar: true, // Ẩn thanh tiến độ
            closeButton: false, // Ẩn nút đóng
            className: "custom-toast", // Thêm class để tùy chỉnh CSS
            draggable: false, // Tắt kéo di chuyển
            rtl: false, // Không hỗ trợ RTL
          }
        );
       
    };


   


    const handleCheckout = (product) => {
       
       const productsData = {};
       productsData[product._id] = bookDetail;
       const itemData = {
        bookId: productsData[product._id],
        title: product.title,
        quantity: 1,
        price: priceDiscount
    };

    // Lưu vào localStorage
    localStorage.setItem('itemsPayment', JSON.stringify([itemData])); // Giả sử chỉ có 1 sản phẩm trong lúc này

    // Sau khi lưu xong, chuyển hướng đến trang thanh toán
    navigate('/checkout');
    }

    return (
        <div className="container mt-4">

            <div className="row">
                <div className="col-md-4">
                    <div className="bg-white p-3 rounded shadow-sm d-flex justify-content-center align-items-center">
                        <img
                            alt={`${bookDetail.title}`}
                            className="img-fluid w-90 d-block rounded"
                            src={bookDetail.images}
                            style={{ height: "300px", objectFit: "cover" }}
                        />
                    </div>
                    <div className="d-flex align-items-center mt-3">
                        <label className="me-2" htmlFor="quantity">Số lượng:</label>
                        <button className="btn btn-outline-secondary" onClick={decreaseAmount}>-</button>
                        <input className="form-control mx-2 text-center" id="quantity" type="text" value={amount} style={{ width: "50px" }} onChange={(e) => {
                            const value = (Number(e.target.value))
                            if (value <= 50) {
                                setAmount(value)
                            }
                        }
                        }
                        />
                        <button className="btn btn-outline-secondary" onClick={increaseAmount}>+</button>
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-outline-danger me-2" onClick={() => addToCart(bookDetail)}><i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng</button>
                        <button className="btn btn-danger w-50" onClick={() => handleCheckout(bookDetail)}>Mua ngay</button>
                    </div>

                </div>

                {/* Phần chi tiết sản phẩm với cuộn riêng */}
                <div className="col-md-8">
                    <div className="bg-white p-3 rounded shadow-sm" style={{ height: "600px", overflowY: "auto" }}>
                        <h1 className="fs-4 fw-bold">{bookDetail.title}</h1>
                        <p>Nhà xuất bản: <strong>{bookDetail.publisher}</strong></p>
                        <p>Hình thức bìa: <strong>Bìa Mềm</strong></p>
                        <p>Tác giả: <strong>{bookDetail.author}</strong></p>
                        <div className="d-flex align-items-center mb-2">
                            <div className="text-muted">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <span className="ms-2">(0 đánh giá)</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <span className="fs-3 text-danger fw-bold">{formatCurrency(priceDiscount)}</span>
                            <span className="ms-2 text-muted text-decoration-line-through">{formatCurrency(bookSale.price)}</span>
                            <span className="ms-2 bg-danger text-white px-2 rounded">{bookSale.discount} %</span>
                        </div>
                        <div className="bg-light p-3 rounded">
                            <h5>Thông tin vận chuyển</h5>
                            <p>Giao hàng đến <strong>Phường Bến Nghé, Quận 1, Hồ Chí Minh</strong> <a className="text-primary" href="#">Thay đổi</a></p>
                            <p><i className="fas fa-truck"></i> Giao hàng tiêu chuẩn</p>
                            <p>Dự kiến giao <strong>Thứ năm - 31/10</strong></p>
                        </div>
                        <div className="bg-light p-3 rounded mt-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="ms-2">Mã giảm 10k - đơn từ 100k</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="ms-2">Mã giảm 25k - đơn từ 200k</span>
                            </div>
                        </div>
                        <div className="container my-5">
                            <div className="card shadow-sm p-4">
                                <h1 className="card-title fs-4 fw-bold text-dark mb-4">Thông tin chi tiết</h1>
                                <div className="card-body">
                                    {[
                                        { label: "Mã hàng", value: `${bookDetail._id}` },
                                        { label: "Tác giả", value: `${bookDetail.author}` },

                                        { label: "NXB", value: `${bookDetail.publisher}` },

                                        { label: "Thể loại", value: `${bookDetail.categoryId.nameCategory}` },

                                    ].map((item, index) => (
                                        <div key={index} className="row border-bottom py-2">
                                            <div className="col-4 fw-semibold ">{item.label}</div>
                                            <div className="col-8 text-dark">{item.value}</div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>


                        <div className="card p-4 shadow-lg">
    <h1 className="card-title fs-3 fw-bold mb-3 text-center">Mô tả sản phẩm</h1>

    <div
        style={{
            maxHeight: expanded ? 'none' : '100px', // Điều chỉnh chiều cao tối đa
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
        }}
        dangerouslySetInnerHTML={{ __html: fullText }}  // Set HTML content here
    />

    {showMoreButton && (
        <div className="text-center mt-3">
            <button className="btn-link" onClick={toggleExpanded}>
                {expanded ? "Rút gọn" : "Xem thêm"}
            </button>
        </div>
    )}
</div>

                    </div>


                </div>
            </div>
            <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
                <div className="bg-white p-5 rounded shadow w-100" >
                    <BookReviews bookId = {productId}/>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default ProductDetail;
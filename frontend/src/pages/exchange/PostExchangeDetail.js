import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useRef } from 'react';
import { fetchBook } from '../../services/bookService';
import { addItemToCart } from '../../services/cartService';
import { useStateContext } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import '../../css/user/ProductDetail.scss'

import ReviewUser from '../../components/customer/BookExchange/ReviewUser';


const PostExchangeDetail = () => {
    const { productId } = useParams();
    const [bookDetail, setBookDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const { user } = useStateContext();
    const navigate = useNavigate();
    const exchangeButtonRef = useRef(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleScrollToExchangeButton = () => {
        if (exchangeButtonRef.current) {
            exchangeButtonRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [bookSale, setBookSale] = useState({ price: 0, discount: 0 });
    const priceDiscount = bookSale.price - (bookSale.price * (bookSale.discount / 100));

    useEffect(() => {
        const fetchBookSaleDetails = async () => {
            const response = await fetch(`http://localhost:4000/api/bookSales/${productId}`);
            const data = await response.json();

            if (response.ok) {
                setBookSale(data);
                if (data.quantity > 0) {
                    setAmount(1);
                }
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
                const book = {
                    title: "hii",
                    images: "https://res.cloudinary.com/dyu419id3/image/upload/v1734341567/uploads/cl3qool78uh38wytk29h.webp"
                    , description: "Sách bị hỏng 1 vài phần",
                    publisher: "Sách bị hư bìa",
                    quantity: 10
                }
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

    const increaseAmount = () => {
        setAmount((prevAmount) => {
            return prevAmount < bookSale.quantity ? prevAmount + 1 : prevAmount;
        });
    };

    const decreaseAmount = () => {
        if (bookSale.quantity > 0)
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


        if (amount > 0) {


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
        }
        else if (amount === 0 && bookSale.quantity <= 0) {
            toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                Sản phẩm đã hết hàng vui lòng quay lại sau

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
        }
        else if (amount === 0 && bookSale.quantity > 0) {
            toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                Vui lòng chọn số lượng

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
        }
        setAmount(0);

    };





    const handleSendRequest = () => {
        toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
            Đã gửi đề nghị trao đổi

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
    }

    return (
        <div className="container mt-4">

            <div className="row">

                <div className="bg-white p-3 rounded shadow-sm d-flex justify-content-center align-items-center">
                    <img
                        alt={`${bookDetail.title}`}
                        className="img-fluid w-90 d-block rounded"
                        src={bookDetail.images}
                        style={{ height: "300px", objectFit: "cover" }}
                        ref={exchangeButtonRef}
                    />
                </div>

                <div className="d-flex justify-content-between mt-3">

                    <button

                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                        onClick={() => handleSendRequest()}

                    >
                        Đề nghị trao đổi
                    </button>
                </div>




                {/* Phần chi tiết sản phẩm với cuộn riêng */}

                <div className="bg-white p-3 rounded shadow-sm" >
                    <div className="mb-4">
                        <h1 className="fs-4 fw-bold text-primary mb-3">{bookDetail.title}</h1>

                        <p className="mb-2">
                            <i className="bi bi-book-half me-2"></i>
                            Tình trạng sách: <strong>{bookDetail.publisher}</strong>
                        </p>

                        <p className="mb-2">
                            <i className="bi bi-person-fill me-2"></i>
                            Tác giả: <strong>{bookDetail.author}</strong>
                        </p>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                        <span className="me-2 text-warning">
                            <i className="bi bi-check-circle"></i>
                        </span>
                        <span className="badge bg-success text-white">
                            Sẵn sàng trao đổi
                        </span>

                    </div>

                    <div className="d-flex align-items-center mb-3">

                        <span className="fs-3 text-danger fw-bold">
                            100 điểm
                        </span>
                    </div>

                    <div className="container my-5">
                        <div className="card shadow-sm p-4">
                            <h1 className="card-title fs-4 fw-bold text-dark mb-4">Thông tin chi tiết</h1>
                            <div className="card-body">
                                {[
                                    { label: "Mã hàng", value: `${bookDetail._id}` },
                                    { label: "Tác giả", value: `${bookDetail.author}` },

                                    { label: "NXB", value: `${bookDetail.publisher}` },

                                    { label: "Thể loại", value: `${bookDetail.categoryId?.nameCategory}` },

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
            <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
                <div className="bg-white p-5 rounded shadow w-100" >
                    <ReviewUser bookId={productId} />
                </div>
            </div>
            

            <ToastContainer />
        </div>
    );
}

export default PostExchangeDetail;
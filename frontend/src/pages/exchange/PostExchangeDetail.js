import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useRef } from 'react';
import { useStateContext } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import '../../css/user/ProductDetail.scss'

import ReviewUser from '../../components/customer/BookExchange/ReviewUser';
import ListUserRequest from '../../components/customer/BookExchange/ListUserRequest';


const PostExchangeDetail = () => {
    const { productId } = useParams();
    const [bookDetail, setBookDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const { user } = useStateContext();
    const navigate = useNavigate();
    const exchangeButtonRef = useRef(null);

    useEffect(() => {
        const getBookDetail = async () => {
            try {
                const book = {
                    title: "Từ vựng Ielts",
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

                <div className="d-flex justify-content-between mt-3 mb-3">
                    {user ?
                        (<ListUserRequest />) :
                        (<button

                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                            onClick={() => handleSendRequest()}

                        >
                            Đề nghị trao đổi
                        </button>)}

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

                                    { label: "Mô tả", value: `${bookDetail.publisher}` },

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
                <div className="user-section d-flex justify-content-between align-items-center mt-5">
                    <div className="user-profile d-flex justify-content-center text-center align-items-center">
                        <img alt='user-image' className='rounded-circle me-2' style={{ width: '50px', height: '50px' }}
                            src='https://api-private.atlassian.com/users/6b5c1609134a5887d7f3ab1b73557664/avatar'
                        />
                        <span className='text-dark fw-bold'> Lê Hoàng Minh Tài</span>
                    </div>
                    <button className='btn btn-primary'><span className='me-2'>Trao đổi</span>
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
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
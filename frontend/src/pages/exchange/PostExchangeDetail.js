import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useRef } from 'react';
import { useStateContext } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import '../../css/user/ProductDetail.scss'

import ReviewUser from '../../components/customer/BookExchange/ReviewUser';
import ListUserRequest from '../../components/customer/BookExchange/ListUserRequest';
//service
import { getBookExchangeSer } from '../../services/exchange/bookExchangeService';
import EditPostForm from '../../components/customer/BookExchange/EditPostForm';

const PostExchangeDetail = () => {
    const { bookExchangeId } = useParams();
    const [bookExchangeDetail, setBookExchangeDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);
   
    const { user } = useStateContext();
    const navigate = useNavigate();
    const exchangeButtonRef = useRef(null);

    const getBookExchange = async () => {
        try {
            const response = await getBookExchangeSer(bookExchangeId);
            console.log(response);
            if (response.data.success) {
                setBookExchangeDetail(response.data.bookExchange);

            }

        } catch (error) {

        }
    }

    useEffect(() => {
        getBookExchange();
        console.log(bookExchangeDetail);
    }, []);



  


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

    const getConditionBadge = (condition) => {
        switch (condition) {
            case "new-unused":
                return <span className="badge bg-success text-white">Mới (Chưa sử dụng)</span>;
            case "new-used":
                return <span className="badge bg-primary text-white">Như mới (Đã sử dụng ít)</span>;
            case "old-intact":
                return <span className="badge bg-info text-white">Cũ (Còn nguyên vẹn)</span>;
            case "old-damaged":
                return <span className="badge bg-warning text-dark">Cũ (Không còn nguyên)</span>;
            default:
                return null;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "available":
                return <span className="status-badge status-pending">⏳ Đang đợi trao đổi</span>;
            case "processing":
                return <span className="status-badge status-processing">🔄 Đang xử lý</span>;
            case "completed":
                return <span className="status-badge status-completed">✅ Đã đổi</span>;
            default:
                return null;
        }
    };

    const handleShowModal = () => {
        if (user) {
            setShowModal(true);
        }
        else {
            navigate('/auth');
        }
    }
    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="container mt-4">

            <div className="row">

                <div className="bg-white p-3 rounded shadow-sm d-flex justify-content-center align-items-center">
                    <img
                        alt={`${bookExchangeDetail?.title}`}
                        className="img-fluid w-90 d-block rounded"
                        src={bookExchangeDetail?.images[0]}
                        style={{ height: "300px", objectFit: "cover" }}
                        ref={exchangeButtonRef}
                    />
                </div>


                {(user?._id === bookExchangeDetail?.ownerId) &&

                    (<div className="d-flex justify-content-between mt-3 mb-3">
                        <button

                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap me-2"
                            onClick={() => handleShowModal()}

                        >
                            Chỉnh sửa thông tin
                        </button>
                        <button

                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                            onClick={() => handleSendRequest()}

                        >
                            Xóa bài đăng
                        </button>
                    </div>)}



                <div className="d-flex justify-content-between mt-3 mb-3">
                    {(user?._id === bookExchangeDetail?.ownerId) ?
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
                        <h1 className="fs-4 fw-bold text-primary mb-3">{bookExchangeDetail?.title} (<span className="fs-3 text-danger fw-bold">
                            35đ
                        </span>)</h1>

                        <p className="mb-2">
                            <i className="bi bi-book-half me-2"></i>
                            Tình trạng sách: <strong>{getConditionBadge(bookExchangeDetail?.condition)}</strong>
                        </p>

                        <p className="mb-2">
                            <i className="bi bi-person-fill me-2"></i>
                            Tác giả: <strong>{bookExchangeDetail?.author}</strong>
                        </p>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                        <span className="me-2 text-warning">
                            <i className="bi bi-check-circle"></i>
                        </span>
                        <span className="badge bg-success text-white">
                            {getStatusBadge(bookExchangeDetail?.status)}
                        </span>

                    </div>

                    <div className="d-flex align-items-center mb-3">

                        <span className="fs-3 text-danger fw-bold">
                            {bookExchangeDetail?.point}
                        </span>
                    </div>



                    <div className="card p-4 shadow-lg">
                        <h1 className="card-title fs-3 fw-bold mb-3 text-center">Ghi chú</h1>
                        <p className="card-text fs-5 fw-bold text-primary bg-light p-2 rounded">
                            {bookExchangeDetail?.description}
                        </p>


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
                    <ReviewUser />
                </div>
            </div>
            {showModal && (
                <EditPostForm handleCloseModal={handleCloseModal} exchangeBook={bookExchangeDetail}/>
            )}
            <ToastContainer />
        </div>
    );
}

export default PostExchangeDetail;
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useRef } from 'react';
import { useStateContext } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import '../../css/user/ProductDetail.scss'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import ReviewUser from '../../components/customer/BookExchange/ReviewUser';
import ListUserRequest from '../../components/customer/BookExchange/ListUserRequest';
import RequestForm from '../../components/customer/BookExchange/RequestForm';
import EditPostForm from '../../components/customer/BookExchange/EditPostForm';
//service
import { getBookExchangeSer, deleteBookExchange } from '../../services/exchange/bookExchangeService';
import { checkRequestSer, deleteRequestSer } from '../../services/exchange/exchangeRequestService';


const PostExchangeDetail = () => {
    const { bookExchangeId } = useParams();
    const { user } = useStateContext();
    const [bookExchangeDetail, setBookExchangeDetail] = useState(null);
    const initialRequestForm = {
        requestId: null,
        bookRequestedId: bookExchangeId,
        bookExchangeMethod: "",
        exchangeBookId: null,
        requesterId: user ? user._id : null
    };
    
    const [requestForm, setRequestForm] = useState(initialRequestForm);
    

    const [exchangeBook, setExchangeBook] = useState(null)

    const [showModal, setShowModal] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);

    const navigate = useNavigate();
    const exchangeButtonRef = useRef(null);

    const [openProgress, setOpenProgress] = useState(false);
    const handleCloseProgress = () => {
        setOpenProgress(false);
    };
    const handleOpenProgress = () => {
        setOpenProgress(true);
    };

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

    const checkRequest = async () => {
        if (user) {
            const response = await checkRequestSer(requestForm);
            const result = response.data

            if (result.success) {

                setRequestForm({ ...requestForm, requestId: result.request._id, bookExchangeMethod: result.request.exchangeMethod,
                     exchangeBookId: result.request.exchangeBookId })
                if (result.request.exchangeMethod === 'book') {
                    setExchangeBook(result.book);
                    console.log(requestForm)
                }
            }

        }
        else return;
    }

    useEffect(() => {
        getBookExchange();
        console.log(bookExchangeDetail);
    }, []);

    useEffect(() => {
        checkRequest();
    }, [user?._id])

    const handleSendRequest = () => {
        if (!user) {
            navigate(`/auth?redirect=/exchange-post-detail/${bookExchangeId}`, { replace: true });

        } else {
            setShowRequestForm(true);
        }
    }

    const handleCloseRequestForm = () => {
        setShowRequestForm(false);
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

    const handleDeletePost = async () => {
        handleOpenProgress();
        try {
            const response = await deleteBookExchange(bookExchangeId);

            if (response.data.success) {
                handleCloseProgress();
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Xóa bài đăng thành công
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
                navigate('/my-post-exchange')
            }

        } catch (error) {

        }
    }

    const handleDeleteRequest = async () =>{
        try {
            if(requestForm.requestId){
                console.log(requestForm.requestId)
                const response = await deleteRequestSer(requestForm.requestId);
                console.log(response)
                if(response.data.success){
                    setRequestForm(initialRequestForm);
                }
            }
        } catch (error) {
            
        }
    }

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
                {requestForm.bookExchangeMethod !=='' && (
                <div className="card my-3 shadow">
                    <div className="card-header text-dark fw-bold">
                        Thông tin yêu cầu trao đổi
                    </div>
                    <div className="card-body">
                        {requestForm.bookExchangeMethod === "points" ? (
                            <div>
                                <p className="mb-0">
                                    Bạn đã yêu cầu trao đổi bằng <strong className='text-danger'>{bookExchangeDetail?.creditPoints} điểm</strong> để trao đổi sách.
                                </p>
                            </div>
                        ) : requestForm.bookExchangeMethod === "book" && exchangeBook && (
                            <div className="d-flex align-items-center">
                                <img
                                    src={exchangeBook?.images[0]}
                                    alt={exchangeBook?.title}
                                    className="img-thumbnail me-3"
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                                <div>
                                    <h5 className="card-title mb-1">{exchangeBook?.title}</h5>
                                    <p className="card-text mb-0">Tác giả: {exchangeBook?.author}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                )}

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
                            onClick={() => handleDeletePost()}

                        >
                            Xóa bài đăng
                        </button>
                    </div>)}



                <div className="d-flex justify-content-between mt-3 mb-3">
                    {(user?._id === bookExchangeDetail?.ownerId) ?
                        (<ListUserRequest />) :
                        (
                            requestForm.bookExchangeMethod === "" ?
                                <button

                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                    onClick={() => handleSendRequest()}

                                >
                                    Đề nghị trao đổi
                                </button>
                                :
                                <button

                                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                    onClick={() => handleDeleteRequest()}

                                >
                                    <i class="fa-solid fa-x me-2"></i>
                                    Hủy yêu cầu
                                </button>

                        )}

                </div>

                {/* Phần chi tiết sản phẩm với cuộn riêng */}

                <div className="bg-white p-3 rounded shadow-sm" >
                    <div className="mb-4">
                        <h1 className="fs-4 fw-bold text-primary mb-3">{bookExchangeDetail?.title} (<span className="fs-3 text-danger fw-bold">
                            {bookExchangeDetail?.creditPoints} đ
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
                    {/* <ReviewUser /> */}
                </div>
            </div>
            {showModal && (
                <EditPostForm handleCloseModal={handleCloseModal} exchangeBook={bookExchangeDetail} />
            )}
            {showRequestForm && (
                <RequestForm handleCloseModal={handleCloseRequestForm} checkRequest = {checkRequest}  bookExchangeId={bookExchangeId} />
            )}
            {openProgress && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openProgress}

            >
                <CircularProgress color="inherit" />
            </Backdrop>}
            <ToastContainer />
        </div>
    );
}

export default PostExchangeDetail;
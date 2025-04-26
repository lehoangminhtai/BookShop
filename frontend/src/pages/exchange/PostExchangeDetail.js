import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useRef } from 'react';
import { useStateContext } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import '../../css/user/ProductDetail.scss'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React from "react";
import Slider from "react-slick";
import '../../css/bootstrap.min.css'
import '../../css/style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//component
import AdSidebar from '../../components/admin/AdSidebar';
import ReviewUser from '../../components/customer/BookExchange/ReviewUser';
import ListUserRequest from '../../components/customer/BookExchange/ListUserRequest';
import RequestForm from '../../components/customer/BookExchange/RequestForm';
import EditPostForm from '../../components/customer/BookExchange/EditPostForm';
import ConfirmDialog from '../../components/customer/BookExchange/ConfirmDialog';
import ExchangeInfoConfirmForm from '../../components/customer/BookExchange/ExchangeInfoConfirmForm';
//service
import { getBookExchangeSer, deleteBookExchange, approvePostExchange } from '../../services/exchange/bookExchangeService';
import { checkRequestSer, deleteRequestSer, getExchangeRequestByBookRequested } from '../../services/exchange/exchangeRequestService';
//store
import { useChatStore } from '../../store/useChatStore';


const PostExchangeDetail = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const { bookExchangeId } = useParams();
    const { user } = useStateContext();
    const [bookExchangeDetail, setBookExchangeDetail] = useState(null);
    const [listRequest, setLisRequest] = useState([])

    const initialRequestForm = {
        requestId: null,
        bookRequestedId: bookExchangeId,
        bookExchangeMethod: "",
        exchangeBookId: null,
        requesterId: user ? user._id : null,
        status: 'pending',
    };

    const [requestForm, setRequestForm] = useState(initialRequestForm);


    const [exchangeBook, setExchangeBook] = useState(null)

    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [showListRequesterForm, setShowListRequesterForm] = useState(false);

    //chat
    const { setSelectedUser } = useChatStore();

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

                setRequestForm({
                    ...requestForm, requestId: result.request._id, bookExchangeMethod: result.request.exchangeMethod,
                    exchangeBookId: result.request.exchangeBookId, status: result.request.status
                })
                if (result.request.exchangeMethod === 'book') {
                    setExchangeBook(result.book);
                }
            }

        }
        else return;
    }

    const fetchListRequest = async () => {
        handleOpenProgress();
        try {
            if (bookExchangeId) {
                const response = await getExchangeRequestByBookRequested(bookExchangeId);

                if (response.data.success) {
                    const result = response.data.data;
                    setLisRequest(Array.isArray(result) ? result : [result]);
                }
                handleCloseProgress();
            }
        } catch {

        }
    }


    useEffect(() => {
        getBookExchange();
        fetchListRequest();
        checkRequest();
    }, [bookExchangeId])

    useEffect(() => {


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
            case "pending":
                return <span className="status-badge status-pending">⏳ Đang chờ duyệt bởi quản trị viên</span>;
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

    const handleShowModalDelete = () => {
        setShowModalDelete(true);
    }
    const handleCloseModalDelete = () => {
        setShowModalDelete(false);
    }

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
                handleCloseModalDelete();
                navigate('/my-post-exchange')
            }

        } catch (error) {

        }
    }

    const handleDeleteRequest = async () => {
        try {
            if (requestForm.requestId) {
                console.log(requestForm.requestId)
                const response = await deleteRequestSer(requestForm.requestId);
                console.log(response)
                if (response.data.success) {
                    setRequestForm(initialRequestForm);
                    toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                        Đã hủy yêu cầu
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
                }
            }
        } catch (error) {

        }
    }

    const handleClickDetailExchangeBook = (id) => {
        navigate(`/exchange-post-detail/${id}`);
        window.location.reload(true)
    }

    const handleOpenListRequest = () => {
        setShowListRequesterForm(true);
    }

    const handleCloseListRequest = () => {
        setShowListRequesterForm(false);
        fetchListRequest();
    }

    const handleShowModalConfirm = () => {
        setShowModalConfirm(true);
    }
    const handleCloseModalConfirm = () => {
        setShowModalConfirm(false);
    }

    const handleNavigateToDetail = () => {
        navigate(`/exchange/exchange-info-detail/${requestForm.requestId}`)
    }

    const handleClickChatButton = () => {
        if (user) {
            setSelectedUser(bookExchangeDetail?.ownerId);
            navigate(`/exchange/chat`);
        } else {
            navigate('/auth?redirect=/exchange-post-detail/${bookExchangeId}`, { replace: true });');
        }
    }

    const handleApprovePost = async () => {
        handleOpenProgress();
        try {
            const response = await approvePostExchange(bookExchangeId, user._id);
            console.log(response)
            if (response.data.success) {
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Duyệt bài đăng thành công
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
                handleCloseProgress();
                getBookExchange();
            }
        } catch (error) {

        }
    }

    return (
        <div className="d-flex">
            <div className="container mt-4" style={{ marginLeft: user?.role === 1 ? '11px' : '9px' }}>

                <div className="row">
                {bookExchangeDetail?.images.length > 1 ? 
                <div className="bg-white p-3 rounded shadow-sm  align-items-center" >
                    <Slider {...settings}>
                        {bookExchangeDetail?.images.map((image) => (
                            <img
                                alt={`${bookExchangeDetail?.title}`}
                              
                                src={image}
                                style={{  maxHeight: '100px', objectFit: 'cover' }}
                                className="img-fluid w-90 d-block rounded" 
                            />
                        ))}
                    </Slider>
                </div>
                : 
                    <div className="bg-white p-3 rounded shadow-sm d-flex justify-content-center align-items-center">
                        <img
                            alt={`${bookExchangeDetail?.title}`}
                            className="img-fluid w-90 d-block rounded"
                            src={bookExchangeDetail?.images[0]}
                            style={{ height: "300px", objectFit: "cover" }}
                            ref={exchangeButtonRef}
                        />
                    </div>
}
                    {requestForm.bookExchangeMethod !== '' && (
                        <div className="card my-3 shadow">
                            <div className="card-header text-dark fw-bold">
                                Thông tin yêu cầu trao đổi
                                {requestForm.status === 'pending' ? <span className="badge bg-warning text-dark ms-2">Chờ xác nhận</span> : requestForm.status === 'accepted'
                                    ? <span className="badge bg-success text-white ms-2">Đã chấp nhận</span> : requestForm.status === 'cancelled'
                                        ? <span className="badge bg-danger text-white ms-2">Đã bị hủy</span> : requestForm.status === 'processing'
                                                ? <span className="badge bg-primary text-white ms-2">Đang giao dịch</span> : <span className="badge bg-success text-white ms-2">Đã trao đổi</span>}
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
                                            onClick={() => handleClickDetailExchangeBook(exchangeBook._id)}
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

                    <div className="d-flex justify-content-between mt-3 mb-3">
                        {
                            user?.role === 1
                                ? (bookExchangeDetail?.status === 'pending' ? (
                                    <button
                                        className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                        onClick={() => handleApprovePost()}
                                    >
                                        <i className="fa-solid fa-check me-2"></i>
                                        Duyệt bài đăng
                                    </button>
                                ) : null)
                                : (
                                    (user?._id === bookExchangeDetail?.ownerId?._id) ?
                                        (<button

                                            className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                            onClick={() => handleOpenListRequest()}

                                        >
                                            <h4 className='h4 text-danger me-2'> ({listRequest.length}) </h4>   Danh sách yêu cầu trao đổi <i class=" ms-2 me-2 fa fa-external-link text-light" aria-hidden="true"></i>
                                        </button>)
                                        :
                                        (
                                            requestForm.bookExchangeMethod === "" ?
                                                <button

                                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                                    onClick={() => handleSendRequest()}

                                                >
                                                    Đề nghị trao đổi
                                                </button>
                                                : requestForm.status === 'pending' ?

                                                    <button

                                                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                                        onClick={() => handleDeleteRequest()}

                                                    >
                                                        <i class="fa-solid fa-x me-2"></i>
                                                        Hủy yêu cầu
                                                    </button>

                                                    : requestForm.status === 'accepted' ?

                                                        <button

                                                            className="btn btn-success w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                                            onClick={() => handleShowModalConfirm()}

                                                        >
                                                            <i class="fa-solid fa-check me-2"></i>
                                                            Xác nhận trao đổi
                                                        </button>

                                                        :
                                                        <button
                                                            type="button"
                                                            className="btn btn-warning w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                                            onClick={() => handleNavigateToDetail()}
                                                        >
                                                            Thông tin giao dịch
                                                            <i class=" ms-2 me-2 fa fa-external-link" aria-hidden="true"></i>
                                                        </button>
                                        )
                                )
                        }

                    </div>

                    {(user?._id === bookExchangeDetail?.ownerId?._id) &&

                        (<div className="d-flex justify-content-between mt-3 mb-3">
                            <button

                                className="btn btn-primary w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap me-2"
                                onClick={() => handleShowModal()}
                                disabled={bookExchangeDetail?.status !== 'available'}

                            >
                                Chỉnh sửa thông tin
                            </button>
                            <button

                                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center px-4 py-2 text-nowrap"
                                onClick={() => handleShowModalDelete()}
                                disabled={bookExchangeDetail?.status !== 'available'}

                            >
                                Xóa bài đăng <i class="fa-solid fa-trash text-light ms-2"></i>
                            </button>
                        </div>)}


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
                    <Link to={user?._id === bookExchangeDetail?.ownerId ? '/my-post-exchange' : `/user-profile/${bookExchangeDetail?.ownerId?._id}`}
                        className="user-profile d-flex justify-content-center text-center align-items-center text-decoration-none">
                        <img alt='user-image' className='rounded-circle me-2 border' style={{ width: '50px', height: '50px' }}
                            src={bookExchangeDetail?.ownerId?.image}
                        />
                        <span className='text-dark fw-bold'>{bookExchangeDetail?.ownerId?.fullName}</span>
                    </Link>
                    <button className='btn btn-primary'
                        onClick={() => handleClickChatButton()}
                        disabled={bookExchangeDetail?.status !== 'available'}
                    ><span className='me-2'>Trao đổi</span>
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
            {showModalDelete && (
                <ConfirmDialog handleClose={handleCloseModalDelete} content={'Xác nhận xóa bài đăng'} onConfirm={handleDeletePost} />
            )}
            {showRequestForm && (
                <RequestForm handleCloseModal={handleCloseRequestForm} checkRequest={checkRequest} bookExchangeId={bookExchangeId} />
            )}
            {showListRequesterForm && (
                <ListUserRequest handleCloseListRequest={handleCloseListRequest} bookRequestedId={bookExchangeId} />
            )}
            {showModalConfirm && (
                <ExchangeInfoConfirmForm onClose={handleCloseModalConfirm} requestId={requestForm.requestId} />
            )}
            {openProgress && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openProgress}

                >
                    <CircularProgress color="inherit" />
                </Backdrop>}
                <ToastContainer />
            </div>
        </div>
    );
}

export default PostExchangeDetail;
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import { useStateContext } from "../../context/UserContext";

//service
import { getRequestByRequestId, acceptExchangeRequest, completeExchangeRequest, cancelExchangeRequest } from '../../services/exchange/exchangeRequestService';
import { getExchangeInforSer } from '../../services/exchange/exchangeInforService';
import { checkIfRequestIdExists } from '../../services/exchange/userReviewService';

//format
import { formatDate } from '../../lib/utils';
//component
import ExchangeInforForm from '../../pages/exchange/ExchangeInfoForm';
import ExchangeInfoConfirmForm from '../../components/customer/BookExchange/ExchangeInfoConfirmForm';
import UserReviewForm from '../../components/customer/BookExchange/UserReviewForm';
import ConfirmDialog from '../../components/customer/BookExchange/ConfirmDialog';
import ReportExchangeForm from '../../components/customer/BookExchange/ReportExchangeForm';

const ExchangeInfoDetail = (props) => {
    const { requestId } = useParams();
    const { user } = useStateContext();
    const userId = user._id;

    const [request, setRequest] = useState(null);
    const [infoForm, setInfoForm] = useState(null);
    const [owner, setOwner] = useState(null);
    const [requester, setRequester] = useState(null);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openReport, setOpenReport] = useState(false);

    const [startExchangeRequestId, setStartExchangeRequestId] = useState(null);
    const [confirmRequestId, setConfirmRequestId] = useState(null);

    const [hasReview, setHasReview] = useState(false);

    const steps = [
        'Gửi yêu cầu trao đổi', //0
        'Chấp nhận yêu cầu', //1
        'Điền thông tin giao dịch', //2
        'Xác nhận thông tin giao dịch', //3
        'Trao đổi sách', //4
        'Hoàn tất giao dịch', //5
        'Đánh giá người dùng nhận điểm', //6
    ];

    const activeStep = useMemo(() => {
        if (request?.status === 'pending') return 0;
        if (request?.status === 'accepted' && infoForm == null) return 1;
        if (request?.status === 'accepted' && infoForm?.status === 'pending') return 2;
        if (
            (request?.status === 'processing' && infoForm?.status === 'accepted') ||
            request?.status === 'owner_confirmed' ||
            request?.status === 'requester_confirmed'
        ) return 4;
        if (request?.status === 'completed') return 6;
        return 0;
    }, [request, infoForm]);


    const getRequestById = async () => {
        try {
            if (requestId) {
                const res = await getRequestByRequestId(requestId);
                console.log("getRequestByRequestId", res);
                if (res.data.success) {
                    setRequest(res.data.data);
                    setRequester(res.data.requester);
                    setOwner(res.data.owner);
                }

                if (res.data.data.status === 'completed') {
                    const hasReview = await checkReviewExists(res.data.data._id, userId);
                    setHasReview(hasReview);
                }
            }
        } catch (error) {
        }
    }
    const checkReviewExists = async (requestId, userId) => {
        try {
            const response = await checkIfRequestIdExists(requestId, userId);
            return response.data.exist;
        } catch (error) {
            console.error("Error checking request ID:", error);
            return false;
        }
    }
    const getExchangeInfoByRequestId = async () => {
        try {
            if (requestId) {
                const res = await getExchangeInforSer(requestId);
                console.log("getExchangeInforSer", res);
                if (res.success) {
                    setInfoForm(res.exchangeInfor);
                }
            }
        } catch (error) {

        }
    }

    const creditA = request?.bookRequestedId?.creditPoints || 0;
    const creditB = request?.exchangeBookId?.creditPoints || 0;

    const creditDiff = Math.abs(creditA - creditB);

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    }
    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    }
    const handleCloseReport = () => {
        setOpenReport(false);
    }
    const handleOpenReport = () => {
        setOpenReport(true);
    }

    const [showModalReview, setShowModalReview] = useState(false);
    const [reviewExchange, setReviewExchange] = useState(null);

    const handleShowModalReview = (exchange) => {
        setReviewExchange(exchange);
        setShowModalReview(true);
    };

    const handleCloseModalReview = () => {
        setShowModalReview(false);
        setReviewExchange(null);
    };

    const handleConfirm = (requestId) => {
        return () => {
            handleCompletedRequest(requestId);
            handleCloseConfirm();
        };
    }

    const handleClickRequest = async (requestId) => {
        if (requestId) {
            try {
                const response = await acceptExchangeRequest({ requestId, userId });
                console.log("Response from acceptExchangeRequest:", response);
                if (response.data.success) {
                    toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                        {response.data.message}
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
                    getRequestById(); // Cập nhật lại thông tin yêu cầu sau khi chấp nhận

                }
                if (!response.data.success) {
                    toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                        {response.data.message}

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
            } catch (error) {
                console.error("Lỗi khi chấp nhận yêu cầu:", error);
                toast.error(error.response.data.message || "Đã xảy ra lỗi, vui lòng thử lại!", {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeButton: false,
                    className: "custom-toast",
                    draggable: false,
                    rtl: false,
                });
            }
        }
    }
    const handleCompletedRequest = async (requestId) => {
        if (requestId) {
            try {
                const response = await completeExchangeRequest({ requestId, userId });
                if (response.data.success) {
                    toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                        {response.data.message}
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
                    getRequestById(); // Cập nhật lại thông tin yêu cầu sau khi hoàn thành

                }
                if (!response.data.success) {
                    toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                        {response.data.message}

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
            } catch (error) {
                toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                    {error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!"}
                </div>);
                console.error("Lỗi khi xác nhận hoàn thành:", error);
            }
        }
    }
    const handleStartExchange = (requestId) => {
        setStartExchangeRequestId(requestId);
    };
    const handleConfirmRequest = (requestId) => {
        setConfirmRequestId(requestId);
    }
    const [cancelled, setCancelled] = useState(false);

    const handleCancelRequest = async (requestId) => {
        try {
            if (requestId) {
                const response = await cancelExchangeRequest(requestId);
                if (response.data.success) {
                    setCancelled(true);
                    toast.success("Yêu cầu đã được hủy!");
                }
                if (!response.data.success) {
                    toast.error(response.data.message || "Đã xảy ra lỗi khi hủy yêu cầu, vui lòng thử lại!");
                }
            }
        } catch (error) {
            console.error("Lỗi khi hủy yêu cầu:", error);
            toast.error("Đã xảy ra lỗi khi hủy yêu cầu, vui lòng thử lại!");
        }
    }

    useEffect(() => {
        getRequestById();
        getExchangeInfoByRequestId();
    }, [requestId, showModalReview, startExchangeRequestId, confirmRequestId, openConfirm, cancelled]);

    const renderActionButtons = () => {
        if (user.role === 0) {
            if (request?.status === 'pending' && request?.requesterId !== userId) {
                return (
                    <>
                        <button className="btn btn-primary d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                            onClick={() => handleClickRequest(request?._id)}>
                            <i className="fa-solid fa-check-circle me-2"></i>
                            Chấp nhận yêu cầu
                        </button>
                        <button className=' btn btn-danger d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm'
                            onClick={() => handleCancelRequest(request._id)}
                        > Hủy giao dịch </button>
                    </>
                );
            } else if (request?.status === 'accepted' && infoForm == null) {
                if (request?.requesterId !== userId) {
                    return (
                        <>
                            <button className="btn btn-secondary d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                                onClick={() => handleStartExchange(request._id)}>
                                <i className="fa-solid fa-user-check me-2"></i>
                                Điền thông tin giao dịch
                            </button>
                            <button className=' btn btn-danger d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm'
                                onClick={() => handleCancelRequest(request._id)}
                            > Hủy giao dịch </button>

                        </>
                    );
                } else {
                    return (
                        <button className=' btn btn-danger d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm'
                            onClick={() => handleCancelRequest(request._id)}
                        > Hủy giao dịch </button>
                    )
                }
            } else if (request?.status === 'accepted' && infoForm?.status === 'pending') {
                if (request?.requesterId === userId) {
                    return (
                        <>
                            <button className="btn btn-secondary d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                                onClick={() => handleConfirmRequest(request._id)}>
                                <i className="fa-solid fa-user-check me-2"></i>
                                Xác nhận thông tin
                            </button>

                        </>
                    );
                } else {
                    return (
                        <>
                            <button className="btn btn-secondary d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                                onClick={() => handleStartExchange(request._id)}>Cập nhật thông tin</button>
                        </>
                    );
                }
            } else if (request?.status === 'processing' && infoForm?.status === 'accepted') {
                return (
                    <>
                        <button className="btn btn-success d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                            onClick={handleOpenConfirm}>
                            <i className="fa-solid fa-check-circle me-2"></i>
                            Xác nhận hoàn thành

                        </button>
                    </>
                )
            }
        }
        if (request?.status === 'owner_confirmed') {
            if (request?.requesterId === userId || user.role === 1) {
                return (
                    <>
                        <button className="btn btn-success d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                            onClick={handleOpenConfirm}>
                            <i className="fa-solid fa-check-circle me-2"></i>
                            Xác nhận hoàn thành

                        </button>
                    </>
                )
            }
        } else if (request?.status === 'requester_confirmed') {
            if (request?.ownerId !== userId || user.role === 1) {
                return (
                    <>
                        <button className="btn btn-success d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                            onClick={handleOpenConfirm}>
                            <i className="fa-solid fa-check-circle me-2"></i>
                            Xác nhận hoàn thành

                        </button>
                    </>
                )
            }
        } else if (request?.status === 'completed' && user.role === 0) {
            return (
                <>
                    {!hasReview && (
                        <button className="btn btn-secondary d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleShowModalReview(request);
                            }}>
                            <i className="fa-solid fa-user-check me-2"></i>
                            Phản hồi người trao đổi
                        </button>
                    )}
                </>
            )
        } else {
            return null;
        }
    }
    return (
        <div className='container mt-5'>
           
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <div className=" mt-5 w-100" >
                <h1 className="h1 text-center fw-bold">Thông tin giao dịch</h1>
                <div className="">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to={`/exchange-post-detail/${request?.bookRequestedId?._id}`} className="text-decoration-none text-dark">
                            <div className="text-center cursor-pointer">
                                <div
                                    className="bg-secondary rounded"

                                ></div>
                                <img
                                    src={request?.bookRequestedId?.images[0]}
                                    style={{ width: "150px", height: "160px" }}
                                ></img>
                                <p className="mt-2 fw-bold text-dark "
                                    style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                >{request?.bookRequestedId?.title}</p>
                                <h5 className='h5  text-danger fw-bold'>{request?.bookRequestedId?.creditPoints} đ</h5>
                                <div className="mt-2">
                                    <span className="badge bg-success px-3 py-1">
                                        <i className="bi bi-person-fill me-1"></i> Chủ sở hữu
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <hr className="flex-grow-1 mx-3 text-primary" style={{ height: "1px" }} />

                        <div className="position-relative">
                            <div
                                className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "50px", height: "50px" }}
                            >
                                <i class="fa fa-exchange text-light" aria-hidden="true"></i>
                            </div>
                        </div>

                        <hr className="flex-grow-1 mx-3 text-primary" style={{ height: "1px" }} />

                        <div className="text-center">
                            {request?.exchangeMethod === 'book' ?
                                <Link to={`/exchange-post-detail/${request?.exchangeBookId?._id}`} className="text-decoration-none text-dark">
                                    <img
                                        src={request?.exchangeBookId?.images[0]}
                                        style={{ width: "150px", height: "160px" }}
                                    ></img>

                                    <p className="mt-2 fw-bold text-dark"
                                        style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                    >{request?.exchangeBookId?.title}</p>
                                    <h5 className='h5  text-danger fw-bold'>{request?.exchangeBookId?.creditPoints} đ</h5>
                                </Link>
                                :
                                <h2 className="h2 text-center">
                                    <span className="badge bg-danger text-white px-3 py-2 rounded-pill">
                                        💰 {creditDiff} đ
                                    </span>
                                </h2>
                            }
                            <div className="mt-2">
                                <span className="badge bg-danger px-3 py-1">
                                    <i className="bi bi-person-lines-fill me-1"></i> Người yêu cầu
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className={`alert text-center fw-bold d-flex align-items-center justify-content-center gap-2 alert-warning text-dark`}
                        role="alert"
                    >
                        {
                            request?.status === 'pending' ? (
                                <>
                                    <i className="bi bi-hourglass-split text-info fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-info text-dark">Chờ chấp nhận</span></span>
                                </>
                            ) : request?.status === 'accepted' && infoForm == null ? (
                                <>
                                    <i className="bi bi-pencil-square text-primary fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-primary">Chờ điền thông tin giao dịch</span></span>
                                </>
                            ) : request?.status === 'accepted' && infoForm?.status === 'pending' ? (
                                <>
                                    <i className="bi bi-clock-history text-warning fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-warning text-dark">Chờ xác nhận thông tin giao dịch</span></span>
                                </>
                            ) : request?.status === 'processing' && infoForm?.status === 'accepted' ? (
                                <>
                                    <i className="bi bi-arrow-repeat text-warning fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-warning text-dark">Đang thực hiện trao đổi</span></span>
                                </>
                            ) : request?.status === 'owner_confirmed' || request?.status === 'requester_confirmed' ? (
                                <>
                                    <i className="bi bi-person-check-fill text-secondary fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-secondary">Chờ xác nhận hoàn thành từ hai phía</span></span>
                                </>
                            ) : request?.status === 'completed' ? (
                                <>
                                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-success">Hoàn tất trao đổi</span></span>
                                </>
                            ) : request?.status === 'cancelled' ? (
                                <>
                                    <i className="bi bi-x-circle-fill text-danger fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-danger">Đã hủy</span></span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-info-circle-fill text-muted fs-5"></i>
                                    <span>Trạng thái: <span className="badge bg-light text-dark">Đang xử lý</span></span>
                                </>
                            )
                        }
                    </div>

                    {infoForm && (
                        <div>
                            <div className="mb-3">
                                <label className="form-label text-dark fw-bold">Địa điểm trao đổi</label>
                                <div className="p-4 rounded shadow bg-light">
                                    {/* Địa điểm giao dịch */}
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-geo-alt-fill text-danger fs-4"></i>
                                        <h4 className="h5 text-primary fw-bold mb-0">{infoForm?.transactionLocation}</h4>
                                    </div>

                                    {/* Ngày giờ giao dịch */}
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-clock-fill text-warning fs-4"></i>
                                        <p className="text-dark mb-0 fw-medium">
                                            {formatDate(infoForm?.transactionDate)} <span className="text-secondary">({infoForm?.transactionTime})</span>
                                        </p>
                                    </div>
                                    <div className="mt-2 d-flex align-items-center gap-2 p-3 rounded shadow bg-light">
                                        {infoForm?.deliveryMethod === 'direct' && (
                                            <>
                                                <i className="bi bi-person-check-fill text-success fs-4"></i>
                                                <span className="fw-bold text-success">Giao trực tiếp</span>
                                            </>
                                        )}
                                        {infoForm?.deliveryMethod === 'shipping' && (
                                            <>
                                                <i className="bi bi-truck text-primary fs-4"></i>
                                                <span className="fw-bold text-primary">Gửi shipper</span>
                                            </>
                                        )}
                                        {!infoForm?.deliveryMethod || infoForm?.deliveryMethod === 'post-office' && (
                                            <>
                                                <i className="bi bi-envelope-fill text-warning fs-4"></i>
                                                <span className="fw-bold text-warning">Bưu điện</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 p-3 rounded shadow bg-light">
                                {/* Chủ sở hữu */}
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold text-dark">
                                        <i className="bi bi-person-fill text-primary me-2"></i> Chủ sở hữu
                                    </label>
                                    <div className="bg-primary text-white p-3 rounded fw-bold">
                                        {infoForm?.fullName_owner}
                                    </div>
                                    <div className="mt-2 d-flex align-items-center">
                                        <i className="bi bi-telephone-fill text-success me-2"></i>
                                        <span className="fw-semibold text-dark fst-italic ">{infoForm?.contactPhone_owner}</span>
                                    </div>
                                </div>

                                {/* Người yêu cầu */}
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold text-dark">
                                        <i className="bi bi-person-lines-fill text-danger me-2"></i> Người yêu cầu
                                    </label>
                                    <div className="bg-danger text-white p-3 rounded fw-bold">
                                        {infoForm?.fullName_requester}
                                    </div>
                                    <div className="mt-2 d-flex align-items-center">
                                        <i className="bi bi-telephone-fill text-success me-2"></i>
                                        <span className="fw-semibold text-dark fst-italic">{infoForm?.contactPhone_requester}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hiển thị thông tin bù điểm */}
                    {request && (
                        <div className="text-center my-4">
                            {request.bookRequestedId?.creditPoints !== request.exchangeBookId?.creditPoints ? (
                                <div className="alert alert-info d-flex flex-column align-items-center gap-2 p-3 shadow-sm">
                                    <i className="fa-solid fa-scale-balanced text-primary fs-3"></i>
                                    {request.bookRequestedId?.creditPoints > request.exchangeBookId?.creditPoints ? (
                                        <p className="mb-0 fw-bold text-dark">
                                            <span className="text-danger">
                                                {infoForm ? infoForm.fullName_requester : requester?.fullName}
                                            </span> sẽ trả thêm
                                            <span className="text-primary fs-4"> {creditDiff} điểm</span> cho
                                            <span className="text-success"> {infoForm ? infoForm.fullName_owner : owner?.fullName}</span> để cân bằng giao dịch.
                                        </p>
                                    ) : (
                                        <p className="mb-0 fw-bold text-dark">
                                            <span className="text-danger">{infoForm ? infoForm.fullName_owner : owner?.fullName}</span> sẽ trả thêm
                                            <span className="text-primary fs-4"> {creditDiff} điểm</span> cho
                                            <span className="text-success"> {infoForm ? infoForm.fullName_requester : requester?.fullName}</span>.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="alert alert-success text-center fw-bold">
                                    <i className="fa-solid fa-handshake me-2 text-success"></i>
                                    Giao dịch ngang điểm không cần bù thêm!
                                </div>
                            )}
                        </div>
                    )}

                    <div className="d-flex align-items-start bg-light border rounded p-3 mb-3">
                        <span className="me-2 text-primary fs-5">
                            <i className="bi bi-stickies"></i>
                        </span>
                        <div className="text-dark">
                            {infoForm?.notes || <span className="text-muted fst-italic">Không có ghi chú nào.</span>}
                        </div>
                    </div>


                    <div className="mt-3">

                        <div className="d-flex  justify-content-between gap-3 mt-3">
                            {renderActionButtons()}
                            {user.role === 0 &&
                                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                                    onClick={handleOpenReport}
                                >
                                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                    Báo cáo vấn đề
                                </button>
                            }
                        </div>


                    </div>

                    <p className='text-center mt-3 text-danger text-start fst-italic'>* Sau khi hoàn tất trao đổi nếu đối phương không xác nhận để có thể nhận điểm thì vui lòng báo cáo vấn đề và gửi minh chứng để quản trị giải quyết *</p>

                </div>
            </div>
            {openConfirm && (
                <ConfirmDialog
                    handleClose={handleCloseConfirm}
                    content="Xác nhận hoàn tất giao dịch ?"
                    onConfirm={handleConfirm(request._id)}
                />
            )}
            {openReport && (
                <ReportExchangeForm
                    handleClose={handleCloseReport}
                    requestId={requestId}
                />
            )}
            {startExchangeRequestId && (
                <ExchangeInforForm
                    requestId={startExchangeRequestId}
                    onClose={() => {
                        setStartExchangeRequestId(null);
                    }}
                />
            )}
            {confirmRequestId && (
                <ExchangeInfoConfirmForm onClose={() => {
                    setConfirmRequestId(null);
                }} requestId={confirmRequestId} />
            )}
            {reviewExchange && (
                <div className="modal-overlay" style={{ marginTop: "50px" }}>
                    <div className="modal-content">
                        <button className="close-btn" onClick={handleCloseModalReview}>&times;</button>
                        <UserReviewForm

                            onClose={handleCloseModalReview}
                            reviewerId={userId} // Truyền danh sách sách của đơn hàng vào ReviewForm
                            reviewedUser={userId === requester?._id ? owner : requester}
                            requestId={reviewExchange._id}
                        />

                    </div>
                </div>
            )}
        </div>
    );

}
export default ExchangeInfoDetail;
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStateContext } from "../../context/UserContext";
import ExchangeInforForm from '../../pages/exchange/ExchangeInfoForm';
import ExchangeInfoConfirmForm from '../../components/customer/BookExchange/ExchangeInfoConfirmForm';

//service
import {
    getExchangeRequestsByUserId, getRequestsByRequesterSer, getExchangeRequestsByOwnerBook, acceptExchangeRequest
} from '../../services/exchange/exchangeRequestService'
import { getUserInfo } from '../../services/userService'
import { getBookExchangeSer } from '../../services/exchange/bookExchangeService'
import { getExchangeInforSer } from '../../services/exchange/exchangeInforService';

const MyExchangeOverview = () => {

    const { user } = useStateContext();
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("in-progress");
    const userId = user._id;
    const navigate = useNavigate();

    const [startExchangeRequestId, setStartExchangeRequestId] = useState(null);
    const [confirmRequestId, setConfirmRequestId] = useState(null);

    const handleStartExchange = (requestId) => {
        setStartExchangeRequestId(requestId);
    };
    const handleConfirmRequest = (requestId) => {
        setConfirmRequestId(requestId);
    }
    const fetchData = async () => {
        try {
            let response;
            if (activeTab === "in-progress" || activeTab === "completed" || activeTab === "canceled" || activeTab === "all") {
                response = await getExchangeRequestsByUserId(userId);
            } else if (activeTab === "sent") {
                response = await getRequestsByRequesterSer(userId);
            } else if (activeTab === "received") {
                response = await getExchangeRequestsByOwnerBook(userId);
            } else {
                return;
            }
            if (response.data.success) {
                const data = response.data.requests;
                let filteredRequests = data;
                if (activeTab === "in-progress") {
                    filteredRequests = data.filter(req => req.status === 'accepted' || req.status === 'processing');
                } else if (activeTab === "completed") {
                    filteredRequests = data.filter(req => req.status === "completed");
                } else if (activeTab === "canceled") {
                    filteredRequests = data.filter(req => req.status === "canceled");
                }
                const requests = await Promise.all(
                    filteredRequests.map(async (request) => {
                        const bookRequested = await getBookExchangeSer(request.bookRequestedId);
                        let exchangeBook = null;

                        if (request.exchangeMethod === "book") {
                            exchangeBook = await getBookExchangeSer(request.exchangeBookId);
                        }
                        let partner = null;
                        let isOwner = request.requesterId !== userId;
                        if (isOwner) {
                            // user là người sở hữu sách, người gửi là partner
                            const partner_request = await getUserInfo(request.requesterId);
                            partner = partner_request.data.user;
                        } else {
                            // user là người gửi request, chủ sách là partner
                            partner = bookRequested.data.bookExchange.ownerId;

                        }
                        let exchangeInfo = null;
                        if (request.status === "accepted" || request.status === "processing" || request.status === "completed") {
                            try {
                                const exchangeInfoRes = await getExchangeInforSer(request._id);

                                exchangeInfo = exchangeInfoRes.exchangeInfor;
                            } catch (err) {
                            }
                        }

                        return {
                            id: request._id,
                            status: request.status,
                            exchangeMethod: request.exchangeMethod,
                            bookRequested: bookRequested.data.bookExchange,
                            exchangeBook: exchangeBook ? exchangeBook.data.bookExchange : null,
                            partner: partner,
                            exchangeInfo: exchangeInfo ? exchangeInfo : null,
                            isOwner: isOwner,
                        }

                    })
                );

                setRequests(requests);
            }
        } catch (err) {
            console.error("Lỗi khi tải requests:", err);
        }
    };

    const handleClickRequest = async (requestId) => {
        if (requestId) {
            try {
                const response = await acceptExchangeRequest({ requestId, userId });
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
                    fetchData();

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
            }
        }
    }
    const handleNavigateToDetail = (requestId) => {
        navigate(`/exchange/exchange-info-detail/${requestId}`)
    }

    useEffect(() => {
        fetchData();
    }, [userId, activeTab]);

    const renderActionButtons = (request) => {

        if (request.status === "pending" ) {
       
            return(
            <>
             <button
                className="btn btn-success me-2"
                onClick={() => handleClickRequest(request.id)}>Chấp nhận</button>
                <button className=' btn btn-danger'> Hủy </button>
                </>
            );
            
        }

        if (request.status === "accepted" && request.exchangeInfo == null) {
            if (request.isOwner) {
                return (
                    <>
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => handleStartExchange(request.id)}>Điền thông tin giao dịch</button>
                        <button className="btn btn-danger">Hủy giao dịch</button>
                    </>
                );
            } else {
                return <button className="btn btn-danger">Hủy giao dịch</button>;
            }
        }

        if (request.status === "accepted" && request.exchangeInfo?.status === "pending") {
            if (!request.isOwner) {
                return (
                    <>
                        <button className="btn btn-warning me-2"
                            onClick={() => handleConfirmRequest(request.id)}>Xác nhận thông tin</button>
                        <button className="btn btn-danger">Hủy giao dịch</button>
                    </>
                );
            } else {
                return (
                    <>
                        <button className="btn btn-info me-2"
                            onClick={() => handleConfirmRequest(request.id)}>Xem thông tin</button>
                        <button className="btn btn-danger">Hủy giao dịch</button>
                    </>
                );
            }
        }

        if (request.status === "processing" && request.exchangeInfo?.status === "accepted") {
            return (
                <>
                    <button className="btn btn-success me-2">Xác nhận đã trao đổi</button>
                    <button className="btn btn-info"
                        onClick={() => handleConfirmRequest(request.id)}>Xem thông tin</button>
                </>
            );
        }

        if (request.status === "completed") {
            return <button className="btn btn-secondary"
                onClick={() => handleNavigateToDetail(request.id)}>Xem chi tiết giao dịch</button>;
        }

        return null;
    };

    return (
        <div className="auth-container">
            <div className="container p-4">
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button className={`nav-link fw-bold ${activeTab === "in-progress" ? "active fw-bold text-primary" : ""}`}
                            onClick={() => setActiveTab("in-progress")}>
                            Đang trao đổi
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link fw-bold ${activeTab === "sent" ? "active fw-bold text-primary" : ""}`}
                            onClick={() => setActiveTab("sent")}>
                            Yêu cầu đã gửi
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === 'received' ? 'active fw-bold text-primary' : ''}`}
                            onClick={() => setActiveTab("received")}
                        >
                            Yêu cầu đã nhận
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === 'completed' ? 'active fw-bold text-primary' : ''}`}
                            onClick={() => setActiveTab("completed")}
                        >
                            Hoàn thành
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === 'canceled' ? 'active fw-bold text-danger' : ''}`}
                            onClick={() => setActiveTab("canceled")}
                        >
                            Đã hủy
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === 'all' ? 'active fw-bold text-primary' : ''}`}
                            onClick={() => setActiveTab("all")}
                        >
                            Tất cả
                        </button>
                    </li>
                </ul>

                {/* Danh sách request */}
                <div className="row">
                    {requests.map((request, index) => (
                        <div className="card shadow mb-3" key={request._id}>

                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="card-title fw-bold mb-0">
                                        {!request.isOwner
                                            ? `Yêu cầu trao đổi đã gửi `
                                            : `Yêu cầu trao đổi đã nhận `}
                                    </h5>

                                    <span className="badge bg-info text-dark">
                                        {
                                            request.status === "pending"
                                                ? "Chờ chấp nhận"
                                                : request.status === "accepted" && request.exchangeInfo == null
                                                    ? "Chờ điền thông tin giao dịch"
                                                    : request.status === "accepted" && request.exchangeInfo?.status === "pending"
                                                        ? "Chờ xác nhận thông tin giao dịch"
                                                        : request.status === "processing" && request.exchangeInfo?.status === "accepted"
                                                            ? "Đang thực hiện trao đổi"
                                                            : request.status === "completed"
                                                                ? "Hoàn thành trao đổi"
                                                                : request.status === "canceled"
                                                                    ? "Đã hủy"
                                                                    : "Đang xử lý"
                                        }
                                    </span>

                                </div>
                                <div className="container-fluid d-flex justify-content-center"
                                    onClick={() => handleNavigateToDetail(request.id)}>

                                    <div className="d-flex align-items-center justify-content-center" style={{ width: "80%" }}>
                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                            <img
                                                src={request.bookRequested?.images?.[0]}
                                                style={{ width: 100, height: 120, objectFit: "cover" }}
                                                alt="Sách yêu cầu"
                                            />
                                            <p className="mt-2 fw-bold text-dark "
                                                style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                            >{request.bookRequested?.title}</p>

                                            <h5 className='h5  text-danger fw-bold'>{request?.bookRequested?.creditPoints} đ</h5>
                                        </div>

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

                                        {request.exchangeMethod === "book" ? (
                                            <div className="d-flex flex-column align-items-center justify-content-center ">

                                                <img src={request.exchangeBook?.images?.[0]} style={{ width: 100, height: 120, objectFit: "cover" }} alt="Sách trao đổi" />
                                                <p className="mt-2 fw-bold text-dark"
                                                    style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.exchangeBook?.title}</p>
                                                <h5 className='h5  text-danger fw-bold'>{request?.exchangeBook?.creditPoints} đ</h5>
                                            </div>
                                        ) :
                                            <h2 className="h2 text-center">
                                                <span className="badge bg-danger text-white px-3 py-2 rounded-pill">
                                                    💰 {request?.bookRequested?.creditPoints} đ
                                                </span>
                                            </h2>

                                        }
                                    </div>
                                </div>

                            </div>
                            <h5 className="card-title mb-0 fs-10" style={{ marginLeft: "30px" }}>
                                {!request.isOwner
                                    ? `Người nhận:`
                                    : `Người gửi yêu cầu:`}
                            </h5>
                            <div className="user-section d-flex align-items-center mt-10 justify-content-between" style={{ marginTop: "10px", marginBottom: "20px", marginLeft: "30px" }}>
                                <div className="d-flex align-items-center">
                                    <Link to={`/user-profile/${request?.partner?._id}`}
                                        className="user-profile d-flex justify-content-center text-center align-items-center text-decoration-none">
                                        <img
                                            alt='user-image'
                                            className='rounded-circle me-2 border'
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            src={request?.partner?.image}
                                        />
                                        <span className='text-dark fw-bold'>{request?.partner?.fullName}</span>
                                    </Link>
                                    <button className='btn btn-primary ms-3'>
                                        <span className='me-2'>Nhắn tin</span>
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                                <div className="d-flex align-items-center">
                                    {renderActionButtons(request)}
                                </div>
                            </div>
                        </div>


                    ))}
                    {startExchangeRequestId && (
                        <ExchangeInforForm
                            requestId={startExchangeRequestId}
                            onClose={() => {
                                setStartExchangeRequestId(null);
                                fetchData();
                            }}
                        />
                    )}
                    {confirmRequestId && (
                        <ExchangeInfoConfirmForm onClose={() => {
                            setConfirmRequestId(null);
                            fetchData();
                        }} requestId={confirmRequestId} />
                    )}

                </div>

            </div>
        </div>

    )
}

export default MyExchangeOverview
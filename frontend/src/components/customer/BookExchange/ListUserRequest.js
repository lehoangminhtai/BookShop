import { useEffect, useState } from 'react';
import { useStateContext } from '../../../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

//service 
import { getExchangeRequestByBookRequested, deleteRequestSer, acceptExchangeRequest } from '../../../services/exchange/exchangeRequestService';

const ListUserRequest = ({ handleCloseListRequest, bookRequestedId }) => {

    const { user } = useStateContext();
    const [listRequest, setLisRequest] = useState([])
    const [formAccept, setFormAccept] = useState({
        requestId: null,
        userId: user._id
    })

    const fetchListRequest = async () => {
        try {
            if (bookRequestedId) {
                const response = await getExchangeRequestByBookRequested(bookRequestedId);

                if (response.data.success) {
                    const result = response.data.data;
                    setLisRequest(Array.isArray(result) ? result : [result]);
                }
            }
        } catch {

        }
    }

    useEffect(() => {
        fetchListRequest();
    }, [bookRequestedId])

    const handleDeleteRequest = async (requestId) => {
        try {
            if (requestId) {
                const response = await deleteRequestSer(requestId);
                if (response.data.success) {
                    fetchListRequest();
                }
            }
        } catch (error) {

        }
    }

    const handleAcceptRequest = async () => {
        try {
            if (formAccept.requestId) {
                const response = await acceptExchangeRequest(formAccept);
                if (response.data.success) {
                    toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                        Đã chấp nhận yêu cầu

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
                    fetchListRequest();
                }
            }
        } catch (error) {

        }
    }

    const handleClickRequest = async (requestId) => {
        if (requestId) {
            setFormAccept({ ...formAccept, requestId: requestId });
            handleAcceptRequest();
        }

    }


    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Danh sách yêu cầu trao đổi</h5>
                        <button type="button" className="btn-close" onClick={() => handleCloseListRequest()}></button>
                    </div>
                    <div className="modal-body">

                        <div className="container mt-2 mb-2 bg-white p-3 rounded">
                            <div>
                                {listRequest.length > 0 ? (
                                    <>
                                        {listRequest.map((request) => (
                                            <div key={request?._id} className='card my-2 shadow'>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="user-profile d-flex justify-content-start text-center align-items-center mt-2 ms-2">
                                                        <img alt='user-image' className='rounded-circle me-2' style={{ width: '50px', height: '50px' }}
                                                            src={request.requesterId?.image}
                                                        />
                                                        <span className='text-dark fw-bold'>  {request.requesterId?.fullName} {request?.status === 'pending' ? (<span className='text-light bg-secondary rounded pe-1 ps-1'>Đang đợi</span>) : <span className='text-light bg-success rounded pe-1 ps-1'>Đã chấp nhận</span>}</span>
                                                    </div>
                                                    {request?.status === 'pending' && (
                                                        <div className="d-flex gap-1 me-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{ width: "40px", height: "40px" }}
                                                                onClick={() => handleClickRequest(request._id)}
                                                            >
                                                                <i className="fa fa-check"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{ width: "40px", height: "40px" }}
                                                                onClick={() => handleDeleteRequest(request?._id)}
                                                            >
                                                                <i className="fa fa-times"></i>
                                                            </button>

                                                        </div>
                                                    )}
                                                    {request?.status === 'accepted' && (
                                                        <div className="d-flex gap-1 me-2">
                                                            <Link to={'/exchange-form'}>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-success d-flex align-items-center justify-content-center"
                                                            >
                                                                Bắt đầu trao đổi
                                                                <i className="ms-1 fa fa-check"></i>
                                                            </button>
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary d-flex align-items-center justify-content-center"
                                                            >
                                                                Nhắn tin
                                                                <i class="ms-1 fa fa-paper-plane" aria-hidden="true"></i>
                                                            </button>


                                                        </div>
                                                    )}

                                                </div>

                                                <div className="card-body">
                                                    {request.exchangeMethod === "points" ? (
                                                        <div>
                                                            <p className="mb-0 text-dark">
                                                                Yêu cầu trao đổi bằng <strong className='text-danger'>điểm</strong> để trao đổi sách.
                                                            </p>
                                                            <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger  d-flex align-items-center justify-content-center"

                                                                    onClick={() => handleDeleteRequest(request?._id)}
                                                                >
                                                                    Hủy trao đổi
                                                                    <i className=" ms-1 fa fa-times"></i>
                                                                </button>
                                                        </div>
                                                    ) : request.exchangeMethod === "book" && request.exchangeBookId && (
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={request.exchangeBookId?.images[0]}
                                                                    alt={request.exchangeBookId?.title}
                                                                    className="img me-3"
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                                />
                                                                <div>
                                                                    <h5
                                                                        className="card-title mb-1"
                                                                        onMouseOver={(e) => {
                                                                            e.currentTarget.style.transform = 'scale(1.02)';
                                                                            e.currentTarget.style.color = 'blue';
                                                                        }}
                                                                        onMouseOut={(e) => {
                                                                            e.currentTarget.style.transform = 'scale(1)';
                                                                            e.currentTarget.style.color = 'black';
                                                                        }}
                                                                    >
                                                                        {request.exchangeBookId?.title}
                                                                    </h5>
                                                                    <p className="card-text mb-0">Tác giả: {request.exchangeBookId?.author}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger  d-flex align-items-center justify-content-center"

                                                                    onClick={() => handleDeleteRequest(request?._id)}
                                                                >
                                                                    Hủy trao đổi
                                                                    <i className=" ms-1 fa fa-times"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className='text-dark'>Chưa có yêu cầu nào gửi tới</p>
                                )}

                            </div>
                        </div>


                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => handleCloseListRequest()}
                        >
                            Đóng
                        </button>

                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ListUserRequest;
import { useEffect, useState } from 'react';
import { useStateContext } from '../../../context/UserContext';


//service 
import { getExchangeRequestByBookRequested, deleteRequestSer, acceptExchangeRequest } from '../../../services/exchange/exchangeRequestService';

const ListUserRequest = ({ handleCloseListRequest,bookRequestedId }) => {

    const {user}= useStateContext();
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
                    setLisRequest(result);
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

    const handleAcceptRequest = async () =>{
        try {
            if(formAccept.requestId){
                const response = await acceptExchangeRequest(formAccept);

                console.log(response);
            }
        } catch (error) {
            
        }
    }

    const handleClickRequest = async (requestId) =>{
        if(requestId){
            setFormAccept({...formAccept, requestId: requestId});
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
                                {listRequest.length > 0  ? (
                                    <>
                                        {listRequest.map((request) => (
                                            <div key={request?._id} className='card my-2 shadow'>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="user-profile d-flex justify-content-start text-center align-items-center mt-2 ms-2">
                                                        <img alt='user-image' className='rounded-circle me-2' style={{ width: '50px', height: '50px' }}
                                                            src={request.requesterId?.image}
                                                        />
                                                        <span className='text-dark fw-bold'>  {request.requesterId?.fullName}</span>
                                                    </div>
                                                    <div className="d-flex gap-1 me-2">
                                                        {/* Nút đồng ý với icon check */}
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{ width: "40px", height: "40px" }}
                                                            onClick={()=> handleClickRequest(request._id)}
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

                                                </div>

                                                <div className="card-body">
                                                    {request.exchangeMethod === "points" ? (
                                                        <div>
                                                            <p className="mb-0 text-dark">
                                                                Yêu cầu trao đổi bằng <strong className='text-danger'>điểm</strong> để trao đổi sách.
                                                            </p>
                                                        </div>
                                                    ) : request.exchangeMethod === "book" && request.exchangeBookId && (
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


        </div>
    );
}

export default ListUserRequest;
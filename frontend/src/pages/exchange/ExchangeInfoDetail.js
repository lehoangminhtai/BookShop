import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

//service
import { getRequestByRequestId } from '../../services/exchange/exchangeRequestService';
import { getExchangeInforSer } from '../../services/exchange/exchangeInforService';
//format
import { formatDate } from '../../lib/utils';

const ExchangeInfoDetail = (props) => {
    const { requestId } = useParams();
    const steps = [
        'Nhắn tin trao đổi',
        'Điền thông tin giao dịch',
        'Xác nhận thông tin giao dịch',
        'Trao đổi sách',
        'Hoàn tất giao dịch',
        'Đánh giá người dùng',
    ];

    const [request, setRequest] = useState(null);
    const [infoForm, setInfoForm] = useState(null)

    const getRequestById = async () => {
        try {
            if (requestId) {
                const res = await getRequestByRequestId(requestId);
                if (res.data.success) {
                    setRequest(res.data.data)
                }
            }
        } catch (error) {

        }
    }
    const getExchangeInfoByRequestId = async () => {
        try {
            if (requestId) {
                const res = await getExchangeInforSer(requestId);

                if (res.success) {
                    setInfoForm(res.exchangeInfor);

                }
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getRequestById();
        getExchangeInfoByRequestId();
    }, [requestId])

    return (
        <div className='container mt-5'>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={1 && 2 && 3} alternativeLabel>
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
                        <div className="text-center">
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

                        <div className="text-center">
                            <img
                                src={request?.exchangeBookId?.images[0]}
                                style={{ width: "150px", height: "160px" }}
                            ></img>
                            <p className="mt-2 fw-bold text-dark"
                                style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                            >{request?.exchangeBookId?.title}</p>
                            <h5 className='h5  text-danger fw-bold'>{request?.exchangeBookId?.creditPoints} đ</h5>
                        </div>
                    </div>


                    <div className="alert alert-info text-center fw-bold" role="alert">
                        Trạng thái: Đang trao đổi
                    </div>

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
            <span className="fw-semibold text-dark fst-italic text-decoration-underline">{infoForm?.contactPhone_owner}</span>
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



                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success w-48">Xác nhận hoàn thành</button>
                        <button className="btn btn-danger w-48">Báo cáo vấn đề</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ExchangeInfoDetail;
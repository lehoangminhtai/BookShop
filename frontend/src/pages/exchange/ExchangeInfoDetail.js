import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import React, { useRef } from 'react';

import { ToastContainer } from 'react-toastify';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckIcon from '@mui/icons-material/Check';

//service
import { getRequestByRequestId } from '../../services/exchange/exchangeRequestService';
import { getExchangeInforSer } from '../../services/exchange/exchangeInforService';
//format
import { formatDate } from '../../lib/utils';
//component
import ConfirmDialog from '../../components/customer/BookExchange/ConfirmDialog';
import ReportExchangeForm from '../../components/customer/BookExchange/ReportExchangeForm';

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
    const [infoForm, setInfoForm] = useState(null);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openReport, setOpenReport] = useState(false);

    //Notify

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

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

    const handleConfirm = () => {
        alert('Xác nhận hoàn tất giao dịch');
    }

    return (
        <div className='container mt-5'>
            <React.Fragment>
               
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle id="scroll-dialog-title">Chú ý</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText
                            id="scroll-dialog-description"
                          
                            tabIndex={-1}
                        >
                            <h4 className='h4 text-center text-danger fw-bold fst-italic'>* Sau khi hoàn tất trao đổi vui lòng lướt xuống xác nhận hoàn thành để nhận điểm *</h4>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }} onClick={handleClose}>
                        <CheckIcon />
                    </DialogActions>
                </Dialog>
            </React.Fragment>
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
                            <div className="mt-2">
                                <span className="badge bg-success px-3 py-1">
                                    <i className="bi bi-person-fill me-1"></i> Chủ sở hữu
                                </span>
                            </div>
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
                            <div className="mt-2">
                                <span className="badge bg-danger px-3 py-1">
                                    <i className="bi bi-person-lines-fill me-1"></i> Người yêu cầu
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className={`alert text-center fw-bold d-flex align-items-center justify-content-center gap-2 
    ${infoForm?.status === 'accepted' ? 'alert-warning text-dark' : 'alert-success text-white'}`}
                        role="alert"
                    >
                        {infoForm?.status === 'accepted' ? (
                            <>
                                <i className="bi bi-arrow-repeat text-warning fs-5"></i>
                                <span>Trạng thái: <span className="badge bg-warning text-dark">Đang trao đổi</span></span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                <span>Trạng thái: <span className="badge bg-success">Đã hoàn thành</span></span>
                            </>
                        )}
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

                    {/* Hiển thị thông tin bù điểm */}
                    {request && (
                        <div className="text-center my-4">
                            {request.bookRequestedId.creditPoints !== request.exchangeBookId.creditPoints ? (
                                <div className="alert alert-info d-flex flex-column align-items-center gap-2 p-3 shadow-sm">
                                    <i className="fa-solid fa-scale-balanced text-primary fs-3"></i>
                                    {request.bookRequestedId.creditPoints > request.exchangeBookId.creditPoints ? (
                                        <p className="mb-0 fw-bold text-dark">
                                            <span className="text-danger">{infoForm?.fullName_requester}</span> sẽ trả thêm
                                            <span className="text-primary fs-4"> {creditDiff} điểm</span> cho
                                            <span className="text-success"> {infoForm?.fullName_owner}</span> để cân bằng giao dịch.
                                        </p>
                                    ) : (
                                        <p className="mb-0 fw-bold text-dark">
                                            <span className="text-danger">{infoForm?.fullName_owner}</span> sẽ trả thêm
                                            <span className="text-primary fs-4"> {creditDiff} điểm</span> cho
                                            <span className="text-success"> {infoForm?.fullName_requester}</span>.
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
                        {infoForm?.status === 'completed' ? (
                            <button className="btn btn-secondary d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm">
                                <i className="fa-solid fa-user-check me-2"></i>
                                Đánh giá người dùng
                            </button>
                        ) : (
                            <div className="d-flex flex-column flex-md-row  justify-content-between gap-3 mt-3">
                                <button className="btn btn-success d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                                    onClick={handleOpenConfirm}>
                                    <i className="fa-solid fa-check-circle me-2"></i>
                                    Xác nhận hoàn thành

                                </button>

                                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center w-100 py-2 rounded-3 shadow-sm"
                                    onClick={handleOpenReport}
                                >
                                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                    Báo cáo vấn đề
                                </button>
                            </div>
                        )}

                    </div>

                    <p className='text-center mt-3 text-danger text-start fst-italic'>* Sau khi hoàn tất trao đổi nếu đối phương không xác nhận để có thể nhận điểm thì vui lòng báo cáo vấn đề và gửi minh chứng để quản trị giải quyết *</p>

                </div>
            </div>
            {openConfirm && (
                <ConfirmDialog
                    handleClose={handleCloseConfirm}
                    content="Xác nhận hoàn tất giao dịch ?"
                    onConfirm={handleConfirm}
                />
            )}
            {openReport && (
                <ReportExchangeForm
                    handleClose={handleCloseReport}
                    requestId={requestId}
                />
            )}
            <ToastContainer/>
        </div>
    );
}
export default ExchangeInfoDetail;
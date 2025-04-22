import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//service
import { getExchangeInforSer, updateExchangeInforSer } from '../../../services/exchange/exchangeInforService';
//format
import { formatDate } from '../../../lib/utils';

const ExchangeInfoConfirmForm = ({ requestId, onClose }) => {

    const [exchangeInfor, setExchangeInfor] = useState(null);
    const [formData, setFormData] = useState({
        fullName_owner: '',
        fullName_requester: '',
        transactionLocation: '',
        transactionDate: '',
        transactionTime: '',
        deliveryMethod: 'direct',
        contactPhone_owner: '',
        contactPhone_requester: '',
        notes: '',
        status: 'accepted',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [openProgress, setOpenProgress] = useState(false);
    const handleCloseProgress = () => {
        setOpenProgress(false);
    };
    const handleOpenProgress = () => {
        setOpenProgress(true);
    };

    const getExchangeInfor = async () => {
        try {
            handleOpenProgress();
            const res = await getExchangeInforSer(requestId);
            setExchangeInfor(res.exchangeInfor);
            handleCloseProgress();

        } catch (error) {
            toast.error('Lỗi khi lấy thông tin giao dịch: ' + error.message);
        }
    };

    useEffect(() => {
        if (exchangeInfor) {
            setFormData({
                fullName_owner: exchangeInfor.fullName_owner || '',
                fullName_requester: exchangeInfor.fullName_requester || '',
                transactionLocation: exchangeInfor.transactionLocation || '',
                transactionDate: formatDate(exchangeInfor.transactionDate) || '',
                transactionTime: exchangeInfor.transactionTime || '',
                deliveryMethod: exchangeInfor.deliveryMethod || 'direct',
                contactPhone_owner: exchangeInfor.contactPhone_owner || '',
                contactPhone_requester: exchangeInfor.contactPhone_requester || '',
                notes: exchangeInfor.notes || '',
                status: 'accepted',
            });
        }

    }, [exchangeInfor]);

    useEffect(() => {
        getExchangeInfor();
    }, [requestId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (!formData.fullName_requester || !formData.contactPhone_requester) {
                toast.error('Vui lòng nhập thông tin người nhận!');
                return;
            }
            if (formData.contactPhone_requester.length < 10) {
                toast.error('Số điện thoại người nhận không hợp lệ!');
                return;
            }
            if (formData.contactPhone_owner.length < 10) {
                toast.error('Số điện thoại chủ sách không hợp lệ!');
                return;
            }
            const dataToSend = { ...formData, requestId };

            const res = await updateExchangeInforSer(dataToSend); // Thêm hàm cập nhật
            console.log(res);
            if (res.data.success) {
                toast.success('Cập nhật giao dịch thành công!');
            }

        } catch (error) {
            setMessage('Lỗi khi xử lý giao dịch: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-primary">Xác nhận thông tin trao đổi</h5>
                        <button type="button" className="btn-close" onClick={() => onClose()}></button>
                    </div>
                    <div className="modal-body">
                        <div className="container mt-4">
                            <div className="card shadow-lg p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-dark">Họ Tên (chủ sách):</label>
                                        <input type="text" className="form-control bg-light" name="fullName_owner" value={formData.fullName_owner} onChange={handleChange} readOnly />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Địa điểm giao dịch:</label>
                                        <input type="text" className="form-control" name="transactionLocation" value={formData.transactionLocation} onChange={handleChange} readOnly />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-dark">Ngày giao dịch:</label>
                                            <input type="date" className="form-control" name="transactionDate" value={formData.transactionDate} onChange={handleChange} readOnly />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-dark">Thời gian giao dịch:</label>
                                            <input type="time" className="form-control" name="transactionTime" value={formData.transactionTime} onChange={handleChange} readOnly />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Phương thức giao nhận:</label>
                                        <select className="form-select" name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange} disabled>
                                            <option value="direct">Giao trực tiếp</option>
                                            <option value="post-office">Qua bưu điện</option>
                                            <option value="shipping">Qua shipper</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Số điện thoại (chủ sách):</label>
                                        <input type="text" className="form-control" name="contactPhone_owner" value={formData.contactPhone_owner} onChange={handleChange} readOnly />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Ghi chú:</label>
                                        <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} readOnly={formData.fullName_requester && formData.contactPhone_requester}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-dark">Họ Tên (người nhận):</label>
                                        <input type="text" className="form-control bg-light" name="fullName_requester" onChange={handleChange} value={formData?.fullName_requester} required readOnly={formData.fullName_requester && formData.contactPhone_requester} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-dark">Số điện thoại liên hệ:</label>
                                        <input type="text" className="form-control bg-light" name="contactPhone_requester" onChange={handleChange} value={formData?.contactPhone_requester} required readOnly={formData.fullName_requester && formData.contactPhone_requester} />
                                    </div>

                                    {!(formData.fullName_requester && formData.contactPhone_requester) && (
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                                Xác nhận <i className="ms-1 fas fa-check"></i>
                                            </button>
                                        </div>
                                    )}

                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            {openProgress && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openProgress}

            >
                <CircularProgress color="inherit" />
            </Backdrop>}
        </div>
    );
};

export default ExchangeInfoConfirmForm;
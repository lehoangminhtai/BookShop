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
    const [openProgress, setOpenProgress] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState({});

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
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName_requester.trim()) {
            newErrors.fullName_requester = 'Họ và tên không được để trống';
        }

        if (!/^\d{10}$/.test(formData.contactPhone_requester)) {
            newErrors.contactPhone_requester = 'Số điện thoại phải gồm đúng 10 chữ số';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            if (!exchangeInfor) {
                toast.error('Vui lòng chờ chủ sách xác nhận trước');
                return;
            }

            if (formData.contactPhone_owner.length < 10) {
                toast.error('Số điện thoại chủ sách không hợp lệ!');
                return;
            }

            const dataToSend = { ...formData, requestId };

            const res = await updateExchangeInforSer(dataToSend); // Thêm hàm cập nhật
            console.log('response:', res);
            if (res.data.success) {
                toast.success('Xác nhận giao dịch thành công!');
                onClose();
            }

        } catch (error) {
            let errorMsg = 'Lỗi khi xử lý giao dịch';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }
            toast.error(errorMsg);
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
                                {exchangeInfor ? (
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
                                            <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} readOnly={exchangeInfor && exchangeInfor.fullName_requester && exchangeInfor.contactPhone_requester}></textarea>
                                        </div>
                                        <div className="">
                                            <label className="form-label text-dark">Họ Tên (người nhận):</label>
                                            <input type="text" 
                                            className={`form-control bg-light ${errors.fullName_requester ? 'is-invalid' : ''}`} 
                                            name="fullName_requester" 
                                            onChange={handleChange} 
                                            value={formData?.fullName_requester} 
                                            readOnly={exchangeInfor && exchangeInfor.fullName_requester && exchangeInfor.contactPhone_requester} />
                                        </div>
                                        {errors.fullName_requester && (
                                            <div className="text-danger">{errors.fullName_requester}</div>
                                        )}
                                        <div className="">
                                            <label className="form-label text-dark mt-3">Số điện thoại liên hệ:</label>
                                            <input 
                                            type="text" 
                                            className={`form-control bg-light ${errors.contactPhone_requester ? 'is-invalid' : ''}`} 
                                            name="contactPhone_requester" 
                                            onChange={handleChange} 
                                            value={formData?.contactPhone_requester}
                                            readOnly={exchangeInfor && exchangeInfor.fullName_requester && exchangeInfor.contactPhone_requester} />
                                        </div>
                                        {errors.contactPhone_requester && (
                                            <div className="text-danger mb-3">{errors.contactPhone_requester}</div>
                                        )}

                                        {!(exchangeInfor && exchangeInfor.fullName_requester && exchangeInfor.contactPhone_requester) && (
                                            <>

                                                <div className="form-check mt-3 mb-3">
                                                    <input className="form-check-input" type="checkbox" id="confirmCheckbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
                                                    <label className="form-check-label" htmlFor="confirmCheckbox" style={{ fontSize: '0.9rem' }}>
                                                        Lưu ý: Sau khi xác nhận, điểm tích lũy của bạn sẽ bị trừ tương ứng với số điểm chênh lệch (nếu sách của bạn có giá trị thấp hơn) và bạn không thể hủy giao dịch sau xác nhận thông tin.
                                                    </label>
                                                </div>

                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary w-100" disabled={loading || !agreed}>
                                                        Xác nhận <i className="ms-1 fas fa-check"></i>
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                    </form>
                                ) : (<>
                                    <h3 className='h3 text-danger fw-bold'> Vui lòng chờ chủ sách xác nhận trước</h3>
                                    <button className="btn btn-primary w-100 mt-3" onClick={() => onClose()}>
                                        Đồng ý <i className="ms-1 fas fa-check"></i>
                                    </button>
                                </>)}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
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
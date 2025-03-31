import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createExchangeInforSer, getExchangeInforSer, updateExchangeInforSer } from '../../services/exchange/exchangeInforService';

const ExchangeInforForm = ({ requestId, onClose }) => {

    const [exchangeInfor, setExchangeInfor] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',  
        transactionLocation: '',
        transactionDate: '',
        transactionTime: '',
        deliveryMethod: 'direct',
        contactPhone: '',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isUpdate, setIsUpdate] = useState(false); // Thêm state để kiểm tra chế độ cập nhật

    const getExchangeInfor = async () => {
        try {
            const res = await getExchangeInforSer(requestId);
            console.log(res.exchangeInfor);
            setExchangeInfor(res.exchangeInfor);

            // Kiểm tra nếu trạng thái là "pending", chuyển sang chế độ cập nhật
            if (res.exchangeInfor && res.exchangeInfor.status === 'pending') {
                setIsUpdate(true);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy thông tin giao dịch: ' + error.message);
        }
    };

    useEffect(() => {
        if (exchangeInfor) {
            setFormData({
                fullName: exchangeInfor.fullName || '',  
                transactionLocation: exchangeInfor.transactionLocation || '',
                transactionDate: exchangeInfor.transactionDate || '',
                transactionTime: exchangeInfor.transactionTime || '',
                deliveryMethod: exchangeInfor.deliveryMethod || 'direct',
                contactPhone: exchangeInfor.contactPhone || '',
                notes: exchangeInfor.notes || '',
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
            const dataToSend = { ...formData, requestId };

            if (isUpdate) {
                // Gọi API cập nhật giao dịch
                const res = await updateExchangeInforSer(dataToSend); // Thêm hàm cập nhật
                if (res.data.succes) {
                    toast.success('Cập nhật giao dịch thành công!');
                }
            } else {
                // Gọi API tạo giao dịch
                const res = await createExchangeInforSer(dataToSend);
                if (res.data.succes) {
                    toast.success('Tạo giao dịch thành công!');
                }
            }

            setFormData({
                fullName: '',
                transactionLocation: '',
                transactionDate: '',
                transactionTime: '',
                deliveryMethod: 'Giao trực tiếp',
                contactPhone: '',
                notes: '',
            });
        } catch (error) {
            setMessage('Lỗi khi xử lý giao dịch: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4">
                <div className="modal-header">
                    <h2 className="text-center text-primary">Thông tin trao đổi</h2>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                {message && <div className="alert alert-info text-center">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Họ và Tên:</label>
                        <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Địa điểm giao dịch:</label>
                        <input type="text" className="form-control" name="transactionLocation" value={formData.transactionLocation} onChange={handleChange} required />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Ngày giao dịch:</label>
                            <input type="date" className="form-control" name="transactionDate" value={formData.transactionDate} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Thời gian giao dịch:</label>
                            <input type="time" className="form-control" name="transactionTime" value={formData.transactionTime} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phương thức giao nhận:</label>
                        <select className="form-select" name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange} required>
                            <option value="direct">Giao trực tiếp</option>
                            <option value="post-office">Qua bưu điện</option>
                            <option value="shipping">Qua shipper</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Số điện thoại liên hệ:</label>
                        <input type="text" className="form-control" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ghi chú:</label>
                        <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange}></textarea>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Đang xử lý...' : isUpdate ? 'Cập nhật giao dịch' : 'Tạo giao dịch'}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ExchangeInforForm;
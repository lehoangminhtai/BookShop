import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
//service
import { createExchangeInforSer, getExchangeInforSer, updateExchangeInforSer } from '../../services/exchange/exchangeInforService';
//format
import { formatDate } from '../../lib/utils';

const ExchangeInforForm = ({ requestId, onClose }) => {

    const [exchangeInfor, setExchangeInfor] = useState(null);
    const [formData, setFormData] = useState({
        fullName_owner: '',
        transactionLocation: '',
        transactionDate: '',
        transactionTime: '',
        deliveryMethod: 'direct',
        contactPhone_owner: '',
        notes: '',
        status: 'pending',
    });

    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false); // Thêm state để kiểm tra chế độ cập nhật

    const getExchangeInfor = async () => {
        try {
            const res = await getExchangeInforSer(requestId);
            console.log('Exchange Info:', res.exchangeInfor);
            setExchangeInfor(res.exchangeInfor);

            // Kiểm tra nếu trạng thái là "pending", chuyển sang chế độ cập nhật
            if (res.exchangeInfor && res.exchangeInfor.status === 'pending') {
                setIsUpdate(true);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy thông tin giao dịch.');
        }
    };

    useEffect(() => {
        if (exchangeInfor) {
            setFormData({
                fullName_owner: exchangeInfor.fullName_owner || '',
                transactionLocation: exchangeInfor.transactionLocation || '',
                transactionDate: formatDate(exchangeInfor.transactionDate) || '',
                transactionTime: exchangeInfor.transactionTime || '',
                deliveryMethod: exchangeInfor.deliveryMethod || 'direct',
                contactPhone_owner: exchangeInfor.contactPhone_owner || '',
                notes: exchangeInfor.notes || '',
                status: exchangeInfor.status || 'pending',
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

        const selectedDate = new Date(formData.transactionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            toast.error('Ngày giao dịch phải là ngày trong tương lai!');
            setLoading(false);
            return;
        }

        try {
            const dataToSend = { ...formData, requestId };

            if (isUpdate) {
                // Gọi API cập nhật giao dịch
                const res = await updateExchangeInforSer(dataToSend); // Thêm hàm cập nhật
                console.log('Update Response:', res);
                if (res.data.success) {
                    toast.success('Cập nhật giao dịch thành công!');
                    onClose();
                }
            } else {
                // Gọi API tạo giao dịch
                const res = await createExchangeInforSer(dataToSend);
                if (res.data.success) {
                    toast.success('Tạo giao dịch thành công!');
                    onClose();
                }
            }

        } catch (error) {
            toast.error('Lỗi khi xử lý giao dịch: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="text-center text-primary">Điền thông tin trao đổi</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="container mt-4">
                            <div className="card shadow-lg p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-dark">Họ và Tên:</label>
                                        <input type="text" className="form-control" name="fullName_owner" value={formData.fullName_owner} onChange={handleChange} required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Địa điểm giao dịch:</label>
                                        <input type="text" className="form-control" name="transactionLocation" value={formData.transactionLocation} onChange={handleChange} required />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-dark">Ngày giao dịch:</label>
                                            <input type="date" className="form-control" name="transactionDate" value={formData.transactionDate} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-dark">Thời gian giao dịch:</label>
                                            <input type="time" className="form-control" name="transactionTime" value={formData.transactionTime} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Phương thức giao nhận:</label>
                                        <select className="form-select" name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange} required>
                                            <option value="direct">Giao trực tiếp</option>
                                            <option value="post-office">Qua bưu điện</option>
                                            <option value="shipping">Qua shipper</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Số điện thoại liên hệ:</label>
                                        <input type="text" className="form-control" name="contactPhone_owner" value={formData.contactPhone_owner} onChange={handleChange} required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Ghi chú:</label>
                                        <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange}></textarea>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                            {loading ? 'Đang xử lý...' : isUpdate ? 'Cập nhật giao dịch' : 'Tạo giao dịch'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExchangeInforForm;
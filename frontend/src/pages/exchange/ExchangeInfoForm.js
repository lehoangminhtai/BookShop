import React, { useState } from 'react';
import { createExchangeInforSer } from '../../services/exchange/exchangeInforService';

const ExchangeInforForm = ({ requestId }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        transactionLocation: '',
        transactionDate: '',
        transactionTime: '',
        deliveryMethod: 'Giao trực tiếp',
        contactPhone: '',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
            await createExchangeInforSer(dataToSend);
            setMessage('Tạo giao dịch thành công!');
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
            setMessage('Lỗi khi tạo giao dịch: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary">Thông tin trao đổi</h2>
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
                            <option value="Giao trực tiếp">Giao trực tiếp</option>
                            <option value="Qua bưu điện">Qua bưu điện</option>
                            <option value="Qua shipper">Qua shipper</option>
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
                            {loading ? 'Đang gửi...' : 'Tạo giao dịch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExchangeInforForm;
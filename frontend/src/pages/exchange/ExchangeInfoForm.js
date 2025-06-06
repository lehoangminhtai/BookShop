import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false); // Thêm state để kiểm tra chế độ cập nhật

    const [isConfirmed, setIsConfirmed] = useState(false);

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
            toast.error(error.response?.data?.message || 'Lỗi khi lấy thông tin giao dịch.');
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
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName_owner.trim()) {
            newErrors.fullName_owner = 'Họ và tên không được để trống';
        }
        if (!formData.transactionLocation.trim()) {
            newErrors.transactionLocation = 'Địa điểm giao dịch không được để trống';
        }

        if (!formData.transactionDate) {
            newErrors.transactionDate = 'Vui lòng chọn ngày giao dịch';
        } else {
            const selectedDate = new Date(formData.transactionDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate <= today) {
                newErrors.transactionDate = 'Ngày giao dịch phải là ngày trong tương lai';
            }
        }

        if (!formData.transactionTime) {
            newErrors.transactionTime = 'Vui lòng chọn thời gian giao dịch';
        }

        if (!/^\d{10}$/.test(formData.contactPhone_owner)) {
            newErrors.contactPhone_owner = 'Số điện thoại phải gồm đúng 10 chữ số';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const dataToSend = { ...formData, requestId };

            if (isUpdate) {
                // Gọi API cập nhật giao dịch
                const res = await updateExchangeInforSer(dataToSend); // Thêm hàm cập nhật
                console.log('Update Response:', res);
                if (res.data.success) {
                    toast.success('Cập nhật thông tin thành công!');
                    onClose();
                }
            } else {
                // Gọi API tạo giao dịch
                const res = await createExchangeInforSer(dataToSend);
                console.log('Create Response:', res);
                if (res.data.success) {
                    toast.success('Hoàn tất điền thông tin!');
                    onClose();
                }
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
        <div className="modal show fade" tabIndex="-1" style={{ display: 'block' }}>
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
                                        <input
                                            type="text"
                                            className={`form-control ${errors.fullName_owner ? 'is-invalid' : ''}`}
                                            name="fullName_owner"
                                            value={formData.fullName_owner}
                                            onChange={handleChange}
                                        />
                                        {errors.fullName_owner && <div className="invalid-feedback">{errors.fullName_owner}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Địa điểm giao dịch:</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.transactionLocation ? 'is-invalid' : ''}`}
                                            name="transactionLocation"
                                            value={formData.transactionLocation}
                                            onChange={handleChange}
                                        />
                                        {errors.transactionLocation && (
                                            <div className="invalid-feedback">{errors.transactionLocation}</div>
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-dark">Ngày giao dịch:</label>
                                            <input
                                                type="date"
                                                className={`form-control ${errors.transactionDate ? 'is-invalid' : ''}`}
                                                name="transactionDate"
                                                value={formData.transactionDate}
                                                onChange={handleChange}
                                            />
                                            {errors.transactionDate && (
                                                <div className="invalid-feedback">{errors.transactionDate}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-dark">Thời gian giao dịch:</label>
                                            <input
                                                type="time"
                                                className={`form-control ${errors.transactionTime ? 'is-invalid' : ''}`}
                                                name="transactionTime"
                                                value={formData.transactionTime}
                                                onChange={handleChange}
                                            />
                                            {errors.transactionTime && (
                                                <div className="invalid-feedback">{errors.transactionTime}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Phương thức giao nhận:</label>
                                        <select
                                            className="form-select"
                                            name="deliveryMethod"
                                            value={formData.deliveryMethod}
                                            onChange={handleChange}
                                        >
                                            <option value="direct">Giao trực tiếp</option>
                                            <option value="post-office">Qua bưu điện</option>
                                            <option value="shipping">Qua shipper</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Số điện thoại liên hệ:</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.contactPhone_owner ? 'is-invalid' : ''}`}
                                            name="contactPhone_owner"
                                            value={formData.contactPhone_owner}
                                            onChange={handleChange}
                                        />
                                        {errors.contactPhone_owner && (
                                            <div className="invalid-feedback">{errors.contactPhone_owner}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-dark">Ghi chú:</label>
                                        <textarea
                                            className="form-control"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="form-check mb-3 " style={{ fontSize: '0.90rem'}}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="confirmationCheckbox"
                                            checked={isConfirmed}
                                            onChange={(e) => setIsConfirmed(e.target.checked)}
                                        />
                                        <label className="form-check-label text-dark" htmlFor="confirmationCheckbox">
                                            Lưu ý: Sau khi người gửi xác nhận thông tin giao dịch, điểm tích lũy của bạn sẽ bị trừ tương ứng với số điểm chênh lệch (nếu sách của bạn có giá trị thấp hơn) và bạn không thể hủy giao dịch sau khi điền thông tin.
                                        </label>
                                    </div>


                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary w-100" disabled={loading || !isConfirmed}>
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
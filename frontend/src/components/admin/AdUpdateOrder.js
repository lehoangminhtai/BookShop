import React, { useState, useEffect } from "react";
import { updateStatusOrder } from "../../services/orderService";
import { toast, ToastContainer } from "react-toastify";
const AdUpdateOrder = ({onClose, initialOrderStatus, orderId, reloadData }) => {
    const [status, setStatus] = useState(initialOrderStatus);
    const [deliveryDate, setDeliveryDate] = useState("");  // State lưu ngày giao hàng

    const statusStyles = {
        confirm: { backgroundColor: 'rgba(29, 78, 216)', color: 'white', fontWeight: 'bold' },
        shipping: { backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold' },
        completed: { backgroundColor: '#198754', color: 'white', fontWeight: 'bold' },
    };

    // Hàm xử lý sự kiện thay đổi trạng thái
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    // Hàm xử lý thay đổi ngày giao hàng
    const handleDateChange = (event) => {
        setDeliveryDate(event.target.value);
    };

    const handleCalendarClick = () => {
        const dateInput = document.getElementById("datepicker");
        dateInput.focus(); // Khi nhấn vào icon, sẽ tự động focus vào input date và mở lịch
    };

    const currentDate = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại dưới dạng YYYY-MM-DD

    const handleUpdateOrder = async () => {
            
        const orderStatus = status;

        const deliveryAt = orderStatus === "completed" ? Date.now() : deliveryDate;

        if (orderStatus !== "completed" && !deliveryDate) {
            toast.error('Vui lòng nhập ngày giao hàng!');
            return; 
        }

        if (orderStatus !== "completed" && !deliveryDate) {
            toast.error('Vui lòng nhập ngày giao hàng!');
            return; 
        }
        
        const statusData = {orderStatus, deliveryAt}
        try {
            const response = await updateStatusOrder(orderId, statusData)
            if (response.data.success) {
                 reloadData();
                // Hiển thị thông báo thành công
                toast.success('Cập nhật trạng thái đơn hàng thành công', {
                    autoClose: 1000,
                    onClose: () => {
                        // Đảm bảo đóng modal sau khi thông báo đã hoàn thành
                        onClose();
                    }
                });
            } else {
                toast.error('Có lỗi xảy ra khi cập nhật trạng thái!')
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái!')
        }
    };

    return (
        <div className="mt-4">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cập nhật trạng thái đơn hàng</h5>
            </div>
            <div className="card-body">
                <label htmlFor="status" className="form-label fw-semibold">
                    Trạng thái
                </label>
                <select
                    id="status"
                    className="form-select mb-4"
                    aria-label="Select shipping status"
                    value={status}
                    onChange={handleStatusChange}
                    style={statusStyles[status]}  // Áp dụng màu sắc dựa trên trạng thái
                >
                    <option value="confirm">Xác Nhận</option>
                    <option value="shipping">Đang Vận Chuyển</option>
                    <option value="completed">Đã Giao</option>
                </select>

                <label htmlFor="datepicker" className="form-label fw-semibold">
                    Ngày dự kiến hàng được giao
                </label>
                <div className="input-group mb-4" onClick={handleCalendarClick}>
                    <input
                        type="date"
                        id="datepicker"
                        className="form-control"
                        placeholder="YYYY-MM-DD"
                        min={currentDate}
                        value={deliveryDate}
                        onChange={handleDateChange}
                    />
                </div>

            </div>
            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-primary" onClick={handleUpdateOrder}>
                    Cập Nhật
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default AdUpdateOrder;

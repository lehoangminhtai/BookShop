import React, { useEffect, useState } from "react";
import CustomerSidebar from "../../components/customer/CustomerSidebar";
import { useStateContext } from "../../context/UserContext"; // Import context
import { getOrdersByUser } from "../../services/orderService"; // Import hàm gọi API
import Order from "../../components/customer/Order";

const CustomerOrders = () => {
    const { user } = useStateContext(); // Lấy thông tin user từ context
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("User ID: ", user?._id); // Log ID người dùng
        if (user?._id) {
            const loadOrders = async () => {
                try {
                    const response = await getOrdersByUser(user._id);
                    console.log("API Response:", response); // Log phản hồi API
                    if (response.data.data.length > 0) {
                        setOrders(response.data.data); // Cập nhật danh sách đơn hàng
                    } else {
                        setError("Không có đơn hàng nào.");
                    }
                } catch (err) {
                    console.error("API Error:", err); // Log lỗi từ API
                    setError("Có lỗi xảy ra khi tải danh sách đơn hàng.");
                }
            };

            loadOrders();
        } else {
            setError("Không tìm thấy thông tin người dùng.");
        }
    }, [user]);

    return (
        <div className="container p-4">
            <div className="d-flex">
                <CustomerSidebar />
                <div className="flex-grow-1">
                    <div className="container mt-4">
                        <div className="bg-white shadow-sm">
                            <ul className="nav nav-tabs border-bottom">
                                <li className="nav-item">
                                    <a className="nav-link active text-danger fw-bold" href="#">
                                        Tất cả
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Chờ xác nhận
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Đang vận chuyển
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Hoàn thành
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Đã hủy
                                    </a>
                                </li>
                            </ul>
                            <div className="input-group p-2 bg-light mx-auto">
                                <span
                                    className="input-group-text bg-light border-0 text-muted"
                                    style={{ padding: "4px 8px", fontSize: "14px" }}
                                >
                                    <i className="fas fa-search" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 bg-light"
                                    placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                                    style={{ height: "30px", fontSize: "14px", padding: "4px 8px" }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        {error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <Order orders={orders} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrders;
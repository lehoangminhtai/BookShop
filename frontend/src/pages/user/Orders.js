import React, { useEffect, useState } from "react";
import CustomerSidebar from "../../components/customer/CustomerSidebar";
import { useStateContext } from "../../context/UserContext"; // Import context
import { getOrdersByUser } from "../../services/orderService"; // Import hàm gọi API
import Order from "../../components/customer/Order";

const CustomerOrders = () => {
    const { user } = useStateContext(); // Lấy thông tin user từ context
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]); // Danh sách đơn hàng đã lọc
    const [selectedStatus, setSelectedStatus] = useState("all");

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

    const filterOrdersByStatus = (status) => {
        if (status === "all") {
            setFilteredOrders(orders); // Nếu chọn "Tất cả", hiển thị tất cả đơn hàng
        } else {
            setFilteredOrders(orders.filter(order => order.orderStatus === status));
        }
    };

    useEffect(() => {
        filterOrdersByStatus(selectedStatus);
    }, [selectedStatus, orders]);


    return (
        <div className="auth-container">
            <div className="container p-4">
                <div className="d-flex">
                    <CustomerSidebar />
                    <div className="flex-grow-1">
                        <div className="container mt-4">
                            <div className="bg-white shadow-sm">
                                <ul className="nav nav-tabs border-bottom d-flex text-center">
                                    <li className="nav-item flex-grow-1">
                                        <a
                                            className={`nav-link ${selectedStatus === "all" ? "active text-danger fw-bold" : ""}`}
                                            href="#"
                                            onClick={() => setSelectedStatus("all")}
                                        >
                                            Tất cả
                                        </a>
                                    </li>
                                    <li className="nav-item flex-grow-1">
                                        <a
                                            className={`nav-link ${selectedStatus === "pending" ? "active text-danger fw-bold" : ""}`}
                                            href="#"
                                            onClick={() => setSelectedStatus("pending")}
                                        >
                                            Chờ xác nhận
                                        </a>
                                    </li>
                                    <li className="nav-item flex-grow-1">
                                        <a
                                            className={`nav-link ${selectedStatus === "confirm" ? "active text-danger fw-bold" : ""}`}
                                            href="#"
                                            onClick={() => setSelectedStatus("confirm")}
                                        >
                                            Chờ lấy hàng
                                        </a>
                                    </li>
                                    <li className="nav-item flex-grow-1">
                                        <a
                                            className={`nav-link ${selectedStatus === "shipping" ? "active text-danger fw-bold" : ""}`}
                                            href="#"
                                            onClick={() => setSelectedStatus("shipping")}
                                        >
                                            Đang giao hàng
                                        </a>
                                    </li>
                                    <li className="nav-item flex-grow-1">
                                        <a
                                            className={`nav-link ${selectedStatus === "completed" ? "active text-danger fw-bold" : ""}`}
                                            href="#"
                                            onClick={() => setSelectedStatus("completed")}
                                        >
                                            Hoàn thành
                                        </a>
                                    </li>
                                    <li className="nav-item flex-grow-1">
                                        <a
                                            className={`nav-link ${selectedStatus === "failed" ? "active text-danger fw-bold" : ""}`}
                                            href="#"
                                            onClick={() => setSelectedStatus("failed")}
                                        >
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
                                <Order orders={filteredOrders} userId={user?._id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CustomerOrders;
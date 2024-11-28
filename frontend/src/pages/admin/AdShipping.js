import React, { useEffect, useState } from "react";
// component
import AdSidebar from "../../components/admin/AdSidebar";
import AdShippingForm from "../../components/admin/AdShippingForm";
// scss
import '../../css/admin/AdShipping.scss'
// service
import { getAllShipping } from "../../services/shippingService";

const AdShipping = () => {
    const [shippings, setShippings] = useState([]);
    const [expandedArea, setExpandedArea] = useState(null);
    const [showModal, setShowModal] = useState(false); 
    const [showModalEdit, setShowModalEdit] = useState(false); 

    const fetchShipping = async () => {
        const response = await getAllShipping();
        if (response.data.success) {
            setShippings(response.data.shippingFees);
        }
    };

    const handleCreateShippingArea = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        fetchShipping();
    };

    // useEffect
    useEffect(() => {
        fetchShipping();
        console.log(expandedArea)
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Hàm toggle chỉ mở/đóng một vùng
    const toggleContent = (shippingId) => {
        setExpandedArea(prevState => prevState === shippingId ? null : shippingId);
    };

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container row">
                <div className="col-md-3 mb-3">
                    <h1 className="h4 mb-3">Chi Phí Vận Chuyển</h1>
                    <p className="text-muted">Phân loại những vùng gần xa cơ sở cửa hàng</p>
                    <button className="mt-3 btn btn-primary w-100" onClick={handleCreateShippingArea}>Thêm Vùng</button>
                </div>
                {shippings && (
                    <div className="col-md-9 ">
                        {shippings.map((shipping) => (
                            <div key={shipping.areaName} className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2 className="h5 mb-0">{shipping.areaName}</h2>
                                        <div className="d-flex">
                                            <button className="btn btn-info me-2">Chỉnh Sửa</button>
                                            <button className="btn btn-danger">Xóa</button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                                        <div>
                                            <h3 className="h6">Giá vận chuyển</h3>
                                            <p className="text-muted mb-0">
                                                <span className="fw-bold">{formatCurrency(shipping.shippingFee)}</span>
                                            </p>
                                        </div>
                                        <span
                                            className="btn btn-outline-secondary"
                                            onClick={() => toggleContent(shipping._id)} // Toggle for this specific area
                                        >
                                            {expandedArea === shipping._id ? "Thu gọn " : "Xem thêm "}
                                            <i className={`fas ${expandedArea === shipping._id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                        </span>
                                    </div>
                                    {/* Nội dung hiển thị các ô */}
                                    {expandedArea === shipping._id && (
                                        <div className="row">
                                            {shipping.provinces.map((province) => (
                                                <div key={province.provinceId} className="col-6 col-md-4 col-lg-3 mb-3">
                                                    <div className="card text-center p-2 small-card">
                                                        <i
                                                            className="fas fa-location-dot fa-2x mb-2"
                                                            style={{ color: "#007bff" }}
                                                        ></i>
                                                        <h6 className="card-title mb-0">{province.provinceName}</h6>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                    <div className="modal-overlay ">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                            <AdShippingForm onClose={closeModal} />
                            <button className="" onClick={closeModal}>Quay lại</button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default AdShipping;

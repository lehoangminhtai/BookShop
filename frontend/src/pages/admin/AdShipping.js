import React, { useState } from "react";
//component
import AdSidebar from "../../components/admin/AdSidebar";
//scss
import '../../css/admin/AdShipping.scss'

const AdShipping = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Danh sách tỉnh/thành phố
    const cities = [
        { id: 1, name: "Hồ Chí Minh" },
        { id: 2, name: "Hà Nội" },
        { id: 3, name: "Đà Nẵng" },
        { id: 4, name: "Cần Thơ" },
        { id: 5, name: "Hải Phòng" },
        { id: 6, name: "Bà Rịa - Vũng Tàu" },
        { id: 7, name: "Tiền Giang" },
    ];

    // Hàm toggle hiển thị nội dung
    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container row">
                <div className="col-md-3 mb-3">
                    <h1 className="h4 mb-3">Chi Phí Vận Chuyển</h1>
                    <p className="text-muted">Phân loại những vùng gần xa cơ sở cửa hàng</p>
                    <button className="mt-3 btn btn-primary w-100">Thêm Vùng</button>
                </div>
                <div className="col-md-9">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="h5 mb-0">Hồ Chí Minh</h2>
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
                                        <span className="fw-bold">20.000đ</span>
                                    </p>
                                </div>
                                <span
                                    className="btn btn-outline-secondary"
                                    onClick={toggleContent}
                                >
                                    {!isExpanded ? "Xem thêm " : "Thu gọn "}  
                                    <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </span>
                            </div>
                            {/* Nội dung hiển thị các ô */}
                            {isExpanded && (
                                <div className="row">
                                    {cities.map((city) => (
                                        <div key={city.id} className="col-6 col-md-4 col-lg-3 mb-3">
                                            <div className="card text-center p-2 small-card">
                                                <i
                                                    className="fas fa-location-dot fa-2x mb-2"
                                                    style={{ color: "#007bff" }}
                                                ></i>
                                                <h6 className="card-title mb-0">{city.name}</h6>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdShipping;

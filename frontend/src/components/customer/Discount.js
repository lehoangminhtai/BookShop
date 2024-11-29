import React from "react";

const Discount = () => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <div className="container ">
            <div className="d-flex justify-content-center align-items-center ">
                <div className="w-100">

                    <h5 className="text-primary text-center h5"><i class="fas fa-gift" style={{ color: "red" }}></i> CHỌN MÃ KHUYẾN MÃI</h5>

                    <div className="card-body">
                        <div className="mb-4">
                            <input type="text" className="form-control text-black" placeholder="Nhập mã khuyến mãi/Quà tặng" />
                            <button className="btn btn-primary w-100 mt-3">Áp dụng</button>
                        </div>

                        <div>
                            <h3 className="h5 mb-3">Mã giảm giá</h3>

                            {/* Coupon 1 */}
                            <div className="bg-light p-3 mb-3 rounded">
                                <div className="d-flex align-items-center">
                                    <div className="bg-info text-white p-2 rounded-circle">
                                        <i className="fas fa-gift"></i>
                                    </div>
                                    <div className="ms-3">
                                   
                                        <h4 className="h6">MÃ GIẢM 10K - TOÀN SÀN</h4>
                                        <p className="text-muted">Đơn hàng từ 130k - Xem chi tiết để biết thêm về thể lệ chương trình.</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-success">Đã áp dụng</span>
                                    <button className="btn btn-outline-danger btn-sm">Bỏ chọn</button>
                                </div>
                            </div>

                            {/* Coupon 2 */}
                            <div className="bg-light p-3 mb-3 rounded">
                                <div className="d-flex align-items-center">
                                    <div className="bg-info text-white p-2 rounded-circle">
                                        <i className="fas fa-percent"></i>
                                    </div>
                                    <div className="ms-3">
                                        <h4 className="h6">MÃ GIẢM 25K - TOÀN SÀN</h4>
                                        <p className="text-muted">Đơn hàng từ 280k - Xem chi tiết để biết thêm về thể lệ chương trình.</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end align-items-center">
                                    
                                    <button className="btn btn-primary btn-sm ms-3 text-nowrap" >Áp dụng</button>
                                </div>
                            </div>
                            {/* Coupon 3 */}
                            <div className="bg-light p-3 mb-3 rounded">
                                <div className="d-flex align-items-center">
                                    <div className="bg-info text-white p-2 rounded-circle">
                                        <i className="fas fa-percent"></i>
                                    </div>
                                    <div className="ms-3">
                                        <h4 className="h6">MÃ GIẢM 25K - TOÀN SÀN</h4>
                                        <p className="text-muted">Đơn hàng từ 280k - Xem chi tiết để biết thêm về thể lệ chương trình.</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="w-100 bg-secondary rounded mb-2" style={{ height: '10px' }}>
                                        <div className="bg-primary" style={{ width: '61%', height: '100%' }}></div>
                                        <div className="d-flex justify-content-between align-items-center">
                                        <small>Mua thêm {formatCurrency(100000)} để nhận mã khuyến mãi</small>
                                        <small className="ms-3">{formatCurrency(280000)}</small>
                                        </div>
                                    </div>
                                    
                                    <button className="btn btn-primary btn-sm ms-3 text-nowrap" >Mua Thêm</button>
                                </div>
                            </div>

                            <div className="text-center">
                                <button className="btn btn-link text-primary">
                                    Xem thêm <i className="fas fa-chevron-down"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Discount
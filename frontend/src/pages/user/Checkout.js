import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/UserContext'
// Component UserInfo
function UserInfo() {
    return (
        <div className="bg-white p-4 rounded shadow w-100 h-100">
            <h2 className="h4 font-weight-bold mb-4">ĐỊA CHỈ GIAO HÀNG</h2>
            <hr className="mb-4" />
            <div className="mb-4">
                <div className="form-group row mb-3">
                    <label className="col-sm-6 col-form-label font-weight-bold">Họ và tên người nhận</label>
                    <div className="col-sm-6">
                        <input type="text" value="Lê Tài" className="form-control" readOnly />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label className="col-sm-6 col-form-label font-weight-bold">Số điện thoại</label>
                    <div className="col-sm-6">
                        <input type="text" value="0326344084" className="form-control" readOnly />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label className="col-sm-6 col-form-label font-weight-bold">Quốc gia</label>
                    <div className="col-sm-6">
                        <input type="text" value="Việt Nam" className="form-control" readOnly />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label className="col-sm-6 col-form-label font-weight-bold">Tỉnh/Thành Phố</label>
                    <div className="col-sm-6">
                        <input type="text" value="Hồ Chí Minh" className="form-control" readOnly />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label className="col-sm-6 col-form-label font-weight-bold">Quận/Huyện</label>
                    <div className="col-sm-6">
                        <input type="text" value="Quận 2" className="form-control" readOnly />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label className="col-sm-6 col-form-label font-weight-bold">Phường/Xã</label>
                    <div className="col-sm-6">
                        <input type="text" value="Phường An Lợi Đông" className="form-control" readOnly />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label className="col-sm-6 col-form-label font-weight-bold">Địa chỉ nhận hàng</label>
                    <div className="col-sm-6">
                        <input type="text" value="grfgd" className="form-control" readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
}


// Component PaymentMethods
function PaymentMethods() {
    return (
        <div className="mb-4">
            <div className="bg-white p-4 mb-4 rounded shadow">
                <h2 className="font-weight-bold text-lg mb-2">PHƯƠNG THỨC VẬN CHUYỂN</h2>
                <div className="d-flex align-items-center mb-2">
                    <input type="radio" id="standard" name="shipping" className="mr-2" checked />
                    <label htmlFor="standard" className="font-weight-bold text-danger">Giao hàng tiêu chuẩn: 20.000 đ</label>
                </div>
                <p className="text-secondary">Dự kiến giao: Thứ Tư - 06/11</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-weight-bold text-lg mb-2">PHƯƠNG THỨC THANH TOÁN</h2>
                <div className="d-flex align-items-center mb-2">
                    <input type="radio" id="vnpay" name="payment" className="mr-2" />
                    <img src="https://placehold.co/24x24" alt="VNPay logo" className="mr-2" />
                    <label htmlFor="vnpay" className="flex-grow-1">VNPAY <a href="#" className="text-primary">Chi tiết</a></label>
                </div>
                <p className="text-warning text-sm mb-2">Quý KH Đăng ký/Đăng nhập tài khoản tại Fahasa.com, Nhập mã "VNPAYFHS20": Giảm 5k cho ĐH từ 50K, Giảm 20K ĐH từ 250K- Nhập mã tại VNPAY</p>
                <div className="d-flex align-items-center mb-2">
                    <input type="radio" id="shopeepay" name="payment" className="mr-2" />
                    <img src="https://placehold.co/24x24" alt="ShopeePay logo" className="mr-2" />
                    <label htmlFor="shopeepay" className="flex-grow-1">Ví ShopeePay <a href="#" className="text-primary">Chi tiết</a></label>
                </div>
                <p className="text-warning text-sm mb-2">KH Đăng ký/ Đăng nhập tài khoản tại Fahasa.com, Nhập mã "SPPFHS11": Giảm 10K cho ĐH 200K - Nhập mã tại SHOPEEPAY - Số lượng có hạn</p>
                <div className="d-flex align-items-center mb-2">
                    <input type="radio" id="momo" name="payment" className="mr-2" />
                    <img src="https://placehold.co/24x24" alt="Momo logo" className="mr-2" />
                    <label htmlFor="momo" className="flex-grow-1">Ví Momo</label>
                </div>
                <div className="d-flex align-items-center mb-2">
                    <input type="radio" id="cash" name="payment" className="mr-2" checked />
                    <img src="https://placehold.co/24x24" alt="Cash on delivery logo" className="mr-2" />
                    <label htmlFor="cash" className="flex-grow-1">Thanh toán bằng tiền mặt khi nhận hàng</label>
                </div>
                <div className="d-flex align-items-center mb-2">
                    <input type="radio" id="atm" name="payment" className="mr-2" />
                    <img src="https://placehold.co/24x24" alt="ATM/Internet Banking logo" className="mr-2" />
                    <label htmlFor="atm" className="flex-grow-1">ATM / Internet Banking</label>
                </div>
                <div className="d-flex align-items-center mb-2">
                    <input type="radio" id="visa" name="payment" className="mr-2" />
                    <img src="https://placehold.co/24x24" alt="Visa/Master/JCB logo" className="mr-2" />
                    <label htmlFor="visa" className="flex-grow-1">Visa / Master / JCB</label>
                </div>
            </div>
        </div>
    );
}

function Checkout() {

    const {user} = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Lưu vị trí hiện tại
            navigate('/auth?redirect=/checkout', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <UserInfo />
                </div>
                <div className="col-md-6">
                    <PaymentMethods />
                </div>
            </div>
            <div className="bg-light p-4 rounded shadow-sm mb-4">
                <h1 className="h5 font-weight-bold mb-3">KIỂM TRA LẠI ĐƠN HÀNG</h1>
                <div className="border-top pt-3">
                    <div className="d-flex align-items-start mb-3">
                        <img src="https://placehold.co/80x120" alt="Book cover" className="img-fluid mr-3" />
                        <div className="flex-grow-1">
                            <p className="small">Lớp Học Mật Ngữ Phiên Bản Mới - Tập 2 - Tặng Kèm Huy Hiệu Lớp Học Mật Ngữ</p>
                        </div>
                        <div className="d-flex justify-content-end align-items-center">
                            <div className="text-right mr-3">
                                <p className="small">21.750 đ</p>
                                <p className="text-muted small text-decoration-line-through">25.000 đ</p>
                            </div>
                            <div className="text-center mx-2">
                                <p className="small">1</p>
                            </div>
                            <div className="text-right">
                                <p className="small font-weight-bold text-danger">21.750 đ</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-top pt-3">
                        <div className="d-flex align-items-start mb-3">
                            <img src="https://placehold.co/80x120" alt="Book cover" className="img-fluid mr-3" />
                            <div className="flex-grow-1">
                                <p className="small">[Light Novel] Dược Sư Tự Sự - Tập 5 - Tặng Kèm Bookmark + Sổ Xé</p>
                            </div>
                            <div className="d-flex justify-content-end align-items-center">
                                <div className="text-right mr-3">
                                    <p className="small">102.500 đ</p>
                                    <p className="text-muted small text-decoration-line-through">125.000 đ</p>
                                </div>
                                <div className="text-center mx-2">
                                    <p className="small">2</p>
                                </div>
                                <div className="text-right">
                                    <p className="small font-weight-bold text-danger">205.000 đ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center mb-5">
                <div className="bg-white p-4 rounded shadow-sm w-100">
                    <h1 className="h5 font-weight-bold mb-4">MÃ KHUYẾN MÃI/MÃ QUÀ TẶNG</h1>
                    <div className="form-inline mb-2">
                        <label className="mr-2 text-gray-700">Mã KM/Quà tặng</label>
                        <input 
                            type="text" 
                            placeholder="Nhập mã khuyến mãi/Quà tặng" 
                            className="form-control flex-grow-1 mr-2"
                        />
                        <button className="btn btn-primary">Áp dụng</button>
                    </div>
                    <a href="#" className="text-primary">Chọn mã khuyến mãi</a>
                    <p className="text-muted mt-2">Có thể áp dụng đồng thời nhiều mã <i className="fas fa-info-circle"></i></p>
                </div>
            </div>
            <div className="w-100 bg-white p-3 border-top shadow-lg rounded-lg fixed-bottom">
                <h2 className="h5 font-weight-semibold text-gray-800">Thanh Toán Đơn Hàng</h2>
                <div className="d-flex justify-content-between">
                    <div className="text-gray-700 small">Thành tiền</div>
                    <div className="text-gray-700 font-weight-medium small">226.750 đ</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="text-gray-700 small">Phí vận chuyển (Giao hàng tiêu chuẩn)</div>
                    <div className="text-gray-700 font-weight-medium small">20.000 đ</div>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <div className="font-weight-bold text-gray-900 h6">Tổng Số Tiền (gồm VAT)</div>
                    <div className="font-weight-bold text-warning h6">246.750 đ</div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="termsCheckbox" checked />
                        <label className="form-check-label" htmlFor="termsCheckbox">
                            Bằng việc tiến hành mua hàng, bạn đã đồng ý với
                            <a href="#" className="text-primary ml-1">Điều khoản & Điều kiện của Pahasa.com</a>
                        </label>
                    </div>
                    <button className="btn btn-danger font-weight-semibold px-4">Xác nhận thanh toán</button>
                </div>
            </div>
        </div>
    );
}


export default Checkout;

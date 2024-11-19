import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/UserContext'
import { getShippingFeeByProvinceId } from '../../services/shippingService';
import { createZaloPay } from '../../services/zaloPayService';
import { createMomoPay } from '../../services/momoService';
import { createOrder } from '../../services/orderService';

function Checkout() {

    const { user } = useStateContext();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [items, setItems] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(0);
    const [selectedDistrict, setSelectedDistrict] = useState(0);
    const [selectedWard, setSelectedWard] = useState(0);

    const [selectedShipping, setSelectedShipping] = useState('standard');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [addressDetail, setAddressDetail] = useState(''); 
    const [error, setError] = useState(''); 
   
    const paymentLogos = {
        cash: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731438956/ico_cashondelivery_olyccj.svg',
        VNPAY: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731438956/ico_vnpay_p7e5eq.svg',
        zalopay: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731419014/Logo-ZaloPay-Square_ktergo.webp',
        atm: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731419014/Logo-ATM.webp',
        momo: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731439476/momo_icon_ltl6ll.png'
    };
    

    const handleChange = (e) => {
        setAddressDetail(e.target.value); // Cập nhật giá trị địa chỉ khi người dùng nhập
        if(addressDetail.trim() !== '')
            setError('')
    };


    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };


    useEffect(() => {
        // Lấy dữ liệu từ Local Storage
        const itemsPayment = JSON.parse(localStorage.getItem('itemsPayment')) || [];
        setItems(itemsPayment);
    }, []);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
                const data = await response.json();

                if (data.error === 0) {
                    setProvinces(data.data);
                } else {
                    console.error('Error fetching provinces:', data.error);
                }
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            }
        };

        fetchProvinces();
    }, []);


    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;

        try {

            setSelectedProvince(provinceId);
            setDistricts([]);  // Reset districts and wards when province changes
            setWards([]);
            setSelectedDistrict(0);
            setSelectedWard(0);

            const response = await getShippingFeeByProvinceId(provinceId);
            const shippingFee = response.data.shippingFee;
            setShippingFee(shippingFee);

        } catch (error) {
            setShippingFee(40000)
        }
        // Fetch districts based on selected province
        fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) {
                    setDistricts(data.data);
                }
            });
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setWards([]);
        setSelectedWard(0);

        // Fetch wards based on selected district
        fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) {
                    setWards(data.data);
                }
            });
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    };


    useEffect(() => {
        if (!user) {
            navigate('/auth?redirect=/checkout', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        const itemsPayment = JSON.parse(localStorage.getItem('itemsPayment')) || [];
        setItems(itemsPayment);
        console.log(itemsPayment)
        const total = itemsPayment.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
    }, []);

    const handleSubmit = async () => {
         if (!selectedProvince || !selectedDistrict || !selectedWard) {
             alert('Please select the full address');
             return;
         }
    
        if (addressDetail.trim() === '') { 
            setError('Vui lòng nhập địa chỉ chi tiết'); 
        } else {
            setError(''); 
    
            const orderData ={
                userId: user?._id,
                address: `${addressDetail}, ${wards.find(w => w.id === selectedWard)?.full_name}, ${districts.find(d => d.id === selectedDistrict)?.full_name}, ${provinces.find(p => p.id === selectedProvince)?.full_name}`,
                itemsPayment: items.map(item => ({
                            bookId: item.bookId._id,
                             quantity: item.quantity,
                            price: item.price
                        })),
                discountCode:"SALE20",
                shippingFee: shippingFee,
                totalPrice: totalPrice,
                paymentMethod: selectedPayment
            }
            
    
            try {
                // Call the createOrder API to submit the order
                const response = await createOrder(orderData);
                if (response.data.success) {
                    console.log(response.data.data._id)
                    const orderId= response.data.data._id
                if(selectedPayment ==='zalopay'){
                    const zaloPayData = {orderId: orderId}
                    const response = await createZaloPay(zaloPayData);
                    console.log(response)
                    const {order_url} = response.data;
                    window.location.href = order_url;
                }
                if(selectedPayment ==='momo'){
                    const momoData = {orderId: orderId}
                    const response = await createMomoPay(momoData);
                    console.log(response)
                    const {payUrl} = response.data;
                    window.location.href = payUrl;
                }

                } else {
                    console.log("Error: ", response.error || "Unknown error");
                    setError('There was an error while creating your order.');
                }
            } catch (error) {
                console.error('Order creation failed:', error);
                setError('There was an error while processing your order.');
            }
        }
    };
    

    return (
        <div className="container mt-5">
           
            <div className="row">
                <div className="col-md-6 mb-4">

                    <div className="bg-white p-4 rounded shadow w-100 h-100">
                        <h2 className="h4 fw-bold mb-4">ĐỊA CHỈ GIAO HÀNG</h2>
                        <hr className="mb-4" />
                        <div className="mb-4">
                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Họ và tên người nhận</label>
                                <div className="col-sm-6">
                                    <input type="text" value={user?.fullName} className="form-control" readOnly />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Số điện thoại</label>
                                <div className="col-sm-6">
                                    <input type="text" value={user?.phone} className="form-control" readOnly />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Quốc gia</label>
                                <div className="col-sm-6">
                                    <input type="text" value="Việt Nam" className="form-control" readOnly />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Tỉnh/Thành Phố</label>
                                <div className="col-sm-6">
                                    <select className="form-control" onChange={handleProvinceChange} value={selectedProvince}>
                                        <option value="">Chọn Tỉnh Thành</option>
                                        {provinces.map((province) => (
                                            <option key={province.id} value={province.id}>{province.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Quận/Huyện</label>
                                <div className="col-sm-6">
                                    <select className="form-control" onChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedProvince}>
                                        <option value="">Chọn Quận Huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.id} value={district.id}>{district.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Phường/Xã</label>
                                <div className="col-sm-6">
                                    <select className="form-control" onChange={handleWardChange} value={selectedWard} disabled={!selectedDistrict}>
                                        <option value="" style={{ color: "#6c757d" }}>Chọn Phường Xã</option>
                                        {wards.map((ward) => (
                                            <option key={ward.id} value={ward.id}>{ward.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Địa chỉ nhận hàng</label>
                                <div className="col-sm-6">
                                    <input type="text" placeholder=" số 123 đường Nguyễn Văn A..." className="form-control" onChange={handleChange}
                    />
                    {error && <small className="text-danger">{error}</small>} {/* Hiển thị thông báo lỗi nếu có */}
                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">

                    <div className="mb-4">
                        <div className="bg-white p-4 mb-4 rounded shadow">
                            <h2 className="fw-bold text-lg mb-2">PHƯƠNG THỨC VẬN CHUYỂN</h2>
                            <div className="d-flex align-items-center mb-2">
                                <input
                                    type="radio"
                                    id="standard"
                                    name="shipping"
                                    className="me-2"
                                    checked={selectedShipping === 'standard'}
                                    onChange={() => setSelectedShipping('standard')}
                                />
                                <p className="fw-bold">Giao hàng tiêu chuẩn: {formatCurrency(shippingFee) || '20.000'} </p>
                            </div>
                            <p className="text-secondary">Dự kiến giao: Thứ Tư - 06/11</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="fw-bold text-lg mb-4">PHƯƠNG THỨC THANH TOÁN</h2>
                            {['cash', 'VNPAY', 'zalopay', 'atm', 'momo'].map(method => (
                                <div className="payment-option d-flex align-items-center mb-3" key={method}>
                                    <input
                                        type="radio"
                                        id={method}
                                        name="payment"
                                        className="me-2"
                                        checked={selectedPayment === method}
                                        onChange={() => setSelectedPayment(method)}
                                    />
                                    <img  src={paymentLogos[method]}  alt={`${method} logo`} className="me-2" style={{width:"32px"}} />
                                    <label htmlFor={method} className="flex-grow-1 font-weight-medium">
                                        {method === 'cash' ? 'Thanh toán bằng tiền mặt khi nhận hàng' : method.toUpperCase()}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-light p-4 rounded shadow-sm mb-4">
                <h1 className="h5 fw-bold mb-3">KIỂM TRA LẠI ĐƠN HÀNG</h1>
                {items.map((item, index) => (
                    <div className="border-top pt-3" key={item._id}>
                        <div className="d-flex align-items-start mb-3">
                            <img
                                src={item.bookId?.images?.[0] || "https://placehold.co/80x120"}
                                alt="Book cover"
                                className="img-fluid mr-3"
                                style={{ width: '80px', height: '120px' }}
                            />
                            <div className="flex-grow-1 ms-3">
                                <p className="small fw-bold">{item.bookId?.title}</p>
                                <p className="small">{item.bookId?.author}</p>
                            </div>
                            <div className="d-flex justify-content-end align-items-center">
                                <div className="text-right me-5">
                                    <p className="small">{item.price.toLocaleString()} đ</p>
                                </div>
                                <div className="text-center">
                                    <p className="small">{item.quantity}</p>
                                </div>
                                <div className="text-right ms-5">
                                    <p className="small fw-bold text-danger">{(item.price * item.quantity).toLocaleString()} đ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center mb-5" >
                <div className="bg-white p-4 rounded shadow-sm w-100">
                    <h1 className="h5 fw-bold mb-4">MÃ KHUYẾN MÃI/MÃ QUÀ TẶNG</h1>
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
            <div style={{ height: "160px" }}></div>
            <div className="w-100 bg-white p-3 border-top shadow-lg rounded-lg fixed-bottom">
                <h2 className="h5 font-weight-semibold text-gray-800">Thanh Toán Đơn Hàng</h2>
                <div className="d-flex justify-content-between">
                    <div className="text-gray-700 small">Thành tiền</div>
                    <div className="text-gray-700 font-weight-medium small">{totalPrice.toLocaleString()} đ</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="text-gray-700 small">Phí vận chuyển (Giao hàng tiêu chuẩn)</div>
                    <div className="text-gray-700 font-weight-medium small">{shippingFee.toLocaleString()} đ</div>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <div className="fw-bold text-gray-900 h6">Tổng Số Tiền (gồm VAT)</div>
                    <div className="fw-bold text-warning h6">{(totalPrice + shippingFee).toLocaleString()} đ</div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="termsCheckbox" checked />
                        <label className="form-check-label" htmlFor="termsCheckbox">
                            Bằng việc tiến hành mua hàng, bạn đã đồng ý với
                            <a href="#" className="text-primary ml-1">Điều khoản & Điều kiện của Pahasa.com</a>
                        </label>
                    </div>
                    <button className="btn btn-danger font-weight-semibold px-4" onClick={handleSubmit} >Xác nhận thanh toán</button>
                </div>
            </div>
        </div>
    );
}


export default Checkout;

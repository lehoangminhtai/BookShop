import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

import { useStateContext } from '../../context/UserContext'

//service
import { getShippingFeeByProvinceId } from '../../services/shippingService';
import { createZaloPay } from '../../services/zaloPayService';
import { createMomoPay } from '../../services/momoService';
import { createOrder } from '../../services/orderService';
import { searchDiscountForUser } from '../../services/discountService';
import { addAddressForUser, getAddressForUser, updateAddressForUser, deleteAddressForUser } from '../../services/addressService';

//component
import Discount from '../../components/customer/Discount';
import AddressDetail from '../../components/customer/AddressDetail';
import EditAddress from '../../components/customer/AddressEditForm';

//css
import '../../css/user/Discount.scss'

function Checkout() {

    const { user } = useStateContext();
    const [name, setName] = useState()
    const [phone, setPhone] = useState()
    const [isDefault, setIsDefault] = useState(false)

    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [items, setItems] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();

    const [selectedProvince, setSelectedProvince] = useState(0);
    const [selectedDistrict, setSelectedDistrict] = useState(0);
    const [selectedWard, setSelectedWard] = useState(0);

    const [selectedShipping, setSelectedShipping] = useState('standard');
    const [selectedPayment, setSelectedPayment] = useState('cash');
    const [addressDetail, setAddressDetail] = useState('');

    const [addresses, setAddresses] = useState([])
    const [address, setAddress] = useState([])
    const [addressSelected, setAddressSelected] = useState(null)
    const [street, setStreet] = useState()

    const [discountSelected, setDiscountSelected] = useState(null);
    const [discountCode, setDiscountCode] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [showModalAddress, setShowModalAddress] = useState(false);
    const [showModalEditAddress, setShowModalEditAddress] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});



    const paymentLogos = {
        cash: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731438956/ico_cashondelivery_olyccj.svg',

        zalopay: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731419014/Logo-ZaloPay-Square_ktergo.webp',

        momo: 'https://res.cloudinary.com/dyu419id3/image/upload/v1731439476/momo_icon_ltl6ll.png'
    };


    const handleInputChange = (e, field) => {
        const value = e.target.value;
        const updatedErrors = { ...errors };

        if (value.trim() !== '') {
            delete updatedErrors[field];
        }


        if (field === "discountCode") {
            setDiscountCode(e.target.value.toUpperCase());
        }

        if (field === "name") {
            setName(value)
        }
        if (field === "phone") {
            setPhone(value)
        }
        if (field === "street") {
            setStreet(value)
        }
        if (field === "isDefault" && e.target.checked) {
            setIsDefault(true)
        }
        else if (field === "isDefault" && !e.target.checked) {
            setIsDefault(false)
        }
        if (field === "addressSelected" && e.target.checked) {
            setAddressSelected(value)

            console.log(addressSelected)
        }
        setErrors(updatedErrors);
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    //useEffect

    const fetchUserAddresses = async () => {
        const response = await getAddressForUser(user?._id)

        if (response.success) {
            setAddresses(response.addresses.addresses)
        }
    }


    const handleAddNewAddress = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!name) {
            newErrors.name = 'Vui lòng nhập tên người nhận'
        }

        if (name) {
            if (name.length > 50 || name.length < 2) {
                newErrors.name = 'Vui lòng nhập tên người nhận hợp lệ'
            }
        }

        if (!phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else {

            if (phone.length != 10) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            }

            const phoneRegex = /^[+]?[\d]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        if (!selectedWard) {
            newErrors.ward = "Vui lòng chọn phường/xã"
        }
        if (!selectedDistrict) {
            newErrors.district = "Vui lòng chọn quận/huyện"
        }
        if (!selectedProvince) {
            newErrors.province = "Vui lòng chọn tỉnh/thành phố"
        }
        if (!street) {
            newErrors.street = "Vui lòng nhập địa chỉ nhà"
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return
        }

        try {
            const dataAddress = {
                name: name,
                phone: phone,
                street: street,
                idWard: Number(selectedWard),
                ward: wards.find(w => w.id === selectedWard)?.full_name,
                idDistrict: Number(selectedDistrict),
                district: districts.find(d => d.id === selectedDistrict)?.full_name,
                idProvince: Number(selectedProvince),
                province: provinces.find(p => p.id === selectedProvince)?.full_name,
                isDefault: isDefault

            }
            const response = await addAddressForUser(user?._id, dataAddress)
            if (response.success) {
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Đã thêm địa chỉ nhận hàng
                </div>,
                    {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeButton: false,
                        className: "custom-toast",
                        draggable: false,
                        rtl: false,
                    }
                );
                setName();
                setPhone();
                setStreet();
                setSelectedWard(0);
                setSelectedDistrict(0);
                setSelectedProvince(0);
                setShippingFee(0)
                fetchUserAddresses();
                closeModalAddress();
            }
            else if (!response.success) {
                toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                    {response.message}
                </div>,
                    {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeButton: false,
                        className: "custom-toast",
                        draggable: false,
                        rtl: false,
                    }
                );
            }
        } catch (error) {

        }

    }
  

    const handleDeleteAddress = async (addressId) => {
        const addressData = { userId: user?._id, addressId }

        try {
            const response = await deleteAddressForUser(addressData)

            if (response.success) {
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Đã xóa địa chỉ nhận hàng
                </div>,
                    {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeButton: false,
                        className: "custom-toast",
                        draggable: false,
                        rtl: false,
                    }
                );
                fetchUserAddresses();
            }
            else if (!response.success) {
                toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                    {response.message}
                </div>,
                    {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeButton: false,
                        className: "custom-toast",
                        draggable: false,
                        rtl: false,
                    }
                );
            }
        } catch (error) {

        }

    };


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
        fetchUserAddresses();
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/auth?redirect=/checkout', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        const defaultAddress = addresses.find((address) => address.isDefault);
        if (defaultAddress && addressSelected === null) {
            setAddressSelected(defaultAddress._id);
            setSelectedProvince(defaultAddress.idProvince)
            console.log(addressSelected)
        }
    }, [addresses, addressSelected]);

    //get itemPayment
    useEffect(() => {
        const itemsPayment = JSON.parse(localStorage.getItem('itemsPayment')) || [];
        setItems(itemsPayment);
        console.log(itemsPayment)
        const total = itemsPayment.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);

        const discount = JSON.parse(localStorage.getItem('discount')) || null;
        setDiscountSelected(discount)


    }, []);

    const handleShowModalAddress = () => {
        setShowModalAddress(true)
        document.body.classList.add("no-scroll");
    }

    const closeModalAddress = () => {
        setShowModalAddress(false)
        setShippingFee(0)
        document.body.classList.remove("no-scroll");
    }

    //Mở modal edit address
    const handleShowModalEditAddress = (address, provinces,districts, wards) => {

        setAddress(address)
        setProvinces(provinces)
        setDistricts(districts)
        setWards(wards)

        setShowModalEditAddress(true)
        document.body.classList.add("no-scroll");
    }
    /********/

    // Đóng modal edit address

    const closeModalEditAddress = () => {
        setShowModalEditAddress(false)
        document.body.classList.remove("no-scroll");
    }
    /********/

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        if (provinceId) {
            const updatedErrors = { ...errors };
            delete updatedErrors['province'];
            setErrors(updatedErrors);
            try {
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
        }
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;

        const updatedErrors = { ...errors };
        delete updatedErrors['district'];
        setErrors(updatedErrors);

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
        const updatedErrors = { ...errors };
        delete updatedErrors['ward'];
        setErrors(updatedErrors);
    };


    const handleShowDiscount = () => {
        setShowModal(true)
        document.body.classList.add("no-scroll");
    }

    const closeModal = () => {
        setShowModal(false);
        getDiscount()
        document.body.classList.remove("no-scroll");
    };

    const getDiscount = () => {
        const discount = JSON.parse(localStorage.getItem('discount')) || null;
        setDiscountSelected(discount)
    }


    const closeModalWithDiscount = (selectedDiscount) => {
        setDiscountSelected(selectedDiscount);
        document.body.classList.remove("no-scroll");
        setShowModal(false);  // Đóng modal
    };

    const handleDeleteDiscount = () => {
        setDiscountSelected(null)
        localStorage.removeItem('discount');
    }

    const handleSearchDiscount = async (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!discountCode) newErrors.discountCode = 'Vui lòng nhập mã giảm giá';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return
        }
        try {
            const userId = user?._id
            const dataDiscount = { userId, discountCode }

            const response = await searchDiscountForUser(dataDiscount);

            if (response.data.success) {
                const discount = response.data.discount
                setDiscountSelected(discount)
                localStorage.setItem('discount', JSON.stringify(discount));
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Mã giảm đã được áp vào đơn hàng
                </div>,
                    {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeButton: false,
                        className: "custom-toast",
                        draggable: false,
                        rtl: false,
                    }
                );
                setDiscountCode('')
            }
            else if (!response.data.success) {

                toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                    Mã {discountCode} không hợp lệ
                </div>,
                    {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeButton: false,
                        className: "custom-toast",
                        draggable: false,
                        rtl: false,
                    }
                );
            }

        } catch (error) {
            toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                Có lỗi trong lúc áp mã giảm
            </div>,
                {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeButton: false,
                    className: "custom-toast",
                    draggable: false,
                    rtl: false,
                }
            );
        }
    }

    const handleCalculateDiscount = () => {
        if (discountSelected) {
            const discount = discountSelected;
            let discountAmount = 0;
            if (discount.discountType === 'percentage') {
                discountAmount = (totalPrice * discount.percent) / 100;
            } else if (discount.discountType === 'amount') {
                discountAmount = discount.amount;
            }

            // Đảm bảo không vượt quá mức giảm giá tối đa
            if (discount.discountType === 'percentage') {
                if (discount.maxAmountDiscount) {
                    discountAmount = Math.min(discountAmount, discount.maxAmountDiscount);
                }

            }
            return discountAmount
        }
        else {
            return 0;
        }
    }

    const handleSubmit = async () => {
        if(!addressSelected){
            toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                Vui lòng chọn địa chỉ nhận hàng hoặc thêm mới
            </div>,
                {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeButton: false,
                    className: "custom-toast",
                    draggable: false,
                    rtl: false,
                }
            );
            return 
        }
        const orderData = {
            userId: user?._id,
            address: `${street}, ${ward}, ${district}, ${province}`,
            itemsPayment: items.map(item => ({
                bookId: item.bookId._id,
                quantity: item.quantity,
                price: item.price
            })),
            discountCode: discountSelected?.discountCode,
            shippingFee: shippingFee,
            totalPrice: totalPrice,
            paymentMethod: selectedPayment
        }


        try {
            // Call the createOrder API to submit the order
            const response = await createOrder(orderData);
            if (response.data.success) {

                const orderId = response.data.data._id

                if (selectedPayment === 'cash') {
                    navigate(`/payment/success?orderId=${orderId}`)
                }
                if (selectedPayment === 'zalopay') {
                    const zaloPayData = { orderId: orderId }
                    const response = await createZaloPay(zaloPayData);

                    const { order_url } = response.data;
                    window.location.href = order_url;
                }
                if (selectedPayment === 'momo') {
                    const momoData = { orderId: orderId }
                    const response = await createMomoPay(momoData);

                    const { payUrl } = response.data;
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

    };

    /*********/

    //Set địa chỉ

    const handleChooseAddress = (address) => {
        setAddressSelected(address._id)
        setAddress(address)
        setSelectedProvince(address.idProvince)
        setStreet(address.street)
        setWard(address.ward)
        setDistrict(address.district)
        setProvince(address.province)
    }

    //******//

    
    // Tính phí vận chuyển
    const getShippingFee = async (provinceId) => {
        try {
            const response = await getShippingFeeByProvinceId(provinceId);
            const shippingFee = response.data.shippingFee;
            setShippingFee(shippingFee);
        } catch (error) {
            setShippingFee(40000)
        }

    }
    useEffect(() => {
        if (selectedProvince !== 0)
            getShippingFee(selectedProvince)
    }, [selectedProvince])
    //********** *//

    return (
        <div className="container mt-5">

            <div className="row">
                <div className="col-md-6 mb-4">

                    <div className="bg-white p-4 rounded shadow w-100 h-100">
                        <h2 className="h4 fw-bold mb-4">ĐỊA CHỈ GIAO HÀNG</h2>
                        <hr className="mb-4" />
                        <div className="mb-4">

                            <div className="form-group row mb-3">
                                <label className="col-sm-6 col-form-label fw-bold">Địa chỉ</label>

                            </div>
                            <div className="form-group row mb-3">
                                <div className="col-sm-6 w-100">
                                    <div className="w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                        {addresses.map((address) => (
                                            <div key={address?._id} className="form-check w-100">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="address"
                                                    value={address._id}
                                                    checked={addressSelected === address._id || (address.isDefault && addressSelected === null)}  // Chỉ chọn khi đúng
                                                    onChange={(e) => handleInputChange(e, 'addressSelected')}
                                                />
                                                <label className="form-check-label " htmlFor={`address-${address?._id}`}>
                                                    {/* Icon Location */}

                                                    <AddressDetail address={address} provinces={provinces} onEdit={handleShowModalEditAddress}
                                                        onDelete={handleDeleteAddress} onChoose={handleChooseAddress}
                                                         />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className="form-group row mb-3">

                                <div className="d-flex justify-content-center">
                                    <button className='btn btn-primary' onClick={handleShowModalAddress}>Thêm địa chỉ mới</button>
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
                            {['cash', 'zalopay', 'momo'].map(method => (
                                <div className="payment-option d-flex align-items-center mb-3" key={method}>
                                    <input
                                        type="radio"
                                        id={method}
                                        name="payment"
                                        className="me-2"
                                        checked={selectedPayment === method}
                                        onChange={() => setSelectedPayment(method)}
                                    />
                                    <img src={paymentLogos[method]} alt={`${method} logo`} className="me-2" style={{ width: "32px" }} />
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

                        <div className="d-flex flex-column mb-3 mt-3">
                            <div className="d-flex">
                                <input
                                    type="text"
                                    placeholder="Nhập mã khuyến mãi/Quà tặng"
                                    className={`form-control ${errors.discountCode ? 'is-invalid' : ''} mb-1 me-1`}
                                    value={discountCode}
                                    onChange={(e) => handleInputChange(e, 'discountCode')}
                                />
                                <button className="btn btn-primary w-25 w-md-auto" onClick={handleSearchDiscount}>Áp Dụng</button>
                            </div>
                            {errors.discountCode && <div className="invalid-feedback d-block">{errors.discountCode}</div>}
                        </div>


                    </div>
                    <Link className="text-primary" onClick={handleShowDiscount}>Chọn mã khuyến mãi</Link>
                    {discountSelected && (
                        <div class="container mt-3">
                            <div class="d-flex justify-content-center row">
                                <div class="col-md-6">
                                    <div class="coupon p-3" style={{ background: "#EBE3D8", position: 'relative' }}>
                                        <button
                                            onClick={handleDeleteDiscount}

                                            style={{
                                                position: 'absolute',
                                                top: '-15px',   // Điều chỉnh để nó nửa nằm ngoài
                                                right: '-3px', // Điều chỉnh để nó nửa nằm ngoài
                                                background: 'transparent',
                                                border: 'none',
                                                fontSize: '24px',
                                                color: 'black',
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}


                                        >
                                            &times;
                                        </button>
                                        <div class="row no-gutters mt-2">
                                            <div class="col-md-4 border-right">
                                                <div class="d-flex flex-column align-items-center">
                                                    <i className='fas fa-gift text-black'></i>
                                                    <span class="d-block mt-1 fw-bold text-black">Book</span>
                                                    <span class="fw-bold text-black">Shop</span>
                                                </div>
                                            </div>
                                            <div class="col-md-8">
                                                <div>
                                                    <div class="d-flex flex-row justify-content-end off">
                                                        <h1>{discountSelected.discountName}</h1>
                                                    </div>
                                                    <div class="d-flex flex-row justify-content-between off px-3 p-2">
                                                        <span></span>
                                                        <span class="border border-info px-3 rounded" style={{ color: 'blue' }}>
                                                            Giảm {discountSelected.discountType === 'percentage' ? discountSelected.percent + ' %' : formatCurrency(discountSelected.amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
            <div style={{ height: "160px" }}></div>
            <div className="w-100 bg-white p-3 border-top shadow-lg rounded-lg fixed-bottom" style={{ zIndex: "1000" }}>
                <h2 className="h5 font-weight-semibold text-gray-800">Thanh Toán Đơn Hàng</h2>
                <div className="d-flex justify-content-between">
                    <div className="text-gray-700 small">Thành tiền</div>
                    <div className="text-gray-700 font-weight-medium small">{totalPrice.toLocaleString()} đ</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="text-gray-700 small">Phí vận chuyển (Giao hàng tiêu chuẩn)</div>
                    <div className="text-gray-700 font-weight-medium small">{shippingFee.toLocaleString()} đ</div>
                </div>
                {
                    discountSelected && (
                        <div className="d-flex justify-content-between">
                            <div className="text-gray-700 small">Giảm giá</div>
                            <div className="text-gray-700 font-weight-medium small">{handleCalculateDiscount().toLocaleString()} đ</div>
                        </div>
                    )
                }
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <div className="fw-bold text-gray-900 h6">Tổng Số Tiền (gồm VAT)</div>
                    <div className="fw-bold text-warning h6">{(totalPrice + shippingFee - handleCalculateDiscount()).toLocaleString()} đ</div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="termsCheckbox" checked />
                        <label className="form-check-label" htmlFor="termsCheckbox">
                            Bằng việc tiến hành mua hàng, bạn đã đồng ý với
                            <a className="text-primary ml-1">Điều khoản & Điều kiện của Pahasa.com</a>
                        </label>
                    </div>
                    <button className="btn btn-danger font-weight-semibold px-4" onClick={handleSubmit} >Xác nhận thanh toán</button>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay" style={{ marginTop: '20px', zIndex: "1050" }}>
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModal}>&times;</button>
                        <Discount onClose={closeModalWithDiscount} totalPrice={totalPrice} selectedDiscount={discountSelected} />
                    </div>
                </div>
            )}
            {
                showModalAddress && (
                    <div className="modal-overlay" style={{ marginTop: '20px', zIndex: "1050" }}>
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModalAddress}>&times;</button>
                            <div className="container">
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="w-100">
                                        <h5 className="text-primary text-center h5">
                                            <i className="fas fa-location-dot fa-2x mb-2"
                                                style={{ color: "#007bff" }}
                                            ></i>
                                            THÊM ĐỊA CHỈ NHẬN HÀNG
                                        </h5>
                                        <div className="card-body">
                                            <div className="form-group row mb-3">
                                                <label className="col-sm-6 col-form-label fw-bold">Họ và tên người nhận</label>
                                                <div className="col-sm-6">
                                                    <input type="text"
                                                        value={name}
                                                        onChange={(e) => handleInputChange(e, "name")}
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''} mb-1`}
                                                    />
                                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                </div>
                                            </div>

                                            <div className="form-group row mb-3">
                                                <label className="col-sm-6 col-form-label fw-bold">Số điện thoại</label>
                                                <div className="col-sm-6">
                                                    <input type="number"
                                                        value={phone}
                                                        onChange={(e) => handleInputChange(e, "phone")}
                                                        className={`form-control ${errors.phone ? 'is-invalid' : ''} mb-1`} />
                                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                                </div>
                                            </div>


                                            <div className="form-group row mb-3">
                                                <label className="col-sm-6 col-form-label fw-bold">Tỉnh/Thành Phố</label>
                                                <div className="col-sm-6">
                                                    <select className={`form-control ${errors.province ? 'is-invalid' : ''} mb-1`} onChange={handleProvinceChange} value={selectedProvince}>
                                                        <option value="">Chọn Tỉnh Thành</option>
                                                        {provinces.map((province) => (
                                                            <option key={province.id} value={province.id}>{province.full_name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                                                </div>
                                            </div>

                                            <div className="form-group row mb-3">
                                                <label className="col-sm-6 col-form-label fw-bold">Quận/Huyện</label>
                                                <div className="col-sm-6">
                                                    <select className={`form-control ${errors.district ? 'is-invalid' : ''} mb-1`} onChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedProvince}>
                                                        <option value="">Chọn Quận Huyện</option>
                                                        {districts.map((district) => (
                                                            <option key={district.id} value={district.id}>{district.full_name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                                                </div>
                                            </div>

                                            <div className="form-group row mb-3">
                                                <label className="col-sm-6 col-form-label fw-bold">Phường/Xã</label>
                                                <div className="col-sm-6">
                                                    <select className={`form-control ${errors.ward ? 'is-invalid' : ''} mb-1`} onChange={handleWardChange} value={selectedWard} disabled={!selectedDistrict}>
                                                        <option value="" style={{ color: "#6c757d" }}>Chọn Phường Xã</option>
                                                        {wards.map((ward) => (
                                                            <option key={ward.id} value={ward.id}>{ward.full_name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                                                </div>
                                            </div>
                                            <div className="form-group row mb-3">
                                                <label className="col-sm-6 col-form-label fw-bold">Địa chỉ nhà</label>
                                                <div className="col-sm-6">
                                                    <input type="text" placeholder=" số 123 đường Nguyễn Văn A..." className={`form-control ${errors.street ? 'is-invalid' : ''} mb-1`}
                                                        value={street}
                                                        onChange={(e) => handleInputChange(e, "street")}
                                                    />
                                                    {errors.street && <div className="invalid-feedback">{errors.street}</div>} {/* Hiển thị thông báo lỗi nếu có */}

                                                </div>
                                            </div>
                                            <div className="form-group row mb-3">
                                                <div className="form-check form-switch d-flex align-items-center">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="isDefault"
                                                        onChange={(e) => handleInputChange(e, 'isDefault')}
                                                    />
                                                    <label
                                                        className="form-check-label ms-2 fw-bold"
                                                        htmlFor="isDefault"
                                                    >
                                                        Đặt mặc định
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-group row mb-3">
                                                <div className="d-flex justify-content-center">
                                                    <button className='btn btn-primary' onClick={handleAddNewAddress}>Thêm</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {showModalEditAddress && (
                <div className="modal-overlay" style={{ marginTop: '20px', zIndex: "1050" }}>
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModalEditAddress}>&times;</button>
                        <EditAddress address={address} provinces={provinces} districts={districts} wards={wards} userId={user?._id}/>
                    </div>
                </div>

            )}
            <ToastContainer />
        </div>
    );
}


export default Checkout;

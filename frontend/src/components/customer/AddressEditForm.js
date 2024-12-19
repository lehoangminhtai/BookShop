import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { updateAddressForUser } from "../../services/addressService";

const EditAddress = ({ address,onClose, userId }) => {
    // State lưu trữ các thông tin cần thiết
    const [name, setName] = useState(address.name || "");
    const [phone, setPhone] = useState(address.phone || "");
    const [street, setStreet] = useState(address.street || "");
    const [selectedProvince, setSelectedProvince] = useState(address.idProvince || "");
    const [selectedDistrict, setSelectedDistrict] = useState(address.idDistrict || "");
    const [selectedWard, setSelectedWard] = useState(address.idWard || "");
    const [ward, setWard] = useState(address.ward)
    const [district, setDistrict] = useState(address.ward)
    const [province, setProvince] = useState(address.ward)
    const [isDefault, setIsDefault] = useState(address.isDefault || false);
    const [errors, setErrors] = useState({})

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const fetchWards = async (districtId) => {
        try {
            const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            if (response.ok) {
                const data = await response.json();
                if (data.error === 0) {
                    return data.data;
                } else {
                    console.error('Error fetching wards:', data.error);
                    return [];
                }
            } else {
                console.error('HTTP error:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Failed to fetch wards:', error);
            return [];
        }
    };
    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            if (response.ok) {
                const data = await response.json();
                if (data.error === 0) {
                    return data.data;
                } else {
                    console.error('Error fetching districts:', data.error);
                    return [];
                }
            } else {
                console.error('HTTP error:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Failed to fetch wards:', error);
            return [];
        }
    };

    useEffect(() => {
        const loadWards = async () => {
            if (address.idDistrict) {
                const wardsData = await fetchWards(address.idDistrict);
                setWards(wardsData);
            }
        };

        const loadDistricts = async () => {
            if (address.idProvince) {
                const districtData = await fetchDistricts(address.idProvince);
                setDistricts(districtData);
            }
        };

        loadWards();
        loadDistricts();
    }, [address.idDistrict, address.idProvince]);

    
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
    // Xử lý thay đổi tên
    const handleInputChange = (e, field) => {
        const value = e.target.value;
        switch (field) {
            case "name":
                setName(value);
                break;
            case "phone":
                setPhone(value);
                break;
            case "street":
                setStreet(value);
                break;
            case "isDefault":
                setIsDefault(e.target.checked);
                break;
            case "province":
                setSelectedProvince(value);
                setSelectedDistrict(""); // Reset quận/huyện khi thay đổi tỉnh
                setSelectedWard(""); // Reset phường/xã khi thay đổi tỉnh
                break;
            case "district":
                setSelectedDistrict(value);
                setSelectedWard(""); // Reset phường/xã khi thay đổi quận/huyện
                break;
            case "ward":
                setSelectedWard(value);
                break;
            default:
                break;
        }
    };

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
            } catch (error) {
                
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

    // Xử lý cập nhật địa chỉ
    const handleSubmit = async (event) => {
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

            const addressData = {
                name,
                phone,
                street,
                idProvince: Number(selectedProvince),
                province:province,
               // province: provinces.find(p => p.id === selectedProvince)?.full_name,
                idDistrict: Number(selectedDistrict),
                district,
                //district: districts.find(d => d.id === selectedDistrict)?.full_name,
                idWard: Number(selectedWard),
                ward,
                //ward: wards.find(w => w.id === selectedWard)?.full_name,
                isDefault,
                createdAt: new Date(),
                _id: address._id
            };
            const params = {userId: userId, addressId: address._id}

            const response = await updateAddressForUser (params, addressData)

            if (response.success) {
                toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                    Đã cập nhật địa chỉ nhận hàng
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
                onClose();
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


    return (
        <div className="container">
            <div className="d-flex justify-content-center align-items-center">
                <div className="w-100">
                    <h5 className="text-primary text-center h5">
                        <i className="fas fa-location-dot fa-2x mb-2" style={{ color: "#007bff" }}></i>
                        CHỈNH SỬA ĐỊA CHỈ NHẬN HÀNG
                    </h5>
                    <div className="card-body">
                        <div className="form-group row mb-3">
                            <label className="col-sm-6 col-form-label fw-bold">Họ và tên người nhận</label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => handleInputChange(e, "name")}
                                    className={`form-control ${errors.name ? "is-invalid" : ""} mb-1`}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-3">
                            <label className="col-sm-6 col-form-label fw-bold">Số điện thoại</label>
                            <div className="col-sm-6">
                                <input
                                    type="number"
                                    value={phone}
                                    onChange={(e) => handleInputChange(e, "phone")}
                                    className={`form-control ${errors.phone ? "is-invalid" : ""} mb-1`}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-3">
                            <label className="col-sm-6 col-form-label fw-bold">Tỉnh/Thành Phố</label>
                            <div className="col-sm-6">
                                <select
                                    className={`form-control ${errors.province ? "is-invalid" : ""} mb-1`}
                                    onChange={handleProvinceChange}
                                    value={selectedProvince}
                                >
                                    <option value="">Chọn Tỉnh Thành</option>
                                     {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.full_name}
                                        </option>
                                    ))} 
                                </select>
                                {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-3">
                            <label className="col-sm-6 col-form-label fw-bold">Quận/Huyện</label>
                            <div className="col-sm-6">
                                <select
                                    className={`form-control ${errors.district ? "is-invalid" : ""} mb-1`}
                                    onChange={handleDistrictChange}
                                    value={selectedDistrict}
                                    disabled={!selectedProvince}
                                >
                                     <option value="">Chọn Quận Huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.full_name}
                                        </option>
                                    ))} 
                                </select>
                                {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-3">
                            <label className="col-sm-6 col-form-label fw-bold">Phường/Xã</label>
                            <div className="col-sm-6">
                                <select
                                    className={`form-control ${errors.ward ? "is-invalid" : ""} mb-1`}
                                    onChange={handleWardChange}
                                    value={selectedWard}
                                    disabled={!selectedDistrict}
                                >
                                     <option value="">Chọn Phường Xã</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.id}>
                                            {ward.full_name}
                                        </option>
                                    ))} 
                                </select>
                                {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-3">
                            <label className="col-sm-6 col-form-label fw-bold">Địa chỉ nhà</label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    placeholder=" số 123 đường Nguyễn Văn A..."
                                    className={`form-control ${errors.street ? "is-invalid" : ""} mb-1`}
                                    value={street}
                                    onChange={(e) => handleInputChange(e, "street")}
                                />
                                {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-3">
                            <div className="form-check form-switch d-flex align-items-center">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="isDefault"
                                    onChange={(e) => handleInputChange(e, "isDefault")}
                                    checked={isDefault}
                                />
                                <label className="form-check-label ms-2 fw-bold" htmlFor="isDefault">
                                    Đặt mặc định
                                </label>
                            </div>
                        </div>

                        <div className="form-group row mb-3">
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Cập Nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default EditAddress;

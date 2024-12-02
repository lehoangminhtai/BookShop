import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { updateAddressForUser } from "../../services/addressService";

const EditAddress = ({ address, provinces, districts, wards, userId }) => {
    // State lưu trữ các thông tin cần thiết
    const [name, setName] = useState(address.name || "");
    const [phone, setPhone] = useState(address.phone || "");
    const [street, setStreet] = useState(address.street || "");
    const [selectedProvince, setSelectedProvince] = useState(address.idProvince || "");
    const [selectedDistrict, setSelectedDistrict] = useState(address.idDistrict || "");
    const [selectedWard, setSelectedWard] = useState(address.idWard || "");
    const [isDefault, setIsDefault] = useState(address.isDefault || false);
    const [errors, setErrors] = useState({})
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
                province: provinces.find(p => p.id === selectedProvince)?.full_name,
                idDistrict: Number(selectedDistrict),
                district: districts.find(d => d.id === selectedDistrict)?.full_name,
                idWard: Number(selectedWard),
                ward: wards.find(w => w.id === selectedWard)?.full_name,
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
                                    onChange={(e) => handleInputChange(e, "province")}
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
                                    onChange={(e) => handleInputChange(e, "district")}
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
                                    onChange={(e) => handleInputChange(e, "ward")}
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
            <ToastContainer/>
        </div>
    );
};

export default EditAddress;

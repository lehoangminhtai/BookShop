import React, { useState,useEffect } from "react";
import {  updateShipping} from "../../services/shippingService";
import { toast, ToastContainer } from "react-toastify";

const AdShippingEdit = ({ onClose, shippingData}) => {

    const {shippingId, areaNameE, shippingFeeE, provincesE} = shippingData

    const [areaName, setAreaName] = useState(areaNameE);
    const [shippingFee, setShippingFee] = useState(shippingFeeE);
    const [provinces, setProvinces] = useState(provincesE);

    
    const [errors, setErrors] = useState({});

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        const updatedErrors = { ...errors };

        if (value.trim() !== '') {
            delete updatedErrors[field];
        }
        setErrors(updatedErrors);

        if (field === "areaName") {
            setAreaName(value);
        }

        if (field === "shippingFee") {
            setShippingFee(value);
        }

    }

       const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!areaName) newErrors.areaName = 'Vui lòng nhập tên vùng';
        if (!shippingFee) {
            newErrors.shippingFee = 'Vui lòng nhập tiền vận chuyển hợp lệ';
        } else if (isNaN(shippingFee) || shippingFee <= 0) {
            newErrors.shippingFee = 'Tiền vận chuyển phải là số và lớn hơn 0';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return
        }
        try {
            const shippingData = { areaName: areaName, shippingFee: shippingFee, provinces: provinces }

            const response = await updateShipping(shippingId, shippingData);

            if (response.data.success) {
                toast.success('Cập nhật vùng vận chuyển thành công', {
                    autoClose: 1000,
                    onClose: () => {
                        // Đảm bảo đóng modal sau khi thông báo đã hoàn thành
                        onClose();
                    }
                })
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Lỗi hệ thống")
        }
    }

    const handleRemoveProvince = (provinceId) => {
        setProvinces((prevList) => prevList.filter((item) => item.provinceId !== provinceId));
        
    };

    return (
        <div className="d-flex align-items-center justify-content-center ">
            <div className="w-100">
                <div className="card-body">
                    <div className="d-flex justify-content-center">
                        <h3 className="h3">Cập Nhật Vùng</h3>
                    </div>
                    <div className="mb-5">
                        <label className="fw-bold form-label">
                            Tên Vùng Vận Chuyển <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.areaName ? 'is-invalid' : ''} `}
                            value={areaName}
                            onChange={(e) => handleInputChange(e, 'areaName')}
                        />
                        {errors.areaName && <div className="invalid-feedback">{errors.areaName}</div>}
                    </div>

                    <div className="mb-5">
                        <label className="fw-bold form-label">
                            Phí vận chuyển <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">VNĐ</span>
                            <input
                                type="number"
                                className={`form-control ${errors.shippingFee ? 'is-invalid' : ''} `}
                                value={shippingFee}
                                onChange={(e) => handleInputChange(e, 'shippingFee')}
                            />
                            {errors.shippingFee && <div className="invalid-feedback">{errors.shippingFee}</div>}
                        </div>
                    </div>
                    <div className="selected-provinces">
                                {provinces.map((province) => (
                                    <div key={province.provinceId} className=" d-flex justify-content-between align-items-center mb-3 p-2 border">
                                        <span className="fw-bold" style={{ color: "black" }}>{province.provinceName}</span>
                                        <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveProvince(province.provinceId)}
                                            >
                                                &times;
                                            </button>
                                    </div>
                                ))}
                            </div>
                    <div className="d-flex justify-content-center gap-2">

                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdShippingEdit
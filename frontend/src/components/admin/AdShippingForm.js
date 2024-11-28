import React, { useState } from "react";
import { createShipping } from "../../services/shippingService";
import { toast, ToastContainer } from "react-toastify";

const AdShippingForm = ({ onClose }) => {
    const [ areaName, setAreaName ] = useState();
    const [ shippingFee, setShippingFee ] = useState();
    const [provinces, setProvinces] = useState([])
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
            newErrors.areaName = 'Vui lòng nhập tiền vận chuyển';
        } else if (isNaN(shippingFee) || shippingFee <= 0) {
            newErrors.areaName = 'Tiền vận chuyển phải là số và lớn hơn 0';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return
        }     
        try {
            const shippingData = {areaName: areaName, shippingFee: shippingFee, provinces: []}

            const response = await createShipping(shippingData);

            if(response.data.success){
                toast.success('Thêm vùng vận chuyển thành công', {
                    autoClose: 1000,
                    onClose: () => {
                        // Đảm bảo đóng modal sau khi thông báo đã hoàn thành
                        onClose();
                    }
                })
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Lỗi hệ thống")
        }   
    }

    return (
        <div className="d-flex align-items-center justify-content-center ">
            <div className="w-100">
                <div className="card-body">
                    <div className="d-flex justify-content-center">
                        <h3 className="h3">Thêm Vùng</h3>
                    </div>
                    <div className="mb-5">
                        <label className="form-label">
                            Tên Vùng Vận Chuyển <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.areaName ? 'is-invalid' : ''} mb-1`}
                            value={areaName}
                            onChange={(e) => handleInputChange(e, 'areaName')}
                        />
                        {errors.areaName && <div className="invalid-feedback">{errors.areaName}</div>}
                    </div>

                    <div className="mb-5">
                        <label className="form-label">
                            Phí vận chuyển <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">VNĐ</span>
                            <input
                                type="number"
                                className={`form-control ${errors.shippingFee ? 'is-invalid' : ''} mb-1`}
                            value={shippingFee}
                            onChange={(e) => handleInputChange(e, 'shippingFee')}
                        />
                        {errors.shippingFee && <div className="invalid-feedback">{errors.shippingFee}</div>}
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-2">

                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default AdShippingForm
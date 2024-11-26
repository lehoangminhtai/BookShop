import React, { useState } from "react";
import { createDiscount } from "../../services/discountService";


const AdDiscountForm = () => {

    const currentDate = new Date().toISOString().split("T")[0];

    const currentTime = new Date().getTime();
    const currentD = new Date(currentTime);

    const hours = currentD.getHours().toString().padStart(2, '0');  // Thêm số 0 nếu giờ < 10
    const minutes = currentD.getMinutes().toString().padStart(2, '0');  // Thêm số 0 nếu phút < 10

    const formattedTime = `${hours}:${minutes}`;

    const [discountCode, setDiscountCode] = useState('');
    const [discountName, setDiscountName] = useState();
    const [discountDescription, setDiscountDescription] = useState("");
    const [percent, setPercent] = useState(null);
    const [amount, setAmount] = useState(null);
    const [maxAmountDiscount, setMaxAmountDiscount] = useState();
    const [minOfTotalPrice, setMinOfTotalPrice] = useState(0);
    const [maxUsage, setMaxUsage] = useState();
    const [usedBy, setUsedBy] = useState([]);
    const [dateStart, setDateStart] = useState();
    const [dateExpire, setDateExpire] = useState(null);
    const [discountFor, setDiscountFor] = useState(null);
    const [discountType, setDiscountType] = useState("percentage");

    const [isUnlimited, setIsUnlimited] = useState(false);
    const [isShowAll, setIsShowAll] = useState(false);
    const [isExpire, setIsExpire] = useState(false);
    const [dateS, setDateS] = useState(currentDate);
    const [dateE, setDateE] = useState();
    const [timeStart, setTimeStart] = useState(formattedTime);
    const [timeExpire, setTimeExpire] = useState(formattedTime);
 
    const [errors, setErrors] = useState({});


    const handleInputChange = (e, field) => {
        const value = e.target.value;
        const updatedErrors = { ...errors };

        if (value.trim() !== '') {
            delete updatedErrors[field];
        }

        
        if (field === "discountCode") {
            setDiscountCode(e.target.value.toUpperCase());
        }
        if (field === "discountName") {
            setDiscountName(value);
        }
        if (field === "discountDescription") {
            setDiscountDescription(value);
        }
        if (field === "discountNotLimited" && e.target.checked) {
            setIsUnlimited(true);
            setMaxUsage(null);
            delete updatedErrors['maxUsage'];
        }
        else {
            setIsUnlimited(false);
        }
        if (field === "maxUsage") {
            setMaxUsage(value);
            delete updatedErrors['maxUsage'];
        }

        if (field === "discountForCustomer" && e.target.checked) {
            setIsShowAll(true)
            setDiscountFor("customer")
        }
        else if (field === "discountForCustomer" && !e.target.checked) {
            setIsShowAll(false);
            setDiscountFor(null);
        }

        if (field === "discountType") {
            setDiscountType(value)
            delete updatedErrors['discountMaxAmount'];
            delete updatedErrors['discountValue'];
        }
        if (field === "discountValue") {
            if (discountType === "percentage") {
                setPercent(value);
                setAmount(null)

            }
            if (discountType === "amount") {
                setAmount(value)
                setPercent(null)
                setMaxAmountDiscount(null)
               
            }
        }
        if (field === "maxAmountDiscount") {
            setMaxAmountDiscount(value)
        }

        if (field === "minOfTotalPrice") {
            setMinOfTotalPrice(value)
        }

        if (field === "dateS") {
            setDateS(value)
        }
        if (field === "timeStart") {
            setTimeStart(value)
        }
        if (field === "dateE") {
            setDateE(value)
        }
        if (field === "timeExpire") {
            setTimeExpire(value)
        }

        if (field === "isExpire" && e.target.checked) {
            setIsExpire(true)
            setDateE('yyyy-mm-dd')
            setDateExpire(null);
        }
        else  if (field === "isExpire" && !e.target.checked) {
            setIsExpire(false)
            setDateE(null)
          
        }
        setErrors(updatedErrors);

    };

    const handleSubmit = async () => {
       

        const newErrors = {};
        setDateStart(`${dateS}T${timeStart}:00`)
        if (!discountCode) newErrors.discountCode = 'Vui lòng nhập mã giảm giá';
        if (!discountName) newErrors.discountName = 'Vui lòng nhập tên giảm giá';
        if (!discountDescription) newErrors.discountDescription = 'Mô tả gì đó về mã giảm này!';
        if(!isUnlimited){
            if(!maxUsage){
                newErrors.maxUsage = 'Vui lòng nhập số lượng giảm gía'
            }
        }
        if(discountType === 'percentage'){
            if(!percent){
                newErrors.discountValue = 'Vui lòng nhập phần trăm giảm'
            }
            else if(percent >100 || percent <0){
                 newErrors.discountValue = 'Giá trị phần trăm không hợp lệ (0 < n < 100)'
            }
        }
        else{
            if(!amount){
                newErrors.discountValue = 'Vui lòng nhập số tiền giảm'
            }
        }
        if(discountType !=='amount'){
            if(!maxAmountDiscount){
                newErrors.maxAmountDiscount = 'Vui lòng nhập mức tiền giảm tối đa'
            }
        }
        
       if(!isExpire){
            if(!dateE){
                newErrors.dateE = 'Vui lòng nhập ngày hết hạn hoặc chọn "Không thời hạn" cho mã bên dưới'
            }
            else{
                setDateExpire(`${dateE}T${timeExpire}:00`)
            }
       }
        setErrors(newErrors);
       

        if (Object.keys(newErrors).length > 0) {
           return
        }

        try {
            
        } catch (error) {
            
        }
       
    };

    // Định dạng tiền (nếu loại là VNĐ)
    const formatCurrency = (value) => {
        if (discountType === "VNĐ" && value) {
            return new Intl.NumberFormat('vi-VN').format(value);
        }
        return value;
    };


    return (
        <div className="">
            <div className="">
                <div className="card-body">
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-md-8">
                            <h5 className="mb-1">Tên Giảm Giá</h5>
                            <input
                                type="text"
                                className={`form-control ${errors.discountName ? 'is-invalid' : ''} mb-1`}
                                value={discountName}
                                onChange={(e) => handleInputChange(e, 'discountName')}
                            />
                           {errors.discountName && <div className="invalid-feedback">{errors.discountName}</div>}


                            <h5 className="mb-1 mt-2">Mã Giảm Giá</h5>
                            <input
                                type="text"
                                className={`form-control ${errors.discountCode ? 'is-invalid' : ''} mb-1`}
                                value={discountCode}
                                onChange={(e) => handleInputChange(e, 'discountCode')}
                            />
                             {errors.discountCode && <div className="invalid-feedback">{errors.discountCode}</div>}

                            <h5 className="mb-1 mt-2">Mô tả</h5>
                            <input
                                type="text"
                                className={`form-control ${errors.discountDescription ? 'is-invalid' : ''} mb-1`}
                                value={discountDescription}
                                onChange={(e) => handleInputChange(e, 'discountDescription')}
                            />
                            {errors.discountDescription && <div className="invalid-feedback">{errors.discountDescription}</div>}
                            <div className="form-check mb-2 mt-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="unlimitedCheck"
                                    checked={isUnlimited}
                                    onChange={(e) => handleInputChange(e, 'discountNotLimited')}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="unlimitedCheck"
                                >
                                    Không giới hạn số lượng mã
                                </label>
                            </div>
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="displayCheck"
                                    onChange={(e) => handleInputChange(e, 'discountForCustomer')}
                                    value={discountFor}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="displayCheck"
                                >
                                    Hiển thị trên trang thanh toán
                                </label>
                                <small className="text-muted d-block ms-4">
                                    Khách hàng có thể thấy mã lúc thanh toán
                                </small>
                            </div>

                            <h5 className="mb-1 mt-3">Số lượng mã</h5>
                            <input
                                type="number"
                                className={`form-control ${errors.maxUsage ? 'is-invalid' : ''} mb-1`}
                                onChange={(e) => handleInputChange(e, 'maxUsage')}
                                
                                value={isUnlimited ? '' : maxUsage}
                                disabled={isUnlimited}
                            />
                            {errors.maxUsage && <div className="invalid-feedback">{errors.maxUsage}</div>}

                            <h5 className="mb-1 mt-3">Loại mã giảm</h5>
                            <div className="input-group mb-3">
                                <select
                                    className="form-select"
                                    value={discountType}
                                    onChange={(e) => handleInputChange(e, 'discountType')}
                                >
                                    <option value="percentage">%</option>
                                    <option value="amount">VNĐ</option>
                                </select>
                                <input
                                    type="number"
                                    className={`form-control ${errors.discountValue ? 'is-invalid' : ''}  w-50`}
                                    placeholder={discountType === "percentage" ? "0 - 100" : "Nhập số tiền"}
                                    onChange={(e) => handleInputChange(e, 'discountValue')}
                                    value={discountType === "percentage" ? percent: amount}
                                />
                                {errors.discountValue && <div className="invalid-feedback">{errors.discountValue}</div>}
                                
                            </div>

                            <h5 className="mb-1 mt-3">Giảm tối đa (vnđ)</h5>
                            <input
                                type="number"
                                className={`form-control ${errors.maxAmountDiscount ? 'is-invalid' : ''} mb-1`}
                                value={maxAmountDiscount}
                                onChange={(e) => handleInputChange(e, 'maxAmountDiscount')}
                                disabled={discountType === "amount"}
                            />
                              {errors.maxAmountDiscount && <div className="invalid-feedback">{errors.maxAmountDiscount}</div>}

                            <h5 className="mb-1 mt-3">Đơn hàng tối thiểu (vnđ)</h5>
                            <input
                                type="number"
                                className="form-control"
                                value={minOfTotalPrice}
                                onChange={(e) => handleInputChange(e, 'minOfTotalPrice')}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="col-md-4">
                            <h5 className="mb-3">Thời hạn</h5>
                            <div className="mb-3">
                                <label className="form-label">Ngày bắt đầu</label>
                                <div className="input-group"
                                   
                                >
                                    <input
                                        type="date"
                                        className="form-control w-25"
                                        min={currentDate}
                                        value={dateS}
                                        onChange={(e) => handleInputChange(e, 'dateS')}

                                    />
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={timeStart}
                                        onChange={(e) => handleInputChange(e, 'timeStart')}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Ngày kết thúc</label>
                                <div className="input-group" 
                                    
                                >
                                    <input
                                        type="date"
                                        className={`form-control ${errors.dateE ? 'is-invalid' : ''} w-25`}
                                        min={currentDate}
                                        disabled ={isExpire}
                                        value={dateE}
                                        onChange={(e) => handleInputChange(e, 'dateE')}
                                        
                                    />
                                    <input
                                        type="time"
                                        className="form-control"
                                        disabled ={isExpire}
                                        value={timeExpire}
                                        onChange={(e) => handleInputChange(e, 'timeExpire')}
                                    />
                                     {errors.dateE && <div className="invalid-feedback">{errors.dateE}</div>}
                                </div>
                            </div>

                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="neverExpiredCheck"
                                    onChange={(e) => handleInputChange(e, 'isExpire')}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="neverExpiredCheck"
                                >
                                    Không thời hạn?
                                </label>
                            </div>

                            <button className="btn btn-primary w-100" onClick={handleSubmit}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDiscountForm;

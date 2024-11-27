import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

//service
import { updateDiscount } from "../../services/discountService";

const AdEditDiscount = ({ onClose, discountData }) => {
  const {
    discountId,
    discountCodeE,
    discountNameE,
    discountDescriptionE,
    percentE,
    amountE,
    maxAmountDiscountE,
    minOfTotalPriceE,
    maxUsageE,
    dateStartE,
    dateExpireE,
    discountTypeE,
    discountForE,
  } = discountData;

  const currentDate = new Date().toISOString().split("T")[0];

  const currentTime = new Date().getTime();
  const currentD = new Date(currentTime);

  const hours = currentD.getHours().toString().padStart(2, '0');  // Thêm số 0 nếu giờ < 10
  const minutes = currentD.getMinutes().toString().padStart(2, '0');  // Thêm số 0 nếu phút < 10

  const formattedTime = `${hours}:${minutes}`;

  // Initialize state with discountData values (if present)
  const [discountCode, setDiscountCode] = useState(discountCodeE || '');
  const [discountName, setDiscountName] = useState(discountNameE || '');
  const [discountDescription, setDiscountDescription] = useState(discountDescriptionE || "");
  const [percent, setPercent] = useState(percentE || null);
  const [amount, setAmount] = useState(amountE || null);
  const [maxAmountDiscount, setMaxAmountDiscount] = useState(maxAmountDiscountE || null);
  const [minOfTotalPrice, setMinOfTotalPrice] = useState(minOfTotalPriceE || 0);
  const [maxUsage, setMaxUsage] = useState(maxUsageE || null);
  const [usedBy, setUsedBy] = useState([]);
  const [dateStart, setDateStart] = useState(dateStartE || '');
  const [dateExpire, setDateExpire] = useState(dateExpireE || null);
  const [discountFor, setDiscountFor] = useState(discountForE || null);
  const [discountType, setDiscountType] = useState(discountTypeE || "percentage");

  const [isUnlimited, setIsUnlimited] = useState(false);
  const [isShowAll, setIsShowAll] = useState(true);
  const [isExpire, setIsExpire] = useState(false);
  const [dateS, setDateS] = useState(currentDate);
  const [dateE, setDateE] = useState('');
  const [timeStart, setTimeStart] = useState(formattedTime);
  const [timeExpire, setTimeExpire] = useState(formattedTime);

  const [errors, setErrors] = useState({});

  useEffect(() => {

    if (discountFor) {
      setIsShowAll(false);
    }
    if(!maxUsage){
        setIsUnlimited(true)
    }
  }, [discountFor, maxUsage]);

  //Chuyển sang ngày giờ
  useEffect(() => {
    if (dateStartE) {
      const dateStartObj = new Date(dateStartE);
      const dateStartFormatted = dateStartObj.toLocaleString('en-GB').split(", ");
      
      const dateStartParts = dateStartFormatted[0].split("/"); // [dd, mm, yyyy]
      const formattedDateStart = `${dateStartParts[2]}-${dateStartParts[1]}-${dateStartParts[0]}`; // yyyy-mm-dd
      setDateS(formattedDateStart); // Lấy phần ngày đã chuyển đổi sang định dạng yyyy-mm-dd
      
      const timeStart = dateStartFormatted[1].split(":").slice(0, 2).join(":"); // Giờ (hh:mm)
      setTimeStart(timeStart);
    }
  
    if (dateExpireE) {
      const dateExpireObj = new Date(dateExpireE);
      const dateExpireFormatted = dateExpireObj.toLocaleString('en-GB').split(", ");
      
      const dateExpireParts = dateExpireFormatted[0].split("/"); // [dd, mm, yyyy]
      const formattedDateExpire = `${dateExpireParts[2]}-${dateExpireParts[1]}-${dateExpireParts[0]}`; // yyyy-mm-dd
      setDateE(formattedDateExpire); // Lấy phần ngày đã chuyển đổi sang định dạng yyyy-mm-dd
      
      const timeExpire = dateExpireFormatted[1].split(":").slice(0, 2).join(":"); // Giờ (hh:mm)
      setTimeExpire(timeExpire);
    }
  }, [dateStartE, dateExpireE]);
  

  useEffect(() => {
    if (dateE) {
      const dateTimeExpire = new Date(`${dateE}T${timeExpire}:00`);
      const utcDateExpire = dateTimeExpire.toISOString(); // Convert to UTC
      setDateExpire(utcDateExpire);
    }
  }, [dateE, timeExpire]);

  useEffect(() => {
    if (dateS) {
      const dateTimeStart = new Date(`${dateS}T${timeStart}:00`);
      const utcDateStart = dateTimeStart.toISOString(); // Convert to UTC
      setDateStart(utcDateStart);
    }
  }, [dateS, timeStart]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const updatedErrors = { ...errors };

    if (value.trim() !== '') {
      delete updatedErrors[field];
    }

    switch (field) {
      case "discountCode":
        setDiscountCode(e.target.value.toUpperCase());
        break;
      case "discountName":
        setDiscountName(value);
        break;
      case "discountDescription":
        setDiscountDescription(value);
        break;
      case "discountNotLimited":
        if (e.target.checked) {
          setIsUnlimited(true);
          setMaxUsage(null);
          delete updatedErrors['maxUsage'];
        } else {
          setIsUnlimited(false);
        }
        break;
      case "maxUsage":
        setMaxUsage(value);
        delete updatedErrors['maxUsage'];
        break;
      case "discountForCustomer":
        if (e.target.checked) {
          setIsShowAll(false);
          setDiscountFor("customer");
        } else {
          setIsShowAll(true);
          setDiscountFor(null);
        }
        break;
      case "discountType":
        setDiscountType(value);
        delete updatedErrors['discountMaxAmount'];
        delete updatedErrors['discountValue'];
        break;
      case "discountValue":
        if (discountType === "percentage") {
          setPercent(value);
          setAmount(null);
        } else if (discountType === "amount") {
          setAmount(value);
          setPercent(null);
          setMaxAmountDiscount(null);
        }
        break;
      case "maxAmountDiscount":
        setMaxAmountDiscount(value);
        break;
      case "minOfTotalPrice":
        setMinOfTotalPrice(value);
        break;
      case "dateS":
        setDateS(value);
        break;
      case "timeStart":
        setTimeStart(value);
        break;
      case "dateE":
        setDateE(e.target.value);
        setDateExpire(`${dateE}T${timeExpire}:00`);
        break;
      case "timeExpire":
        setTimeExpire(value);
        break;
      case "isExpire":
        if (e.target.checked) {
          setIsExpire(true);
          setDateE('yyyy-mm-dd');
          setDateExpire(null);
        } else {
          setIsExpire(false);
          setDateE(null);
        }
        break;
      default:
        break;
    }

    setErrors(updatedErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    setDateStart(`${dateS}T${timeStart}:00`);
    if (!discountCode) newErrors.discountCode = 'Vui lòng nhập mã giảm giá';
    if (!discountName) newErrors.discountName = 'Vui lòng nhập tên giảm giá';
    if (!discountDescription) newErrors.discountDescription = 'Mô tả gì đó về mã giảm này!';
    if (!isUnlimited) {
      if (!maxUsage) {
        newErrors.maxUsage = 'Vui lòng nhập số lượng giảm gía';
      }
    }
    if (discountType === 'percentage') {
      if (!percent) {
        newErrors.discountValue = 'Vui lòng nhập phần trăm giảm';
      } else if (percent > 100 || percent < 0) {
        newErrors.discountValue = 'Giá trị phần trăm không hợp lệ (0 < n < 100)';
      }
    } else {
      if (!amount) {
        newErrors.discountValue = 'Vui lòng nhập số tiền giảm';
      }
    }
    if (discountType !== 'amount') {
      if (!maxAmountDiscount) {
        newErrors.maxAmountDiscount = 'Vui lòng nhập mức tiền giảm tối đa';
      }
    }

    if (!isExpire) {
      if (!dateE) {
        newErrors.dateE = 'Vui lòng nhập ngày hết hạn hoặc chọn "Không thời hạn" cho mã bên dưới';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const discountData = {
        discountCode,
        discountName,
        discountDescription,
        percent: Number(percent),  // Convert to Number
        amount,
        maxAmountDiscount: Number(maxAmountDiscount),  // Convert to Number
        minOfTotalPrice: Number(minOfTotalPrice),  // Convert to Number
        maxUsage,
        usedBy,
        dateStart,
        dateExpire,
        discountType,
        discountFor
      };

      console.log(discountData);
      const response = await updateDiscount(discountId,discountData);
      console.log(response);
      if (response.data.success) {
        toast.success('Cập nhật giảm giá thành công', {
          autoClose: 1000,
          onClose: () => {
            onClose();
          }
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Có lỗi trong lúc cập nhật mã giảm');
    }
  };

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
                                checked = {discountFor}
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
                                value={discountType === "percentage" ? percent : amount}
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
                                    disabled={isExpire}
                                    value={dateE}
                                    onChange={(e) => handleInputChange(e, 'dateE')}

                                />
                                <input
                                    type="time"
                                    className="form-control"
                                    disabled={isExpire}
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
        <ToastContainer/>
    </div>
  );
};

export default AdEditDiscount;

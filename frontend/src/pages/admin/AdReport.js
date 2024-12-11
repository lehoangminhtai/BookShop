import React, { useState } from "react";

const DatePicker = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFromDateChange = (e) => {
    const selectedDate = e.target.value;
    // Nếu ngày bắt đầu lớn hơn ngày kết thúc, đặt ngày kết thúc bằng ngày bắt đầu
    if (toDate && selectedDate > toDate) {
      setToDate(selectedDate);
    }
    setFromDate(selectedDate);
  };

  const handleToDateChange = (e) => {
    const selectedDate = e.target.value;
    // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, đặt ngày bắt đầu bằng ngày kết thúc
    if (fromDate && selectedDate < fromDate) {
      setFromDate(selectedDate);
    }
    setToDate(selectedDate);
  };

  return (
    <div className="d-flex align-items-center bg-light p-3 rounded shadow-sm">
      <div className="d-flex align-items-center me-4">
        <i className="fas fa-calendar-alt text-primary me-2"></i>
        <p className="mb-0 fw-bold">Từ</p>
      </div>
      <select
                        className="form-select w-auto border-primary text-primary fw-bold"
                        style={{ maxWidth: "200px" }}

                    >
                        <option value="today">Hôm nay</option>
                        <option value="week">7 ngày trước</option>
                        <option value="week">30 ngày trước</option>
                        <option value="month">Tháng này</option>
                        <option value="year">Năm này</option>
                    </select>
      <input
        type="date"
        className="form-control me-4 border-primary text-dark"
        style={{ maxWidth: "200px" }}
        value={fromDate}
        onChange={handleFromDateChange}
      />

      <div className="d-flex align-items-center me-4">
        <i className="fas fa-calendar-check text-success me-2"></i>
        <p className="mb-0 fw-bold">Đến</p>
      </div>
      <input
        type="date"
        className="form-control border-success text-dark"
        style={{ maxWidth: "200px" }}
        value={toDate}
        onChange={handleToDateChange}
      />
    </div>
  );
};

export default DatePicker;

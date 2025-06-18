import React, { useState, useEffect } from 'react';
import { getRevenueDetail } from '../../services/reportService';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';


const AdRevenueDetail = ({ title, type }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [range, setRange] = useState('7days')


  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');     // 01 -> 09
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const fetchRevenue = debounce( async () => {
    if (startDate > endDate) {
      toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return;
    }
    const data = { range, startDate, endDate }
    try {
      const response = await getRevenueDetail(data);
      console.log(response)
      setData(response.data)
      setTotal(response.totalRevenue)
    } catch (error) {
      toast.error('Lỗi hệ thống!')
    }
  },1000)

  useEffect(() => {
    if (range === 'custom') {
      if (startDate && endDate) {
        fetchRevenue();
      }
    }
    else fetchRevenue();
  }, [range, startDate, endDate])

  // Handle date range selection
  const handleDateRangeChange = (e) => {
    setRange(e.target.value);

  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // Simulate fetching data
  const fetchDataForListing = async () => {
    // const data = await fetchData(type, startDate, endDate);
    // setData(data.items);
    // setTotal(data.total);
  };

  // Handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDataForListing();
  };

  // Dynamically render table columns based on type
  const renderTableHeaders = () => {
    switch (type) {
      case 'revenue':
        return ['Ngày', 'Doanh Thu', 'Đơn Hàng'];
      case 'newUsers':
        return ['Ngày', 'Họ Tên', 'Email', 'SĐT'];
      case 'orders':
        return ['Mã đơn hàng', 'Khách hàng', 'Thành tiền', 'Trạng thái', 'Chi tiết'];
      case 'booksOrdered':
        return ['Tên', 'Giá', 'Số lượng'];
      default:
        return [];
    }
  };

  const renderTableRows = () => {
    return data.map((item, index) => {
      switch (type) {
        case 'revenue':
          return (
            <tr key={index}>
              <td>{formatDate(item.updatedAt)}</td>
              <td className=' text-danger fw-bold'>{formatCurrency(item.finalAmount)}</td>
              <td>
                <ul className="mb-0">
                  {item.itemsPayment.map((bookItem, idx) => (
                    <li key={idx}>
                      <div className='d-flex justify-content-between'>
                        <img src={bookItem.bookId?.images[0]} width={50}></img>
                        <span className=' text-primary fw-bold'>{formatCurrency(bookItem.price)}</span>
                      </div>

                      {bookItem.bookId?.title || 'Không rõ tên sách'}  <span className='text-danger'>x {bookItem.quantity}</span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          );
        case 'newUsers':
          return (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.newUsers}</td>
            </tr>
          );
        case 'orders':
          return (
            <tr key={index}>
              <td>{item.orderId}</td>
              <td>{item.customer}</td>
              <td>{item.amount}</td>
              <td>{item.status}</td>
            </tr>
          );
        case 'booksOrdered':
          return (
            <tr key={index}>
              <td>{item.bookId}</td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className='container'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{title}</h3>
        <div>
          <select className='form-select w-100' onChange={handleDateRangeChange} value={range}>
            <option value="7days">7 ngày trước</option>
            <option value="30days">30 ngày trước</option>
            <option value="custom">Tùy chọn</option>
          </select>
          {range === 'custom' && (
            <div className='d-flex mt-2 align-items-center'>
              <input type="date" value={startDate} onChange={handleStartDateChange} className='me-3 form-control' />
              <p className=''>đến</p>
              <input type="date" value={endDate} onChange={handleEndDateChange} className='ms-3 form-control' />
            </div>
          )}
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            {renderTableHeaders().map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>

      <div className="stats-footer">
        <h4 className='h4'>Tổng:<span className='text-danger'> {formatCurrency(total)}</span></h4>
      </div>
    </div>
  );
};

export default AdRevenueDetail;

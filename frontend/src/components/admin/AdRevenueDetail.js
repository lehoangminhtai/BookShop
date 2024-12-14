import React, { useState } from 'react';

const AdRevenueDetail = ({ title, type }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7'); // Default is 7 days
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  // Handle date range selection
  const handleDateRangeChange = (e) => {
    setSelectedPeriod(e.target.value);
    let start = '';
    let end = '';

    if (e.target.value === '7') {
      // 7 days before
      const currentDate = new Date();
      start = new Date(currentDate.setDate(currentDate.getDate() - 7)).toISOString().split('T')[0];
      end = new Date().toISOString().split('T')[0];
    } else if (e.target.value === '30') {
      // 30 days before
      const currentDate = new Date();
      start = new Date(currentDate.setDate(currentDate.getDate() - 30)).toISOString().split('T')[0];
      end = new Date().toISOString().split('T')[0];
    }

    setStartDate(start);
    setEndDate(end);
  };

  // Handle custom date range input
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
        return ['Ngày', 'Revenue', 'Orders'];
      case 'newUsers':
        return ['Ngày', 'Họ Tên','Email','SĐT'];
      case 'orders':
        return ['Mã đơn hàng', 'Khách hàng', 'Thành tiền', 'Trạng thái','Chi tiết'];
      case 'booksOrdered':
        return [ 'Tên', 'Giá' ,'Số lượng'];
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
              <td>{item.date}</td>
              <td>{item.revenue}</td>
              <td>{item.orders}</td>
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
          <select className='form-select w-100' onChange={handleDateRangeChange} value={selectedPeriod}>
            <option value="7">7 ngày trước</option>
            <option value="30">30 ngày trước</option>
            <option value="custom">Tùy chọn</option>
          </select>
          {selectedPeriod === 'custom' && (
            <div className='d-flex mt-2 align-items-center'>
              <input type="date" value={startDate} onChange={handleStartDateChange} className='me-3 form-control' />
              <p className=''>đến</p>
              <input type="date" value={endDate} onChange={handleEndDateChange} className='ms-3 form-control' />
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <button type="submit">Filter</button>
      </form>

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
        <p>Total: {total}</p>
      </div>
    </div>
  );
};

export default AdRevenueDetail;

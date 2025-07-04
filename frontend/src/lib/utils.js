export const formatDate = (date) => {
    if (!date) return ""; // Trả về chuỗi rỗng nếu không có giá trị
    const d = new Date(date); // Chuyển chuỗi ISO thành đối tượng Date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng < 10
    const day = String(d.getDate()).padStart(2, '0'); // Thêm số 0 nếu ngày < 10
    return `${year}-${month}-${day}`; // Trả về chuỗi theo định dạng YYYY-MM-DD
  };

  export const formatMessageTime = (date) => {
  const d = new Date(date);
  const now = new Date();

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    // Nếu là hôm nay → chỉ hiển thị giờ:phút
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else {
    // Nếu không phải hôm nay → hiển thị dd/mm/yyyy hh:mm
    const day  = d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,  
    });
    return `${day} ${time}`;
  }
};

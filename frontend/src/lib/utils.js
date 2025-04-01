export const formatDate = (date) => {
    if (!date) return ""; // Trả về chuỗi rỗng nếu không có giá trị
    const d = new Date(date); // Chuyển chuỗi ISO thành đối tượng Date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng < 10
    const day = String(d.getDate()).padStart(2, '0'); // Thêm số 0 nếu ngày < 10
    return `${year}-${month}-${day}`; // Trả về chuỗi theo định dạng YYYY-MM-DD
  };
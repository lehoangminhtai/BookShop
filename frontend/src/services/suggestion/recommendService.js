import axios from "axios";

const serverUrl =  "http://localhost:5050"; 
const API = axios.create({ baseURL: `${serverUrl}` });

export const recommendSer = async (userId) => {
    try {
        // Gửi userId dưới dạng JSON trong body của yêu cầu
        const response = await API.post('/recommend', { userId });

        // Nếu server trả về dữ liệu thành công
        return response.data;
    } catch (error) {
        console.error("Error handling book click:", error);

        // Kiểm tra chi tiết lỗi và hiển thị thông báo nếu cần
        if (error.response) {
            // Lỗi từ server, ví dụ như 500, 400...
            console.error("Response error:", error.response);
        } else if (error.request) {
            // Lỗi trong việc gửi yêu cầu (no response)
            console.error("Request error:", error.request);
        } else {
            // Lỗi khác (ví dụ lỗi cấu hình hoặc lỗi mạng)
            console.error("Error message:", error.message);
        }

        throw error;  // Ném lỗi ra ngoài để xử lý ở các nơi gọi hàm này
    }
}

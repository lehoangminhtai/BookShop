import axios from "axios"
import Cookie from 'js-cookie'

const API = axios.create({ baseURL: 'http://localhost:4000/api/bookSales' })
API.interceptors.request.use((req) => {
    const profile = JSON.parse(Cookie.get('profile'))                           // profile cookie get saved in browser during login
    if (profile) {
        const { tokens } = profile

        const authToken = tokens.filter(token => token.name == 'auth_token')[0]  // --> {name:String, token:String, _id:String}
        req.headers.auth_token = authToken.token

    }
    return req;
})

export const getBookSales = async (options = {}) => {
    try {
        const { page = 1, limit = 8 } = options;

        const response = await API.get('/', {
            params: {
                page: page,
                limit: limit
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Lỗi khi lấy sách đang bán. Mã trạng thái: ${response.status}`);
            throw new Error(`Lỗi khi lấy sách đang bán. Mã trạng thái: ${response.status}`);
        }

    } catch (error) {
        if (error.response) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' };
        } else if (error.request) {
            return { success: false, message: 'Không thể kết nối đến server' };
        } else {
            return { success: false, message: error.message };
        }
    }
};
export const getBookSale = async (bookId) => await API.get(`/${bookId}`)

export const getBookSalesNotAvailable = async (options = {}) => {
    try {
        const { page = 1, limit = 30 } = options;

        const response = await API.get('/not-available', {
            params: {
                page: page,
                limit: limit
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Lỗi khi lấy sách không có sẵn. Mã trạng thái: ${response.status}`);
            throw new Error(`Lỗi khi lấy sách không có sẵn. Mã trạng thái: ${response.status}`);
        }

    } catch (error) {
        if (error.response) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' };
        } else if (error.request) {
            return { success: false, message: 'Không thể kết nối đến server' };
        } else {
            return { success: false, message: error.message };
        }
    }
};
export const getBookSalesAdmin = async ({page, limit}) => {
    return await API.get(`/admin?page=${page}&limit=${limit}`)
}

export const getBookSaleByBookId = async (bookId) => API.get(`/${bookId}`)

export const searchBookSale = async (query, options = {}) => {
    try {
        const { page = 1, limit = 30 } = options; // Giá trị mặc định cho page và limit
        const response = await API.get(`/search`, {
            params: {
                title: query,
                page: page,       // Tham số trang
                limit: limit      // Tham số giới hạn số lượng kết quả
            }
        });

        // Kiểm tra status code để xử lý lỗi chính xác hơn
        if (response.status === 200) {
          return response.data;
        } else {
          console.error(`Lỗi tìm kiếm với status code ${response.status}`);
          throw new Error(`Lỗi tìm kiếm. Mã trạng thái: ${response.status}`);
        }

    } catch (error) {
        if (error.response) {
          // Xử lý lỗi từ phía server (ví dụ: 404, 500)
          return { success: false, message: error.response?.data?.message || 'Lỗi server' };
        } else if (error.request) {
          // Xử lý lỗi không nhận được phản hồi từ server (ví dụ: mất kết nối)
          return { success: false, message: 'Không thể kết nối đến server' };
        } else {
            // Lỗi khác (ví dụ: lỗi cấu hình)
            return { success: false, message: error.message };
        }
    }
};

export const updateBookSale = async (id,data) => await API.patch(`/${id}`,data)
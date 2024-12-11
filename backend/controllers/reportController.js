const Order = require('../models/orderModel')
const User = require('../models/userModel')
const BookSale = require('../models/bookSaleModel')

exports.calculateTodayRevenue = async (req,res) => {
    try {
        // Lấy ngày hiện tại, từ đầu ngày tới cuối ngày
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Đầu ngày (00:00)
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Cuối ngày (23:59)

        const orderRevenue = await Order.find({
            orderStatus: 'completed',
            updatedAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        const orders = await Order.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        const users = await User.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

        const bookSalesCount = await BookSale.countDocuments({
            status: 'available'
        })

        const totalRevenue = orderRevenue.reduce((sum, order) => sum + order.finalAmount, 0);

        return res.status(201).json({ totalRevenue, users: users.length, orders: orders.length, bookSalesCount});;
    } catch (error) {
        console.error('Lỗi khi tính toán doanh thu hôm nay:', error);
        throw error;
    }
};

exports.getOrderRevenueData = async (req, res) =>{
    try {
        // Lấy ngày hiện tại
        const today = new Date();

        // Tìm ngày đầu tuần (Chủ Nhật)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Tìm ngày cuối tuần (Thứ Bảy)
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);

        // Truy vấn các đơn hàng `completed` trong tuần
        const orders = await Order.find({
            orderStatus: 'completed',
            updatedAt: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            }
        });

        // Tạo mảng doanh thu theo ngày trong tuần (Chủ Nhật -> Thứ Bảy)
        const revenueByDay = Array(7).fill(0); // Khởi tạo mảng với 7 ngày, giá trị ban đầu là 0

        orders.forEach(order => {
            const orderDate = new Date(order.updatedAt);
            const dayIndex = orderDate.getDay(); // Trả về số ngày trong tuần (0: Chủ Nhật, 6: Thứ Bảy)
            revenueByDay[dayIndex] += order.finalAmount;
        });

        // Gửi kết quả về client
        res.status(200).json({
            revenueByDay, // Mảng doanh thu từ Chủ Nhật đến Thứ Bảy
            totalRevenue: revenueByDay.reduce((sum, revenue) => sum + revenue, 0) // Tổng doanh thu tuần
        });
    } catch (error) {
        console.error('Lỗi khi tính toán doanh thu tuần:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.calculateWeeklyUserRegistrations = async (req, res) => {
    try {
        // Lấy ngày hiện tại
        const today = new Date();

        // Tìm ngày đầu tuần (Chủ Nhật)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Tìm ngày cuối tuần (Thứ Bảy)
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);

        // Truy vấn các tài khoản được tạo trong tuần
        const users = await User.find({
            createdAt: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            }
        });

        // Tạo mảng số lượng tài khoản theo ngày trong tuần (Chủ Nhật -> Thứ Bảy)
        const userRegistrationsByDay = Array(7).fill(0); // Khởi tạo mảng với 7 ngày, giá trị ban đầu là 0

        users.forEach(user => {
            const userCreationDate = new Date(user.createdAt);
            const dayIndex = userCreationDate.getDay(); // Trả về số ngày trong tuần (0: Chủ Nhật, 6: Thứ Bảy)
            userRegistrationsByDay[dayIndex] += 1;
        });

        // Gửi kết quả về client
        res.json({
            userRegistrationsByDay, // Mảng số lượng tài khoản từ Chủ Nhật đến Thứ Bảy
            totalRegistrations: userRegistrationsByDay.reduce((sum, count) => sum + count, 0) // Tổng số tài khoản tuần
        });
    } catch (error) {
        console.error('Lỗi khi tính toán số lượng tài khoản tuần:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
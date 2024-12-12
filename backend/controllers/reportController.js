const Order = require('../models/orderModel')
const User = require('../models/userModel')
const BookSale = require('../models/bookSaleModel')
const moment = require('moment');

exports.calculateTodayRevenue = async (req, res) => {
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

        const quantitySale = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $unwind: "$itemsPayment" // Tách mảng `itemsPayment` thành từng đối tượng riêng
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$itemsPayment.quantity" }
                }
            }
        ]);

        const totalQuantity = quantitySale.length > 0 ? quantitySale[0].totalQuantity : 0;

        const bookSalesCount = await BookSale.countDocuments({
            status: 'available'
        })

        const totalRevenue = orderRevenue.reduce((sum, order) => sum + order.finalAmount, 0);

        return res.status(201).json({ totalRevenue, users: users.length, orders: orders.length, totalQuantity });;
    } catch (error) {
        console.error('Lỗi khi tính toán doanh thu hôm nay:', error);
        throw error;
    }
};

exports.getOrderRevenueData = async (req, res) => {
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

exports.getOrderCountData = async (req, res) => {
    try {
        // Lấy ngày hiện tại
        const today = new Date();

        // Xác định ngày đầu tuần (Chủ Nhật)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Xác định ngày cuối tuần (Thứ Bảy)
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);

        // Truy vấn tất cả các đơn hàng trong tuần
        const allOrders = await Order.find({
            createdAt: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            }
        });

        // Truy vấn các đơn hàng `completed` trong tuần
        const completedOrders = await Order.find({
            orderStatus: 'completed',
            updatedAt: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            }
        });

        // Tạo mảng số lượng đơn hàng theo ngày trong tuần (Chủ Nhật -> Thứ Bảy)
        const totalOrderCountByDay = Array(7).fill(0); // Tất cả đơn hàng
        const completedOrderCountByDay = Array(7).fill(0); // Đơn hàng hoàn thành

        // Duyệt qua tất cả đơn hàng và tăng số lượng cho ngày tương ứng
        allOrders.forEach(order => {
            const orderDate = new Date(order.updatedAt);
            const dayIndex = orderDate.getDay(); // Trả về số ngày trong tuần (0: Chủ Nhật, 6: Thứ Bảy)
            totalOrderCountByDay[dayIndex] += 1; // Tăng số lượng cho ngày
        });

        // Duyệt qua đơn hàng hoàn thành và tăng số lượng cho ngày tương ứng
        completedOrders.forEach(order => {
            const orderDate = new Date(order.updatedAt);
            const dayIndex = orderDate.getDay(); // Trả về số ngày trong tuần (0: Chủ Nhật, 6: Thứ Bảy)
            completedOrderCountByDay[dayIndex] += 1; // Tăng số lượng cho ngày
        });

        // Gửi kết quả về client
        res.status(200).json({
            totalOrders: {
                orderCountByDay: totalOrderCountByDay, // Mảng tất cả đơn hàng từ Chủ Nhật đến Thứ Bảy
                totalCount: totalOrderCountByDay.reduce((sum, count) => sum + count, 0) // Tổng tất cả đơn hàng trong tuần
            },
            completedOrders: {
                orderCountByDay: completedOrderCountByDay, // Mảng đơn hàng hoàn thành từ Chủ Nhật đến Thứ Bảy
                totalCount: completedOrderCountByDay.reduce((sum, count) => sum + count, 0) // Tổng đơn hàng hoàn thành trong tuần
            }
        });
    } catch (error) {
        console.error('Lỗi khi tính toán số lượng đơn hàng tuần:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.calculateRevenue = async (req, res) => {
    try {
        // Lấy giá trị "từ ngày" và "đến ngày" từ client (query params hoặc body)
        const { startDate, endDate } = req.query;

        // Kiểm tra nếu thiếu "startDate" hoặc "endDate"
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Vui lòng cung cấp ngày bắt đầu và ngày kết thúc." });
        }

        // Chuyển đổi chuỗi ngày sang đối tượng Date
        const startOfDay = new Date(startDate);
        const endOfDay = new Date(endDate);

        // Kiểm tra xem ngày bắt đầu có nhỏ hơn ngày kết thúc hay không
        if (startOfDay > endOfDay) {
            return res.status(400).json({ message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc." });
        }

        // Đảm bảo thời gian của startDate là đầu ngày và endDate là cuối ngày
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);

        // Tính doanh thu, số đơn hàng, người dùng, và tổng số lượng
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
        });

        const quantitySale = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $unwind: "$itemsPayment" // Tách mảng `itemsPayment` thành từng đối tượng riêng
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$itemsPayment.quantity" }
                }
            }
        ]);

        const totalQuantity = quantitySale.length > 0 ? quantitySale[0].totalQuantity : 0;

        const totalRevenue = orderRevenue.reduce((sum, order) => sum + order.finalAmount, 0);

        // Trả về kết quả
        return res.status(200).json({ totalRevenue, users: users.length, orders: orders.length, totalQuantity });
    } catch (error) {
        console.error('Lỗi khi tính toán doanh thu:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tính toán doanh thu.' });
    }
};

exports.getTopBooks = async (req, res) => {
    try {
        // Lấy ngày bắt đầu và kết thúc của tháng hiện tại
        const startOfMonth = moment().startOf('month').toDate(); // Ngày đầu tiên của tháng
        const endOfMonth = moment().endOf('month').toDate(); // Ngày cuối cùng của tháng
        //const {startOfMonth, endOfMonth}= req.query
        const topBooks = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                    orderStatus: 'completed'
                }
            },
            {
                $unwind: "$itemsPayment" // Tách các phần tử trong mảng `itemsPayment`
            },
            {
                $group: {
                    _id: "$itemsPayment.bookId", // Gom nhóm theo `bookId`
                    totalSold: { $sum: "$itemsPayment.quantity" } // Tính tổng `quantity`
                }
            },
            {
                $sort: { totalSold: -1 } // Sắp xếp giảm dần theo tổng số lượng bán
            },
            {
                $limit: 10 // Giới hạn chỉ lấy 10 kết quả
            },
            {
                $lookup: { // Liên kết với model Book để lấy thông tin sách
                    from: 'books', // Tên collection `books`
                    localField: '_id', // `_id` là `bookId`
                    foreignField: '_id', // `_id` trong model Book
                    as: 'bookDetails' // Tên trường chứa thông tin sách
                }
            },
            {
                $project: {
                    _id: 0, // Ẩn `_id`
                    bookId: "$_id", // Hiển thị `bookId`
                    totalSold: 1, // Hiển thị tổng số lượng bán
                    bookDetails: {
                        $let: {
                          vars: { book: { $arrayElemAt: ["$bookDetails", 0] } },
                          in: {
                            title: "$$book.title",
                            author: "$$book.author"
                          }
                        }
                      }                      
                      
                }
            }
        ]);

        res.status(200).json(topBooks);
    } catch (error) {
        console.error('Lỗi khi lấy top 10 sách bán chạy nhất:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};



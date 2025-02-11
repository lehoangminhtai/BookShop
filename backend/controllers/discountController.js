const Discount = require('../models/discountModel'); // Đường dẫn đúng với model của bạn
const { logAction } = require('../middleware/logMiddleware.js');
// Tạo mới mã giảm giá
exports.createDiscount = async (req, res) => {
    try {
        const { discountCode } = req.body;
        const userId = req.userId
        const existingDiscount = await Discount.findOne({ discountCode });

        if (existingDiscount) {
            return res.status(400).json({
                success: false,
                message: 'Mã Giảm Giá Đã Tồn Tại!'
            });
        }
        const discount = new Discount(req.body);
        if(await discount.save()){
            await logAction(
                'Thêm mã khuyến mãi',
                userId,
                `Quản trị viên ${userId} đã thêm mã khuyến mãi mới: ${discount.discountName}`,
                discount
              );
        }

        res.status(201).json({
            success: true,
            message: 'Discount created successfully',
            discount
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Lấy danh sách tất cả mã giảm giá
exports.getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find().sort({createdAt:-1}).populate('usedBy.userId')
        res.status(200).json({
            success: true,
            discounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy thông tin mã giảm giá theo ID
exports.getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            return res.status(404).json({
                success: false,
                message: 'Discount not found'
            });
        }
        res.status(200).json({
            success: true,
            discount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật mã giảm giá
exports.updateDiscount = async (req, res) => {
    const {discountId} = req.params
    const userId = req.userId
    try {

        const discount = await Discount.findByIdAndUpdate(discountId, req.body, {
            new: true,
            runValidators: true
        });
        if (!discount) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giảm giá'
            });
        }
        await logAction(
            'Cập nhật mã khuyến mãi',
            userId,
            `Quản trị viên ${userId} đã cập nhật mã khuyến mãi: ${discount.discountName}`,
            discount
          );
        res.status(200).json({
            success: true,
            message: 'Discount updated successfully',
            discount
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa mã giảm giá
exports.deleteDiscount = async (req, res) => {
    const {discountId} = req.params
    const userId = req.userId
    try {
        const discount = await Discount.findByIdAndDelete(discountId);
        if (!discount) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy mã giảm'
            });
        }
        await logAction(
            'Xóa mã khuyến mãi',
            userId,
            `Quản trị viên ${userId} đã xóa mã khuyến mãi: ${discount.discountName, discount.discountCode}`,
            
          );
        res.status(200).json({
            success: true,
            message: 'Xóa mã giảm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Áp dụng mã giảm giá
exports.applyDiscount = async (req, res) => {
    try {
        const { discountCode, userId, totalPrice } = req.body;
        const discount = await Discount.findOne({ discountCode });

        if (!discount) {
            return {
                success: false,
                message: 'Discount code not found'
            };
        }

        // Kiểm tra ngày bắt đầu và hết hạn
        const now = new Date();
        if (discount.dateStart > now || (discount.dateExpire && discount.dateExpire < now)) {
            return {
                success: false,
                message: 'Discount code is not valid for this time period'
            };
        }

        // Kiểm tra điều kiện giá trị tối thiểu
        if (totalPrice < discount.minOfTotalPrice) {
            return {
                success: false,
                message: `Minimum total price required is ${discount.minOfTotalPrice}`
            };
        }

        // Kiểm tra số lần sử dụng
        if (discount.maxUsage && discount.maxUsage > 0 && discount.usedBy.length >= discount.maxUsage) {
            return {
                success: false,
                message: 'Discount code usage limit reached'
            };
        }

        // Kiểm tra người dùng đã sử dụng mã chưa
        if (discount.usedBy.some(entry => entry.userId && entry.userId.toString() === userId.toString())) {
            return {
                success: false,
                message: 'You have already used this discount code'
            };
        }
        

        // Áp dụng giảm giá
        let discountAmount = 0;
        if (discount.discountType === 'percentage') {
            discountAmount = (totalPrice * discount.percent) / 100;
        } else if (discount.discountType === 'amount') {
            discountAmount = discount.amount;
        }

        // Đảm bảo không vượt quá mức giảm giá tối đa
        if (discount.discountType === 'percentage') {
            if(discount.maxAmountDiscount){
                discountAmount = Math.min(discountAmount, discount.maxAmountDiscount);
            }
       
        }

        // Ghi nhận người dùng đã sử dụng mã giảm giá
        await discount.incrementUsage(userId);

        return {
            success: true,
            discountAmount,
            discountCode: discount._id
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Lấy danh sách mã giảm giá có sẵn khi mua hàng
exports.getAvailableDiscounts = async (req, res) => {
    try {
        const { userId, totalPrice } = req.body;

        // Lấy danh sách tất cả các mã giảm giá
        const discounts = await Discount.find({
            dateStart: { $lte: new Date() },  // Mã giảm giá đã bắt đầu
            $or: [
                { dateExpire: { $gte: new Date() } },  // Mã giảm giá chưa hết hạn hoặc không có thời gian hết hạn
                { dateExpire: { $exists: false } }  // Mã giảm giá không có thời gian hết hạn
            ],
            minOfTotalPrice: { $lte: totalPrice }  // Mã giảm giá có thể áp dụng nếu tổng tiền lớn hơn hoặc bằng minOfTotalPrice
        });

        // Lọc ra các mã giảm giá chưa vượt quá số lần sử dụng và chưa được người dùng sử dụng
        const availableDiscounts = discounts.filter(discount => {
            // Kiểm tra số lần sử dụng chưa đạt giới hạn
            const usageLimitNotReached = discount.maxUsage === 0 || discount.usedBy.length < discount.maxUsage;

            // Kiểm tra người dùng chưa sử dụng mã giảm giá này
            const userHasNotUsed = !discount.usedBy.includes(userId);

            return usageLimitNotReached && userHasNotUsed;
        });

        // Nếu có mã giảm giá hợp lệ
        if (availableDiscounts.length > 0) {
            return res.status(200).json({
                success: true,
                availableDiscounts
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No available discounts for this user or order'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getUnavailableDiscounts = async (req, res) => {
    try {
        const { userId, totalPrice } = req.body;

        // Lấy tất cả các mã giảm giá còn hiệu lực (chưa hết hạn và trong thời gian áp dụng)
        const discounts = await Discount.find({
            dateStart: { $lte: new Date() },  // Mã giảm giá đã bắt đầu
            $or: [
                { dateExpire: { $gte: new Date() } },  // Mã giảm giá chưa hết hạn
                { dateExpire: { $exists: false } }  // Mã giảm giá không có thời gian hết hạn
            ]
        });

        // Lọc ra những mã giảm giá không thể sử dụng bởi người dùng
        const unavailableDiscounts = discounts.map(discount => {
            // Kiểm tra nếu người dùng đã sử dụng mã giảm giá này
            const userHasUsed = discount.usedBy.includes(userId);
            if (userHasUsed) {
                return {
                    discountCode: discount.discountCode,
                    discountName: discount.discountName,
                    reason: 'You have already used this discount code.'
                };
            }

            // Kiểm tra nếu tổng giá trị đơn hàng nhỏ hơn điều kiện tối thiểu
            if (discount.minOfTotalPrice && totalPrice < discount.minOfTotalPrice) {
                return {
                    discountCode: discount.discountCode,
                    discountName: discount.discountName,
                    reason: `Minimum order value of ${discount.minOfTotalPrice} is required.`
                };
            }

            // Kiểm tra nếu số lần sử dụng mã giảm giá đã đạt giới hạn
            if (discount.maxUsage > 0 && discount.usedBy.length >= discount.maxUsage) {
                return {
                    discountCode: discount.discountCode,
                    discountName: discount.discountName,
                    reason: 'Discount code usage limit reached.'
                };
            }

            // Nếu không có lý do gì, mã giảm giá có thể sử dụng được
            return null;
        }).filter(discount => discount !== null);  // Lọc bỏ các mã giảm giá có thể sử dụng

        // Trả về các mã giảm giá không thể sử dụng và lý do
        if (unavailableDiscounts.length > 0) {
            return res.status(200).json({
                success: true,
                unavailableDiscounts
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No unavailable discounts found.'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getDiscountsForUser = async (req,res) =>{
    try {
       
        const {userId} = req.body
        // Điều kiện lọc
        const now = new Date();
        const filterConditions = {
            $or: [
                { maxUsage: { $eq: null } },  // Không có giới hạn maxUsage
                {
                    $expr: {
                        $gt: [
                            { $size: "$usedBy" },  // Lấy số lượng phần tử trong mảng 'usedBy'
                            "$maxUsage"  // So sánh với 'maxUsage'
                        ]
                    }
                }
            ],
            $or: [
                { dateExpire: { $gt: now } }, // dateExpire lớn hơn hiện tại
                { dateExpire: { $eq: null } }  // dateExpire là null
            ],
            dateStart: { $lte: now } ,
            discountFor: null , // discountFor là null
           "usedBy._id": { $ne: userId }
        };

        // Truy vấn với điều kiện lọc, phân trang, sắp xếp theo ngày mới nhất
        const discounts = await Discount.find(filterConditions)
            .sort({ createdAt: -1 }) // Sắp xếp mới nhất
            

        res.status(200).json({
            success:true,
            discounts
            
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách mã giảm giá', error: error.message });
    }
}

exports.searchDiscountsForUser = async (req,res) =>{
    try {
       
        const {userId,discountCode} = req.body
        // Điều kiện lọc
        const now = new Date();
        const filterConditions = {
            $or: [
                { maxUsage: { $eq: null } },  // Không có giới hạn maxUsage
                {
                    $expr: {
                        $gt: [
                            { $size: "$usedBy" },  // Lấy số lượng phần tử trong mảng 'usedBy'
                            "$maxUsage"  // So sánh với 'maxUsage'
                        ]
                    }
                }
            ],
            $or: [
                { dateExpire: { $gt: now } }, // dateExpire lớn hơn hiện tại
                { dateExpire: { $eq: null } }  // dateExpire là null
            ],
            dateStart: { $lte: now } ,
            discountCode: discountCode , // discountFor là null
           "usedBy._id": { $ne: userId }
        };

        // Truy vấn với điều kiện lọc, phân trang, sắp xếp theo ngày mới nhất
        const discount = await Discount.findOne(filterConditions)
            .sort({ createdAt: -1 }) // Sắp xếp mới nhất
            
        if(discount){
            res.status(200).json({
                success:true,
                discount
                
            });
        }
        else{
            res.status(500).json({
                success:false,
               message: `Mã ${discountCode} không hợp lệ`
            });
        }
       
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách mã giảm giá', error: error.message });
    }
}
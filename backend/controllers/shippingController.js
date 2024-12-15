const Shipping = require('../models/shippingModel');
const { logAction } = require('../middleware/logMiddleware.js');

exports.createShipping = async (req, res) => {
    try {
        const { shippingFee, areaName } = req.body;
        const userId = req.userId
        let shipping = await Shipping.findOne({ areaName, shippingFee });
        if (shipping) {
            return res.status(400).json({
                success: false,
                message: 'Đã tồn tại vùng vận chuyển tương tự',

            });
        }

        shipping = new Shipping(req.body)
        if (await shipping.save()) {
            await logAction(
                'Thêm vùng vận chuyển',
                userId,
                `Quản trị viên ${userId} đã thêm vùng vận chuyển mới: ${areaName}`,
                shipping
            );
        }

        res.status(201).json({
            success: true,
            message: 'Tạo vùng vận chuyển thành công',
            shipping
        });


    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
// Thêm một tỉnh vào phí vận chuyển
exports.addProvinceToShipping = async (req, res) => {
    try {
        const { provinceId, provinceName, shippingFee, areaName } = req.body;

        const existingProvince = await Shipping.findOne({ "provinces.provinceId": provinceId });
        if (existingProvince) {
            return res.status(400).json({ success: false, message: provinceName + ' đã có phí vận chuyển là: ' + existingProvince.shippingFee });
        }

        // Tìm hoặc tạo mới một document với shippingFee
        let shipping = await Shipping.findOne({ areaName, shippingFee });
        if (!shipping) {
            shipping = new Shipping({ areaName, shippingFee, provinces: [] });
        }

        // Thêm tỉnh vào danh sách provinces
        shipping.provinces.push({ provinceId, provinceName });
        if (await shipping.save()) {
            const userId = req.userId
            await logAction(
                'Thêm tỉnh vào vùng vận chuyển',
                userId,
                `Quản trị viên ${userId} đã thêm tỉnh ${provinceName} vào vùng vận chuyển: ${areaName}`,
                shipping
            );
        }


        res.status(201).json({ success: true, message: provinceName + ' đã được thêm vào phí vận chuyển', shipping });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi thêm phí vận chuyển', error });
    }
};

// Cập nhật phí vận chuyển của một tỉnh
exports.updateProvinceShipping = async (req, res) => {
    try {
        const { provinceId, provinceName, newShippingFee, areaName } = req.body;

        const shipping = await Shipping.findOne({ "provinces.provinceId": provinceId });

        if (!shipping) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tỉnh này trong phí vận chuyển nào' });
        }

        // Xóa tỉnh từ phí vận chuyển hiện tại
        shipping.provinces = shipping.provinces.filter(province => province.provinceName !== provinceName);

        // Lưu lại shipping sau khi xóa
        const updatedShipping = await shipping.save();  // Đảm bảo lưu sau khi thay đổi

        // Tìm hoặc tạo document với newShippingFee
        let newShipping = await Shipping.findOne({ shippingFee: newShippingFee, areaName: areaName });
        if (!newShipping) {
            newShipping = new Shipping({ shippingFee: newShippingFee, areaName: areaName, provinces: [] });
        }

        // Kiểm tra trùng lặp khi thêm vào phí vận chuyển mới
        const alreadyInNewShipping = newShipping.provinces.some(province => province.provinceId === provinceId);
        if (!alreadyInNewShipping) {
            newShipping.provinces.push({ provinceId, provinceName });
            if(await newShipping.save())
            {
                const userId = req.userId
                await logAction(
                    'Cập nhật phí vận chuyển của tỉnh',
                    userId,
                    `Quản trị viên ${userId} đã cập nhật phí vận chuyển tỉnh ${provinceName} thành ${newShipping.shippingFee} vào vùng vận chuyển: ${areaName}`,
                    newShipping
                );
            }
        } else {
            return res.status(409).json({ success: false, message: 'Tỉnh này đã tồn tại trong phí vận chuyển mới' });
        }

        res.status(200).json({
            success: true,
            message: 'Phí vận chuyển của tỉnh đã được cập nhật thành công',
            updatedShipping,
            newShipping,
        });
    } catch (error) {
        console.error('Error updating province shipping:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật phí vận chuyển', error });
    }
};

exports.updateShipping = async (req, res) => {

    try {
        const { shippingId } = req.params;
        const { areaName, shippingFee, provinces } = req.body;
        const updateData = { areaName, shippingFee, provinces }
        const updatedShipping = await Shipping.findByIdAndUpdate(
            shippingId,
            updateData,
            { new: true }
        );

        if (!updatedShipping) {
            return res.status(404).json({ success: false, message: "Không tìm thấy mã vận chuyển" })
        }
        const userId = req.userId
        await logAction(
            'Cập nhật vùng vận chuyển',
            userId,
            `Quản trị viên ${userId} đã cập nhật vùng vận chuyển: ${areaName}`,
            updatedShipping
        );
        return res.status(200).json({ success: true, message: "Cập nhật khu vực vận chuyển thành công" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi hệ thống" })

    }
}

// Lấy danh sách tất cả các phí vận chuyển
exports.getAllShippingFees = async (req, res) => {
    try {
        const shippingFees = await Shipping.find();
        res.status(200).json({ success: true, shippingFees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách phí vận chuyển', error });
    }
};

// Tìm kiếm phí vận chuyển theo provinceId
exports.getShippingFeeByProvinceId = async (req, res) => {
    try {
        const { provinceId } = req.params;

        // Tìm kiếm trong tất cả các tỉnh có matching provinceId
        const shipping = await Shipping.findOne({
            'provinces.provinceId': provinceId
        });

        // Nếu không tìm thấy, trả về lỗi
        if (!shipping) {
            return res.status(404).json({ success: false, message: 'Province not found or shipping fee not set for this province.' });
        }

        // Tìm province trong provinces array
        const province = shipping.provinces.find(p => p.provinceId === parseInt(provinceId));

        // Trả về phí vận chuyển
        res.status(200).json({
            success: true,
            provinceName: province.provinceName,
            shippingFee: shipping.shippingFee
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Xóa một tỉnh khỏi phí vận chuyển
exports.deleteProvinceFromShipping = async (req, res) => {
    try {
        const { provinceId } = req.params;

        // Tìm phí vận chuyển chứa provinceId
        const shipping = await Shipping.findOne({ "provinces.provinceId": provinceId });
        if (!shipping) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tỉnh này trong phí vận chuyển nào' });
        }

        // Xóa tỉnh khỏi phí vận chuyển
        shipping.provinces = shipping.provinces.filter(province => province.provinceId !== parseInt(provinceId));
        if(await shipping.save()){
            const userId = req.userId
            await logAction(
                'Xóa tỉnh khỏi vùng vận chuyển',
                userId,
                `Quản trị viên ${userId} đã xóa tỉnh ${provinceId} khỏi vùng vận chuyển: ${areaName}`,
                shipping
            );
        }


        res.status(200).json({ success: true, message: 'Tỉnh đã được xóa khỏi phí vận chuyển', shipping });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi xóa tỉnh khỏi phí vận chuyển', error });
    }
};

exports.deleteShipping = async (req, res) => {
    try {
        const { shippingId } = req.params;
        if (shippingId) {
            const deletedShipping = await Shipping.findByIdAndDelete(shippingId);

            if (!deletedShipping) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy phí vận chuyển cần xóa' });
            }
            const userId = req.userId
            await logAction(
                'Xóa vùng vận chuyển',
                userId,
                `Quản trị viên ${userId} đã xóa vùng vận chuyển: ${deletedShipping.areaName}`
            );

            res.status(200).json({
                success: true,
                message: 'Phí vận chuyển đã được xóa thành công',
                deletedShipping
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa phí vận chuyển',
            error
        });
    }
}

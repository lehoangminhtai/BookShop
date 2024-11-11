const Shipping = require('../models/shippingModel');

// Thêm một tỉnh vào phí vận chuyển
exports.addProvinceToShipping = async (req, res) => {
    try {
        const { provinceId, provinceName, shippingFee } = req.body;

        const existingProvince = await Shipping.findOne({ "provinces.provinceId": provinceId });
        if (existingProvince) {
            return res.status(400).json({ message: 'Province ID đã tồn tại trong một phí vận chuyển khác' });
        }

        // Tìm hoặc tạo mới một document với shippingFee
        let shipping = await Shipping.findOne({ shippingFee });
        if (!shipping) {
            shipping = new Shipping({ shippingFee, provinces: [] });
        }

        // Thêm tỉnh vào danh sách provinces
        shipping.provinces.push({ provinceId, provinceName });
        await shipping.save();

        res.status(201).json({ message: 'Tỉnh đã được thêm vào phí vận chuyển', shipping });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm phí vận chuyển', error });
    }
};

// Cập nhật phí vận chuyển của một tỉnh
exports.updateProvinceShipping = async (req, res) => {
    try {
        const { provinceId, newShippingFee } = req.body;

        // Tìm phí vận chuyển chứa provinceId
        const shipping = await Shipping.findOne({ "provinces.provinceId": provinceId });
        if (!shipping) {
            return res.status(404).json({ message: 'Không tìm thấy tỉnh này trong phí vận chuyển nào' });
        }

        // Xóa tỉnh từ phí vận chuyển hiện tại
        shipping.provinces = shipping.provinces.filter(province => province.provinceId !== provinceId);
        await shipping.save();

        // Tìm hoặc tạo document với newShippingFee
        let newShipping = await Shipping.findOne({ shippingFee: newShippingFee });
        if (!newShipping) {
            newShipping = new Shipping({ shippingFee: newShippingFee, provinces: [] });
        }

        // Thêm tỉnh vào phí vận chuyển mới
        newShipping.provinces.push({ provinceId, provinceName: shipping.provinces.find(p => p.provinceId === provinceId).provinceName });
        await newShipping.save();

        res.status(200).json({ message: 'Phí vận chuyển của tỉnh đã được cập nhật', newShipping });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật phí vận chuyển', error });
    }
};

// Lấy danh sách tất cả các phí vận chuyển
exports.getAllShippingFees = async (req, res) => {
    try {
        const shippingFees = await Shipping.find();
        res.status(200).json(shippingFees);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phí vận chuyển', error });
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
            return res.status(404).json({ message: 'Province not found or shipping fee not set for this province.' });
        }

        // Tìm province trong provinces array
        const province = shipping.provinces.find(p => p.provinceId === parseInt(provinceId));

        // Trả về phí vận chuyển
        res.status(200).json({
            provinceName: province.provinceName,
            shippingFee: shipping.shippingFee
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Xóa một tỉnh khỏi phí vận chuyển
exports.deleteProvinceFromShipping = async (req, res) => {
    try {
        const { provinceId } = req.params;

        // Tìm phí vận chuyển chứa provinceId
        const shipping = await Shipping.findOne({ "provinces.provinceId": provinceId });
        if (!shipping) {
            return res.status(404).json({ message: 'Không tìm thấy tỉnh này trong phí vận chuyển nào' });
        }

        // Xóa tỉnh khỏi phí vận chuyển
        shipping.provinces = shipping.provinces.filter(province => province.provinceId !== parseInt(provinceId));
        await shipping.save();

        res.status(200).json({ message: 'Tỉnh đã được xóa khỏi phí vận chuyển', shipping });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tỉnh khỏi phí vận chuyển', error });
    }
};

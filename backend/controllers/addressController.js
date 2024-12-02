const Address = require('../models/addressModel');
const User = require('../models/userModel');

exports.addAddress = async (req, res) => {
    const { userId } = req.params;
    const newAddress = req.body;
    if (!newAddress.name) {
        return res.status(400).json({ success: false, message: 'Tên là bắt buộc' });
    }
    if (!newAddress.phone) {
        return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc' });
    }
    if (!newAddress.street) {
        return res.status(400).json({ success: false, message: 'Địa chỉ là bắt buộc' });
    }
    if (!newAddress.idWard || typeof newAddress.idWard !== 'number') {
        return res.status(400).json({ success: false, message: 'ID Phường phải là số' });
    }
    if (!newAddress.ward) {
        return res.status(400).json({ success: false, message: 'Tên Phường là bắt buộc' });
    }
    if (!newAddress.idDistrict || typeof newAddress.idDistrict !== 'number') {
        return res.status(400).json({ success: false, message: 'ID Quận/Huyện phải là số' });
    }
    if (!newAddress.district) {
        return res.status(400).json({ success: false, message: 'Tên Quận/Huyện là bắt buộc' });
    }
    if (!newAddress.idProvince || typeof newAddress.idProvince !== 'number') {
        return res.status(400).json({ success: false, message: 'ID Tỉnh/Thành phố phải là số' });
    }
    if (!newAddress.province) {
        return res.status(400).json({ success: false, message: 'Tên Tỉnh/Thành phố là bắt buộc' });
    }

    // Kiểm tra độ dài số điện thoại (ví dụ: từ 10 đến 15 ký tự)
    if (newAddress.phone.length < 10 || newAddress.phone.length > 15) {
        return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
    }
    if (newAddress.name.length < 2 || newAddress.name.length > 50) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập tên hợp lệ' });
    }
    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        const address = await Address.findOne({ userId });
        if (address) {
            if (newAddress.isDefault) {
                address.addresses.forEach(addr => {
                    addr.isDefault = false;
                });
            }
            address.addresses.push(newAddress);
            await address.save();
            return res.status(200).json({ success: true, message: 'Đã thêm địa chỉ mới', address });
        }
        const newAddressModel = new Address({
            userId,
            addresses: [newAddress]
        });

        await newAddressModel.save();
        res.status(201).json({ success: true, message: 'Đã thêm địa chỉ mới', address: newAddressModel });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// 2. Lấy tất cả địa chỉ của người dùng (Read)
exports.getAllAddresses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Tìm tất cả địa chỉ của người dùng
        const addresses = await Address.findOne({ userId }).sort({ createdAt: -1 });
        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

if (addresses && addresses.addresses) {
    // Sắp xếp mảng `addresses` theo trường `createdAt` của từng địa chỉ
    addresses.addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

        res.status(200).json({ success: true, addresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Cập nhật địa chỉ của người dùng (Update)
exports.updateAddress = async (req, res) => {
    const { userId, addressId } = req.params;
    const updatedAddress = req.body;
    if (!updatedAddress.name) {
        return res.status(400).json({ success: false, message: 'Tên là bắt buộc' });
    }
    if (!updatedAddress.phone) {
        return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc' });
    }
    if (!updatedAddress.street) {
        return res.status(400).json({ success: false, message: 'Địa chỉ là bắt buộc' });
    }
    if (!updatedAddress.idWard || typeof updatedAddress.idWard !== 'number') {
        return res.status(400).json({ success: false, message: 'ID Phường phải là số' });
    }
    if (!updatedAddress.ward) {
        return res.status(400).json({ success: false, message: 'Tên Phường là bắt buộc' });
    }
    if (!updatedAddress.idDistrict || typeof updatedAddress.idDistrict !== 'number') {
        return res.status(400).json({ success: false, message: 'ID Quận/Huyện phải là số' });
    }
    if (!updatedAddress.district) {
        return res.status(400).json({ success: false, message: 'Tên Quận/Huyện là bắt buộc' });
    }
    if (!updatedAddress.idProvince || typeof updatedAddress.idProvince !== 'number') {
        return res.status(400).json({ success: false, message: 'ID Tỉnh/Thành phố phải là số' });
    }
    if (!updatedAddress.province) {
        return res.status(400).json({ success: false, message: 'Tên Tỉnh/Thành phố là bắt buộc' });
    }

    // Kiểm tra độ dài số điện thoại (ví dụ: từ 10 đến 15 ký tự)
    if (updatedAddress.phone.length < 10 || updatedAddress.phone.length > 15) {
        return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
    }
    if (updatedAddress.name.length < 2 || updatedAddress.name.length > 50) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập tên hợp lệ' });
    }
    try {
        if (updatedAddress.isDefault) {
            const addressDoc = await Address.findOne({ userId });

            addressDoc.addresses.forEach(address => {
                if (address._id.toString() !== addressId.toString()) {
                    address.isDefault = false;
                }
            });
            await addressDoc.save();
        }

        const address = await Address.findOneAndUpdate(
            { userId, 'addresses._id': addressId }, // Tìm địa chỉ theo userId và addressId
            {  $set: {
                'addresses.$': updatedAddress, // Cập nhật địa chỉ có ID là addressId
            } },
            { new: true } // Trả về tài liệu đã cập nhật
        );

        if (!address) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ, cập nhật thất bại' });
        }


        res.status(200).json({ success: true, address: address }); // Trả về địa chỉ đã cập nhật
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};


// 4. Xóa địa chỉ của người dùng (Delete)
exports.deleteAddress = async (req, res) => {
    const { userId, addressId } = req.params;

    try {
        // Tìm người dùng và địa chỉ cần xóa
        const address = await Address.findOne({ userId, 'addresses._id': addressId });
        if (!address) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ để xóa' });
        }

        // Xóa địa chỉ khỏi mảng 'addresses'
        const addressIndex = address.addresses.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
        }

        address.addresses.splice(addressIndex, 1); // Xóa địa chỉ khỏi mảng
        await address.save();

        res.status(200).json({ success: true, message: 'Đã xóa địa chỉ' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

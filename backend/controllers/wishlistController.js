const Wishlist = require('../models/wishListModel');

// GET: Lấy wishlist theo userId
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId })
        if (!wishlist) {
            return res.status(200).json({success:false, message: 'Người dùng chưa thêm' });
        }
        res.status(200).json({success: true, data: wishlist});
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy wishlist' });
    }
};

// POST: Thêm sách vào wishlist
const addToWishlist = async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({
                userId,
                items: [{ bookId }]
            });
        } else {
            const alreadyExists = wishlist.items.some(
                item => item.bookId.toString() === bookId
            );

            if (!alreadyExists) {
                wishlist.items.push({ bookId });
            }
            else {
                wishlist.items = wishlist.items.filter(
                    item => item.bookId.toString() !== bookId
                );
            }
        }

        await wishlist.save();
        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server khi thêm sách' });
        console.error('Error adding to wishlist:', error);
    }
};

// POST: Xóa sách khỏi wishlist
const removeFromWishlist = async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Không tìm thấy wishlist' });
        }

        wishlist.items = wishlist.items.filter(
            item => item.bookId.toString() !== bookId
        );

        await wishlist.save();
        res.status(200).json({success: true, data:wishlist});
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa sách' });
    }
};

// DELETE: Xóa toàn bộ wishlist của người dùng
const deleteWishlist = async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ userId: req.params.userId });
        res.status(200).json({ message: 'Wishlist đã được xoá' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xoá wishlist' });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    deleteWishlist
};

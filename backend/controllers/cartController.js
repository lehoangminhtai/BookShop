const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const CartItem = require('../models/cartModel');  // Model CartItem đã được định nghĩa trong cartModel

// Tạo mới giỏ hàng cho người dùng
const createCart = async (req, res) => {
    const { userId } = req.body;  // Lấy userId từ request body

    try {
        // Kiểm tra xem người dùng đã có giỏ hàng chưa
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Nếu không có, tạo giỏ hàng mới
            cart = new Cart({ userId, cartItems: [] });
            await cart.save();
        }

        res.status(201).json({
            success: true,
            message: 'Giỏ hàng đã được tạo',
            cart
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy giỏ hàng của người dùng
const getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate('cartItems.bookId');
        
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const { userId, bookId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng của người dùng' });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        let cartItem = cart.cartItems.find(item => item.bookId.toString() === bookId);

        if (cartItem) {
            // Nếu có, cập nhật số lượng
            cartItem.quantity += quantity;
        } else {
            // Nếu không có, thêm mới vào giỏ hàng
            const newCartItem = new CartItem({
                bookId,
                quantity
            });
            cart.cartItems.push(newCartItem);
        }

        // Lưu lại giỏ hàng
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Sản phẩm đã được thêm vào giỏ hàng',
            cart
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
    const { userId, bookId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng của người dùng' });
        }

        // Kiểm tra xem sản phẩm có trong giỏ hàng không
        const cartItem = cart.cartItems.find(item => item.bookId.toString() === bookId);

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        // Cập nhật số lượng sản phẩm
        cartItem.quantity = quantity;

        // Lưu lại giỏ hàng
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Sản phẩm đã được cập nhật số lượng',
            cart
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng của người dùng' });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.cartItems = cart.cartItems.filter(item => item.bookId.toString() !== bookId);

        // Lưu lại giỏ hàng
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Sản phẩm đã được xóa khỏi giỏ hàng',
            cart
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa giỏ hàng của người dùng
const deleteCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOneAndDelete({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng của người dùng' });
        }

        res.status(200).json({
            success: true,
            message: 'Giỏ hàng đã được xóa',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCart,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    deleteCart
};

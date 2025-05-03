const axios = require("axios");
const cloudinary = require("../../utils/cloudinary");
//model
const Report = require('../../models/exchange/reportModel')
const ExchangeRequest = require('../../models/exchange/exchangeRequestModel')


const createReport = async (req, res) => {
    try {
        const { content, requestId, images } = req.body;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        let imageUrls = [];

        if (!requestId) {
            return res.status(200).json({ success: false, message: "Apply requestId pls" });
        }
        if (!content && !imageUrls) {
            return res.status(200).json({ success: false, message: "Apply content or imageUrls pls" });
        }


        if (images) {
            if (Array.isArray(images)) {
                const uploadPromises = images.map(image =>
                    cloudinary.uploader.upload(image, { folder: "uploads" })
                );
                const uploadResults = await Promise.all(uploadPromises);
                imageUrls = uploadResults.map(result => result.secure_url);
            } else {
                const result = await cloudinary.uploader.upload(images, { folder: "uploads" });
                imageUrls.push(result.secure_url);
            }
        }

        const newReport = await Report.create({ content, images: imageUrls, requestId, status: "pending" });

        // 2. Gửi nội dung tới Telegram
        const message = `
                        <b>📣 Tố cáo mới</b>\n
                        <b>🆔 ID Request:</b> <code>${requestId}</code>\n
                        <b>📄 Nội dung:</b> ${content}`;

        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🔍 Xem chi tiết",
                            callback_data: `get_request_${requestId}`,
                        },
                    ],
                ]
            }
        });


        // 3. Gửi ảnh nếu có
        if (imageUrls?.length > 0) {
            const media = imageUrls.map((url) => ({
                type: "photo",
                media: url,
            }));
            await axios.post(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
                chat_id: chatId,
                media: media,
            });
        }

        return res.status(200).json({ success: true, data: newReport });
    } catch (err) {
        console.error("Lỗi khi xử lý:", err.message);
        res.status(500).json({ success: false, message: "Lỗi xử lý request" });
    }
};

const getRequestByIdTelegram = async (req, res) => {
    const body = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    // Khi admin nhấn nút callback
    if (body.callback_query) {
        const callbackData = body.callback_query.data; // VD: get_request_123456
        const chatId = body.callback_query.message.chat.id;

        // Tách lấy requestId
        if (callbackData.startsWith("get_request_")) {
            const requestId = callbackData.replace("get_request_", "");

            // 🔎 Lấy dữ liệu từ DB (giả sử bạn có RequestModel)
            const request = await ExchangeRequest.findById(requestId).populate('bookRequestedId').populate('exchangeBookId')

            if (!request) {
                await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                    chat_id: chatId,
                    text: "❌ Không tìm thấy request.",
                });
                return res.sendStatus(200);
            }

            const detailMessage = `
            <b>🔄 YÊU CẦU TRAO ĐỔI MỚI</b>\n
            <b>🆔 Mã yêu cầu:</b> <code>${request._id}</code>
            <b>📅 Ngày yêu cầu:</b> ${new Date(request.createdAt).toLocaleDateString("vi-VN")}
            
            <b>📚 Sách được yêu cầu:</b>
            <b>• Tên:</b> ${request.bookRequestedId.title}
            <b>• Tác giả:</b> ${request.bookRequestedId.author}
            <b>• Nhà XB:</b> ${request.bookRequestedId.publisher} (${request.bookRequestedId.publicationYear})
            <b>• Điểm:</b> ${request.bookRequestedId.creditPoints}⭐️
            <b>• Tình trạng:</b> ${request.bookRequestedId.condition}
            <b>• Khu vực:</b> ${request.bookRequestedId.location}
            <b>• Mô tả:</b> ${request.bookRequestedId.description}
            <a href="${request.bookRequestedId.images[0]}">📷 Xem ảnh</a>
            
            <b>📕 Sách đổi lấy:</b>
            <b>• Tên:</b> ${request.exchangeBookId.title}
            <b>• Tác giả:</b> ${request.exchangeBookId.author}
            <b>• Nhà XB:</b> ${request.exchangeBookId.publisher} (${request.exchangeBookId.publicationYear})
            <b>• Điểm:</b> ${request.exchangeBookId.creditPoints}⭐️
            <b>• Tình trạng:</b> ${request.exchangeBookId.condition}
            <b>• Khu vực:</b> ${request.exchangeBookId.location}
            <b>• Mô tả:</b> ${request.exchangeBookId.description}
            <a href="${request.exchangeBookId.images[0]}">📷 Xem ảnh</a>
            
            <b>🔗 Chi tiết:</b> <a href="https://bookshop-vn.onrender.com/chi-tiet/${request._id}">Xem trên website</a>
            `;
            

            await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                chat_id: chatId,
                text: detailMessage,
                parse_mode: "HTML",
            });
        }
    }

    res.sendStatus(200);
}

module.exports = {
    createReport, getRequestByIdTelegram
};
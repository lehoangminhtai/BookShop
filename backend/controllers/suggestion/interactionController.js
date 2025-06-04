const Interaction = require('../../models/suggestion/interactionModel');
const BookSale = require('../../models/bookSaleModel');
const Review = require('../../models/reviewModel'); // Giả sử bạn có model Rating để lưu rating của người dùng

const handleBookClick = async (req, res) => {
    const { userId, bookId } = req.body; // Lấy userId và bookId từ request body
    try {
        // Kiểm tra xem Interaction đã tồn tại chưa
        let interaction = await Interaction.findOne({ userId, bookId }).sort({ last_visit_date: -1 });

        if (!interaction) {
            // Nếu chưa có Interaction, tạo mới
            const book = await BookSale.findById(bookId).populate('bookId'); // Populate để lấy thông tin categoryId từ model CategoryBook
            if (!book) {
                console.log(userId, bookId);

                return res.status(200).json({ message: 'Book not found' });
            }


            // Tạo Interaction mới
            interaction = new Interaction({
                userId,
                bookId,
                categoryId: book.bookId.categoryId, // Lấy categoryId từ Book
                rating: null, // Chưa có rating ở đây
                click_count: 1,
            });

            // Kiểm tra nếu có rating cho book từ model Rating
            const rating = await Review.findOne({ userId, bookId }).sort({ createdAt: -1 });
            if (rating) {
                interaction.rating = rating.rating; // Gán rating từ model Rating vào Interaction
            }

            // Lưu Interaction mới
            await interaction.save();

            return res.status(201).json({ message: 'New interaction created', data: interaction });
        } else {

            // Cập nhật last_visit_date và tăng click_count lên 1
            interaction.last_visit_date = new Date();
            interaction.click_count += 1;

            const rating = await Review.findOne({ userId, bookId }).sort({ createdAt: -1 });
            if (rating) {
                interaction.rating = rating.rating; // Gán rating vào interaction
            }


            // Lưu lại Interaction đã cập nhật
            await interaction.save();

            return res.status(200).json({ message: 'Interaction updated', data: interaction });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getLatestInteractions = async (req, res) => {

    try {
        // Lấy 100 tương tác gần nhất của userId, sắp xếp theo last_visit_date (mới nhất trước)
        const interactions = await Interaction.find()
            .sort({ last_visit_date: -1 }) // Sắp xếp theo ngày truy cập gần nhất
            .limit(200); // Giới hạn 100 kết quả

        if (!interactions || interactions.length === 0) {
            return res.status(404).json({ message: 'No interactions found for this user', data: [] });
        }

        return res.status(200).json({ data: interactions });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    handleBookClick,
    getLatestInteractions
};

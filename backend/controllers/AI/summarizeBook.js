const axios = require('axios')

const summarizeBook = async (req, res) =>{
    const { title, author } = req.body; // nhận title sách từ phía frontend

    try {
      // Gọi OpenRouter API với mô hình GPT
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Tóm tắt cuốn sách có tên "${title}" của tác giả ${author} trong 5 câu ngắn gọn bằng tiếng Việt.`,
            },
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Trả về kết quả từ OpenRouter
      const summary = response.data.choices[0].message.content;
      res.json({ summary });
    } catch (error) {
      console.error("Lỗi khi gọi OpenRouter:", error.message);
      res.status(500).send("Không thể tóm tắt sách.");
    }
}
module.exports = {summarizeBook}


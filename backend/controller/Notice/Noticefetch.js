const NewsModel=require('../../model/Notice/NoticeModel');

const NewsFetch = async (req, res) => {
    try {
        const notice = await NewsModel.find();
        res.status(200).json({ success: true, notice });
    } catch (err) {
        console.error("Error fetching news:", err); // Log error details
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = NewsFetch;
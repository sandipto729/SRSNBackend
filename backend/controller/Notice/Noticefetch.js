const NewsModel=require('../../model/Notice/NoticeModel');
const RedisClient = require('../../config/Redis');
const DEFAULT_EXPIRATION = 60*2;

const NewsFetch = async (req, res) => {
    try {
        const catchedNews = await RedisClient.get('news');
        if (catchedNews) {
            // console.log('Using Redis cache getting news',JSON.parse(catchedNews));
            return res.json({ success: true, notice: JSON.parse(catchedNews) });
        }
        const notice = await NewsModel.find();
        res.status(200).json({ success: true, notice });
        await RedisClient.setEx('news',DEFAULT_EXPIRATION,JSON.stringify(notice));
    } catch (err) {
        console.error("Error fetching news:", err); // Log error details
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = NewsFetch;
const NewsModel = require('../../model/Notice/NoticeModel');

const NewsEntry = async (req, res) => {
    try {
        const { name, url, sendbody, date } = req.body;

        // Basic validation
        if (!name || !url || !sendbody) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const news = await NewsModel.create({
            name,
            url,
            sendbody,
            date: date || new Date()  // Fallback to current date if not provided
        });

        res.status(200).json({ success: true, news });
    } catch (err) {
        console.error("Error creating news entry:", err); // Log error details
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = NewsEntry;

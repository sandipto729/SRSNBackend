const NoticeModel=require('../../model/Notice/NoticeModel');

const NoticeDelete = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await NoticeModel.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ success: true, message: 'Notice deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Notice not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = NoticeDelete;
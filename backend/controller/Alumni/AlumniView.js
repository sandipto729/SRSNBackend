const alumniVeriModel = require('../../model/Alumni/alumniVeriModel');

const alumniView = async (req, res) => {
    try {
        const alumni = await alumniVeriModel.find();
        res.status(200).json({ success: true, alumni });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = alumniView;

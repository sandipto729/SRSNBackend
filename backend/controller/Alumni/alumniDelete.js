const alumniTempModel = require('../../model/Alumni/alumniTempModel');

const alumniDelete = async (req, res) => {
    const alumniId = req.body.ID;
    try {
        const alumni = await alumniTempModel.findByIdAndDelete(alumniId);
        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found' });
        }
        res.status(200).json({ success: true, alumni });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = alumniDelete;

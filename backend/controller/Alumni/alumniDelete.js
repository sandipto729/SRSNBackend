const alumniTempModel = require('../../model/Alumni/alumniTempModel');
const sendEmail = require('./../../helper/Mail');

const alumniDelete = async (req, res) => {
    const alumniId = req.body.ID;
    try {
        const alumni = await alumniTempModel.findByIdAndDelete(alumniId);
        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found' });
        }
        res.status(200).json({ success: true, alumni });
        sendEmail(alumni.email, 'Alumni Application Deleted', 'Your alumni application has been deleted.');
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = alumniDelete;

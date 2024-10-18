const alumniVeriModel = require('../../model/Alumni/alumniVeriModel');

const alumniDetails = async (req, res) => {
    const alumniId = req.body.ID;
    console.log(alumniId);
    try {
        const alumni = await alumniVeriModel.findById(alumniId);
        // console.log(alumni);
        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found' });
        }
        res.status(200).json({ success: true, alumni });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = alumniDetails;

const alumniModel = require('../../model/Alumni/alumniVeriModel');

const alumniEdit = async (req, res) => {
    try {
        const AlumniId = req.body.ID;
        const alumni = await alumniModel.findByIdAndUpdate(AlumniId, req.body);
        res.status(200).json({ success: true, alumni });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = alumniEdit;
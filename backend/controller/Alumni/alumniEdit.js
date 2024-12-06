const alumniModel = require('../../model/Alumni/alumniVeriModel');

const alumniEdit = async (req, res) => {
    try {
        //take alumni id from auth
        const AlumniId = req.alumniuser._id;
        const alumni = await alumniModel.findByIdAndUpdate(AlumniId, req.body);
        res.status(200).json({ success: true});
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = alumniEdit;
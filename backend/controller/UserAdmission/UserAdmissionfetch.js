const UserAdmissionModel = require('../../model/User/UserAdmissionModel');

const fetchUserAdmission = async (req, res) => {
    try {
        const beezAdmission = await UserAdmissionModel.find({ 'grade': 'beez' });
        const ankurAdmission = await UserAdmissionModel.find({ 'grade': 'ankur' });
        const kisholoyAdmission = await UserAdmissionModel.find({ 'grade': 'kisholoy' });
        const c1Admission = await UserAdmissionModel.find({ 'grade': '1' });
        const c2Admission = await UserAdmissionModel.find({ 'grade': '2' });
        const c3Admission = await UserAdmissionModel.find({ 'grade': '3' });
        const c4Admission = await UserAdmissionModel.find({ 'grade': '4' });
        res.status(200).json({
            success: true,
            beezAdmission: beezAdmission,
            ankurAdmission: ankurAdmission,
            kisholoyAdmission: kisholoyAdmission,
            c1Admission: c1Admission,
            c2Admission: c2Admission,
            c3Admission: c3Admission,
            c4Admission: c4Admission
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
};
module.exports = fetchUserAdmission
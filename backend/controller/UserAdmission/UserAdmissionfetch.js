// const UserAdmissionModel = require('../../model/User/UserAdmissionModel');

// const fetchUserAdmission = async (req, res) => {
//     try {
//         const beezAdmission = await UserAdmissionModel.find({ 'grade': { $regex: /^Beez$/, $options: 'i' } });
//         const ankurAdmission = await UserAdmissionModel.find({ 'grade': { $regex: /^Ankur$/, $options: 'i' } });
//         const kisholoyAdmission = await UserAdmissionModel.find({ 'grade': { $regex: /^Kisholoy$/, $options: 'i' } });

//         const c1Admission = await UserAdmissionModel.find({ 'grade': '1' });
//         const c2Admission = await UserAdmissionModel.find({ 'grade': '2' });
//         const c3Admission = await UserAdmissionModel.find({ 'grade': '3' });
//         const c4Admission = await UserAdmissionModel.find({ 'grade': '4' });
//         res.status(200).json({
//             success: true,
//             beezAdmission: beezAdmission,
//             ankurAdmission: ankurAdmission,
//             kisholoyAdmission: kisholoyAdmission,
//             c1Admission: c1Admission,
//             c2Admission: c2Admission,
//             c3Admission: c3Admission,
//             c4Admission: c4Admission
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ success: false, error: err.message });
//     }
// };
// module.exports = fetchUserAdmission


const UserAdmissionModel = require('../../model/User/UserAdmissionModel');

const fetchUserAdmission = async (req, res) => {
    try {
        const beezAdmission = await UserAdmissionModel.find({ 'grade': { $regex: /^Beez$/, $options: 'i' } });
        const ankurAdmission = await UserAdmissionModel.find({ 'grade': { $regex: /^Ankur$/, $options: 'i' } });
        const kisholoyAdmission = await UserAdmissionModel.find({ 'grade': { $regex: /^Kisholoy$/, $options: 'i' } });

        const c1Admission = await UserAdmissionModel.find({ 'grade': '1' });
        const c2Admission = await UserAdmissionModel.find({ 'grade': '2' });
        const c3Admission = await UserAdmissionModel.find({ 'grade': '3' });
        const c4Admission = await UserAdmissionModel.find({ 'grade': '4' });
        const c5Admission = await UserAdmissionModel.find({ 'grade': '5' });
        const c6Admission = await UserAdmissionModel.find({ 'grade': '6' });
        const c7Admission = await UserAdmissionModel.find({ 'grade': '7' });
        const c8Admission = await UserAdmissionModel.find({ 'grade': '8' });

        res.status(200).json({
            success: true,
            beezAdmission: beezAdmission,
            ankurAdmission: ankurAdmission,
            kisholoyAdmission: kisholoyAdmission,
            c1Admission: c1Admission,
            c2Admission: c2Admission,
            c3Admission: c3Admission,
            c4Admission: c4Admission,
            c5Admission: c5Admission,
            c6Admission: c6Admission,
            c7Admission: c7Admission,
            c8Admission: c8Admission
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = fetchUserAdmission;

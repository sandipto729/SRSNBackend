const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
const userAdmissionSearch = async (req, res) => {
    try {
        const search = req.body.search;
        const userAdmission = await UserAdmissionModel.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { grade: { $regex: search, $options: 'i' } },
                { _id: { $regex: search, $options: 'i' } },
                { paymentId: { $regex: search, $options: 'i' } },
                { aadharNo: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { studentCode: { $regex: search, $options: 'i' } },
            ]
        });

        res.status(200).json({ success: true, userAdmission });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = userAdmissionSearch
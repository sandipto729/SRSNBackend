const UserAdmissionModel = require('../../model/User/UserAdmissionModel');


const userAdmissionDelete = async (req, res) => {
    try {
        const {id}=req.body;
        const userAdmission = await UserAdmissionModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, userAdmission });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = userAdmissionDelete
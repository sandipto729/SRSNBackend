const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
const userModel = require('../../model/User/UserModel');
const bcrypt = require('bcrypt');

const UserApplicationAdd = async (req, res) => {
    try {
        // console.log(req.body);
        const { _id, aadharNo, email } = req.body.student; 
        const password = aadharNo.slice(-5);

        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userAdmissionData = {
            ...req.body.student,
            password: hashedPassword,
            role: 'Student'
        };

        const userSignUp = await userModel.create(userAdmissionData);

        await UserAdmissionModel.findByIdAndDelete(_id);


        res.status(200).json({ success: true, userSignUp });
    } catch (err) {
        console.error(err); 
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = UserApplicationAdd;

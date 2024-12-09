const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
const UserModel = require('../../model/User/UserModel');
const bcrypt = require('bcrypt');

const UserApplicationAddArray = async (req, res) => {
    try {
        const { studentRanks } = req.body; // Destructure studentRanks array
        console.log("Received students:", studentRanks);

        if (!studentRanks || !Array.isArray(studentRanks)) {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        const results = await Promise.all(
            studentRanks.map(async ({ _id, rank }) => {
                // Fetch full student data from UserAdmissionModel using _id
                const student = await UserAdmissionModel.findById(_id);

                if (!student) {
                    return { success: false, message: `Student with ID ${_id} not found` };
                }

                // Extract necessary fields
                const { aadharNo, email, ...rest } = student.toObject();
                if (!aadharNo || !email) {
                    return { success: false, message: `Missing required fields for student ID ${_id}` };
                }

                const password = aadharNo.slice(-5);

                // Check if user already exists
                const existingUser = await UserModel.findOne({ email });
                if (existingUser) {
                    return { success: false, message: `User with email ${email} already exists` };
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user data with the provided rank
                const userAdmissionData = {
                    ...rest,
                    password: hashedPassword,
                    role: 'Student',
                    email,
                    aadharNo,
                    result:rank,
                };

                console.log(userAdmissionData);

                // Save to UserModel
                const userSignUp = await UserModel.create(userAdmissionData);

                // Remove from UserAdmissionModel
                await UserAdmissionModel.findByIdAndDelete(_id);

                return { success: true, userSignUp };
            })
        );

        res.status(200).json({ success: true, results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = UserApplicationAddArray;

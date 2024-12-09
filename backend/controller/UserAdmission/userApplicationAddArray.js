const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
const UserModel = require('../../model/User/UserModel');
const bcrypt = require('bcrypt');

const UserApplicationAddArray = async (req, res) => {
    try {
        const { studentRanks } = req.body;
        console.log("Received students user admission data:", studentRanks);

        if (!studentRanks || !Array.isArray(studentRanks)) {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        // Initialize results array
        const results = [];

        // Process each studentRank sequentially
        for (let i = 0; i < studentRanks.length; i++) {
            const { _id, rank } = studentRanks[i];
            console.log(`Processing student at index ${i} with ID: ${_id}`);

            try {
                const student = await UserAdmissionModel.findById(_id);
                if (!student) {
                    console.error(`Student with ID ${_id} not found`);
                    results.push({ success: false, message: `Student with ID ${_id} not found` });
                    continue;
                }

                const { aadharNo, email, ...rest } = student.toObject();
                if (!aadharNo || !email) {
                    console.error(`Missing required fields for student ID ${_id}`);
                    results.push({ success: false, message: `Missing fields for student ID ${_id}` });
                    continue;
                }

                const password = aadharNo.slice(-5);
                const existingUser = await UserModel.findOne({ email });
                if (existingUser) {
                    console.warn(`User with email ${email} already exists`);
                    results.push({ success: false, message: `User with email ${email} already exists` });
                    continue;
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const userAdmissionData = {
                    ...rest,
                    password: hashedPassword,
                    role: 'Student',
                    email,
                    aadharNo,
                    result: rank,
                };

                console.log("Creating user:", userAdmissionData);

                const userSignUp = await UserModel.create(userAdmissionData);
                console.log(`User created successfully for ID: ${_id}`);

                await UserAdmissionModel.findByIdAndDelete(_id);
                console.log(`Deleted student admission data for ID: ${_id}`);

                results.push({ success: true, userSignUp });
            } catch (err) {
                console.error(`Error processing student at index ${i} with ID ${_id}:`, err);
                results.push({ success: false, message: `Error processing student ID ${_id}` });
            }
        }

        // Check for overall success or failure
        console.log("Final results:", results);
        const failedResults = results.filter(r => !r.success);
        if (failedResults.length > 0) {
            return res.status(400).json({ success: false, results });
        }

        res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("Unhandled error in UserApplicationAddArray:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = UserApplicationAddArray;

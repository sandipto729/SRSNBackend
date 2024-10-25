const userModel = require('../../model/User/UserModel');

const studentMarksSubmission = async (req, res) => {
    try {
        const TotalUser = req.body;

        // Using Promise.all to handle asynchronous updates for each user
        await Promise.all(TotalUser.map(async (user) => {
            const StudentID = user.student_id;
            const Subject = user.subjectName; // e.g., 'BengaliW', 'EnglishL'
            const Marks = user.Marks;

            // Dynamically update the specific subject within `subjects`
            const userUpdate = await userModel.findByIdAndUpdate(
                StudentID, 
                { [`subjects.${Subject}`]: Marks }, // Update the nested subject
                { new: true, upsert: true } // Ensure document is returned and created if missing
            );

            if (!userUpdate) {
                throw new Error(`User with ID ${StudentID} not found`);
            }
        }));

        // Send a successful response if all updates are complete
        res.status(200).json({ success: true, message: 'Marks updated successfully' });
        
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = studentMarksSubmission;

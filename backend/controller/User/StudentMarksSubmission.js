const userModel = require('../../model/User/UserModel');

const studentMarksSubmission = async (req, res) => {
    try {
        const TotalUser = req.body;

        await Promise.all(TotalUser.map(async (user) => {
            const StudentID = user.student_id;
            const Subject = user.subject;
            const Semester=user.semester;
            const Marks = user.marks;

            const userUpdate = await userModel.findByIdAndUpdate(
                StudentID, 
                { [`${Semester}.${Subject}`]: Marks }, 
                { new: true, upsert: true } 
            );

            if (!userUpdate) {
                throw new Error(`User with ID ${StudentID} not found`);
            }
        }));

        res.status(200).json({ success: true, message: 'Marks updated successfully' });
        
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = studentMarksSubmission;

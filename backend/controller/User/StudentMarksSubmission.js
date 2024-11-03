const userModel = require('../../model/User/UserModel');
const EventModel = require('../../model/EventControl/EventControl');

const studentMarksSubmission = async (req, res) => {
    try {
        const MarksSubmission = await EventModel.findOne({ name: { $regex: /MarksSubmission/i } });
        if (!MarksSubmission) {
            throw new Error("MarksSubmission event not found");
        }

        const UserId = req.user?._id;
        if (!UserId) {
            throw new Error("User ID not found in request");
        }

        const user = await userModel.findById(UserId);
        if (!user) {
            throw new Error(`User with ID ${UserId} not found`);
        }

        const TotalUser = req.body;
        if (!Array.isArray(TotalUser) || TotalUser.length === 0) {
            throw new Error("Invalid or empty data provided for students");
        }

        const Event1 = TotalUser[0];
        if (!Event1 || !Event1.student_id) {
            throw new Error("Student data is missing _id");
        }

        const StudentUser = await userModel.findById(Event1.student_id);
        if (!StudentUser) {
            throw new Error(`Student with ID ${Event1._id} not found`);
        }

        const StudentClass = StudentUser.grade;
        const changes = `${user.name} has updated on ${new Date().toISOString()} Class-${StudentClass} Semester-${Event1.semester} Subject-${Event1.subject}`;
        
        MarksSubmission.changes.unshift(changes);
        await MarksSubmission.save();

        await Promise.all(TotalUser.map(async (user) => {
            const { student_id, subject, semester, marks } = user;

            const userUpdate = await userModel.findByIdAndUpdate(
                student_id, 
                { [`${semester}.${subject}`]: marks }, 
                { new: true, upsert: true }
            );

            if (!userUpdate) {
                throw new Error(`User with ID ${student_id} not found`);
            }
        }));

        res.status(200).json({ success: true, message: 'Marks updated successfully' });
        
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = studentMarksSubmission;

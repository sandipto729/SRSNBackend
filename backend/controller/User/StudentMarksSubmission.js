// const userModel = require('../../model/User/UserModel');
// const EventModel = require('../../model/EventControl/EventControl');

// const studentMarksSubmission = async (req, res) => {
//     try {
//         const MarksSubmission = await EventModel.findOne({ name: { $regex: /MarksSubmission/i } });
//         if (!MarksSubmission) {
//             throw new Error("MarksSubmission event not found");
//         }
//         else if(MarksSubmission.isOngoing){
//             res.status(400).json({ success: false, message: "MarksSubmission event is ongoing , try to contact admin for stop the event" });
//         }

//         const UserId = req.user?._id;
//         if (!UserId) {
//             throw new Error("User ID not found in request");
//         }

//         const user = await userModel.findById(UserId);
//         if (!user) {
//             throw new Error(`User with ID ${UserId} not found`);
//         }

//         const TotalUser = req.body;
//         if (!Array.isArray(TotalUser) || TotalUser.length === 0) {
//             throw new Error("Invalid or empty data provided for students");
//         }

//         const Event1 = TotalUser[0];
//         if (!Event1 || !Event1.student_id) {
//             throw new Error("Student data is missing _id");
//         }

//         const StudentUser = await userModel.findById(Event1.student_id);
//         if (!StudentUser) {
//             throw new Error(`Student with ID ${Event1._id} not found`);
//         }

//         const StudentClass = StudentUser.grade;
//         const changes = `${user.name} has updated on ${new Date().toISOString()} Class-${StudentClass} Semester-${Event1.semester} Subject-${Event1.subject}`;
        
//         MarksSubmission.changes.unshift(changes);
//         await MarksSubmission.save();

//         await Promise.all(TotalUser.map(async (user) => {
//             const { student_id, subject, semester, marks } = user;

//             const userUpdate = await userModel.findByIdAndUpdate(
//                 student_id, 
//                 { [`${semester}.${subject}`]: marks }, 
//                 { new: true, upsert: true }
//             );

//             if (!userUpdate) {
//                 throw new Error(`User with ID ${student_id} not found`);
//             }
//         }));

//         res.status(200).json({ success: true, message: 'Marks updated successfully' });
        
//     } catch (err) {
//         console.error(err);
//         res.status(400).json({ success: false, error: err.message });
//     }
// };

// module.exports = studentMarksSubmission;


const userModel = require('../../model/User/UserModel');
const EventModel = require('../../model/EventControl/EventControl');

const studentMarksSubmission = async (req, res) => {
    try {
        // Check if the "MarksSubmission" event exists and is ongoing
        const marksSubmissionEvent = await EventModel.findOne({ name: { $regex: /MarksSubmission/i } });
        if (!marksSubmissionEvent) {
            return res.status(404).json({ success: false, message: "MarksSubmission event not found" });
        }
        if (marksSubmissionEvent.isOngoing) {
            return res.status(400).json({ success: false, message: "MarksSubmission event is ongoing. Contact admin to stop the event." });
        }

        // Get the user ID from the request
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }

        // Verify if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: `User with ID ${userId} not found` });
        }

        // Check if TotalUser data is provided and is a non-empty array
        const totalUser = req.body;
        if (!Array.isArray(totalUser) || totalUser.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or empty data provided for students" });
        }

        // Validate student data format in TotalUser
        const firstStudentEntry = totalUser[0];
        if (!firstStudentEntry || !firstStudentEntry.student_id) {
            return res.status(400).json({ success: false, message: "Student data is missing student_id" });
        }

        // Verify if the specified student exists
        const studentUser = await userModel.findById(firstStudentEntry.student_id);
        if (!studentUser) {
            return res.status(404).json({ success: false, message: `Student with ID ${firstStudentEntry.student_id} not found` });
        }

        // Log the change event with the user's details
        const studentClass = studentUser.grade;
        const logEntry = `${user.name} updated on ${new Date().toISOString()} - Class ${studentClass}, Semester ${firstStudentEntry.semester}, Subject ${firstStudentEntry.subject}`;
        marksSubmissionEvent.changes.unshift(logEntry);
        await marksSubmissionEvent.save();

        // Update marks for each student in TotalUser
        await Promise.all(totalUser.map(async (entry) => {
            const { student_id, subject, semester, marks } = entry;

            const updatedUser = await userModel.findByIdAndUpdate(
                student_id,
                { [`${semester}.${subject}`]: marks },
                { new: true, upsert: true }
            );

            if (!updatedUser) {
                throw new Error(`Student with ID ${student_id} not found`);
            }
        }));

        // Respond with success if all updates are completed
        res.status(200).json({ success: true, message: 'Marks updated successfully' });
        
    } catch (err) {
        console.error('Error in studentMarksSubmission:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = studentMarksSubmission;

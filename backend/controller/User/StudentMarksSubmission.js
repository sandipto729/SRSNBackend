const userModel = require('../../model/User/UserModel');
const EventModel = require('../../model/EventControl/EventControl');

const studentMarksSubmission = async (req, res) => {
    try {
        // Check if the "MarksSubmission" event exists and is ongoing

        const primaryResult= await EventModel.findOne({ name: { $regex: /PrimaryResult/i } });
        const highResult= await EventModel.findOne({ name: { $regex: /HighResult/i } });


        if (!primaryResult || !highResult) {
            return res.status(404).json({ success: false, message: "MarksSubmission event not found" });
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
       

        if (studentClass && /^(Beez|Ankur|Kisholoy|1|2|3|4)$/i.test(studentClass)) {
            if(primaryResult.isOngoing){
                return res.status(400).json({ success: false, message: "MarksSubmission event is ongoing. Contact admin to stop the event." });
            }
            else{
                primaryResult.changes.unshift(logEntry);
                await primaryResult.save();
            }
            
        }

        if (studentClass && /^(5|6|7|8)$/i.test(studentClass)) {
            if(highResult.isOngoing){
                return res.status(400).json({ success: false, message: "MarksSubmission event is ongoing. Contact admin to stop the event." });
            }
            else{
                highResult.changes.unshift(logEntry);
                await highResult.save();
            }           
        }
        
        

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

const UserModel = require('../../model/User/UserModel');

const calculateResult = async (req, res) => {
    try {
        // List of classes to iterate over
        const classes = ['beez', 'ankur', 'kisholoy', '1', '2', '3', '4'];
        const classResults = {};

        for (const grade of classes) {
            // Fetch students in the specified class
            const students = await UserModel.find({ grade });

            // Calculate scores and store them temporarily for sorting
            const studentScores = students.map(student => {
                // Convert marks to integers and calculate semester totals
                const endSemTotal = Object.values(student.endSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const firstSemTotal = Object.values(student.firstSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const secondSemTotal = Object.values(student.secondSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                
                // Calculate overall total for ranking
                const allSemTotal = endSemTotal + firstSemTotal + secondSemTotal;

                return {
                    student,  
                    endSemTotal,
                    allSemTotal
                };
            });

            // Sort students by endSemTotal, then allSemTotal, then name for tie-breaking
            studentScores.sort((a, b) => {
                if (b.endSemTotal !== a.endSemTotal) return b.endSemTotal - a.endSemTotal;
                if (b.allSemTotal !== a.allSemTotal) return b.allSemTotal - a.allSemTotal;
                return a.student.name.localeCompare(b.student.name);
            });

            // Assign ranks based on the sorted order
            for (let i = 0; i < studentScores.length; i++) {
                const { student } = studentScores[i];
                student.result = i + 1;  // Rank starts from 1
                await student.save();    // Save the rank in the database
            }

            // Save the sorted and ranked list for each class to the response
            classResults[grade] = studentScores.map(({ student, endSemTotal, allSemTotal }, index) => ({
                _id: student._id,
                name: student.name,
                grade: student.grade,
                rank: index + 1,
                endSemTotal,
                allSemTotal
            }));
        }

        res.status(200).json({ success: true, classResults });
    } catch (err) {
        console.error("Error calculating results:", err);
        res.status(500).json({ success: false, message: "Error calculating results" });
    }
};

module.exports = calculateResult;

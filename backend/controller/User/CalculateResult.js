// const calculateResult = async (req, res) => {
//     try {
//         // List of classes to iterate over
//         const classes = ['Beez', 'Ankur', 'Kisholoy', '1', '2', '3', '4', '5', '6', '7', '8'];
//         const classResults = {};

//         for (const grade of classes) {
//             // Fetch students in the specified class
//             const students = await UserModel.find({ grade });

//             // Calculate scores and store them temporarily for sorting
//             const studentScores = students.map(student => {
//                 // Convert marks to integers and calculate semester totals
//                 const endSemTotal = Object.values(student.endSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
//                 const firstSemTotal = Object.values(student.firstSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
//                 const secondSemTotal = Object.values(student.secondSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                
//                 // Calculate overall total for ranking
//                 const allSemTotal = endSemTotal + firstSemTotal + secondSemTotal;

//                 return {
//                     student,  
//                     endSemTotal,
//                     allSemTotal
//                 };
//             });

//             // Sorting logic
//             if (['Beez', 'Ankur', 'Kisholoy', '1', '2', '3', '4'].includes(grade)) {
//                 // Sort by endSemTotal, then allSemTotal, then name (for Beez to 4)
//                 studentScores.sort((a, b) => {
//                     if (b.endSemTotal !== a.endSemTotal) return b.endSemTotal - a.endSemTotal;
//                     if (b.allSemTotal !== a.allSemTotal) return b.allSemTotal - a.allSemTotal;
//                     return a.student.name.localeCompare(b.student.name); // Sort alphabetically by name
//                 });
//             } else {
//                 // Sort by allSemTotal, then name (for classes 5-8)
//                 studentScores.sort((a, b) => {
//                     if (b.allSemTotal !== a.allSemTotal) return b.allSemTotal - a.allSemTotal;
//                     return a.student.name.localeCompare(b.student.name); // Sort alphabetically by name
//                 });
//             }

//             // Assign ranks based on the sorted order
//             for (let i = 0; i < studentScores.length; i++) {
//                 const { student } = studentScores[i];
//                 student.result = i + 1;  // Rank starts from 1
//                 await student.save();    // Save the rank in the database
//             }

//             // Save the sorted and ranked list for each class to the response
//             classResults[grade] = studentScores.map(({ student, endSemTotal, allSemTotal }, index) => ({
//                 _id: student._id,
//                 name: student.name,
//                 grade: student.grade,
//                 rank: index + 1,
//                 endSemTotal,
//                 allSemTotal
//             }));
//         }

//         res.status(200).json({ success: true, classResults });
//     } catch (err) {
//         console.error("Error calculating results:", err);
//         res.status(500).json({ success: false, message: "Error calculating results" });
//     }
// };

// module.exports = calculateResult;



// Function for calculating results for Beez to 4 (Beez, Ankur, Kisholoy, 1 to 4)
const UserModel = require('./../../model/User/UserModel');

const calculateResultBeezTo4 = async (req, res) => {
    try {
        // Classes: Beez, Ankur, Kisholoy, 1, 2, 3, 4
        const classes = ['Beez', 'Ankur', 'Kisholoy', '1', '2', '3', '4'];
        const classResults = {};

        for (const grade of classes) {
            // Fetch students in the specified class
            const students = await UserModel.find({ grade });

            // Calculate scores and store them temporarily for sorting
            const studentScores = students.map(student => {
                const endSemTotal = Object.values(student.endSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const firstSemTotal = Object.values(student.firstSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const secondSemTotal = Object.values(student.secondSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const allSemTotal = endSemTotal + firstSemTotal + secondSemTotal;

                return { student, endSemTotal, allSemTotal };
            });

            // Sorting logic: Sort by endSemTotal, then allSemTotal, then name alphabetically
            studentScores.sort((a, b) => {
                if (b.endSemTotal !== a.endSemTotal) return b.endSemTotal - a.endSemTotal;
                if (b.allSemTotal !== a.allSemTotal) return b.allSemTotal - a.allSemTotal;
                return a.student.name.localeCompare(b.student.name); // Sort alphabetically by name
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

// Function for calculating results for 5 to 8 (5, 6, 7, 8)
const calculateResult5To8 = async (req, res) => {
    try {
        // Classes: 5, 6, 7, 8
        const classes = ['5', '6', '7', '8'];
        const classResults = {};

        for (const grade of classes) {
            // Fetch students in the specified class
            const students = await UserModel.find({ grade });

            // Calculate scores and store them temporarily for sorting
            const studentScores = students.map(student => {
                const endSemTotal = Object.values(student.endSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const firstSemTotal = Object.values(student.firstSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const secondSemTotal = Object.values(student.secondSem || {}).reduce((acc, val) => acc + parseInt(val, 10), 0);
                const allSemTotal = endSemTotal + firstSemTotal + secondSemTotal;

                return { student, allSemTotal };
            });

            // Sorting logic: Sort by allSemTotal, then name alphabetically
            studentScores.sort((a, b) => {
                if (b.allSemTotal !== a.allSemTotal) return b.allSemTotal - a.allSemTotal;
                return a.student.name.localeCompare(b.student.name); // Sort alphabetically by name
            });

            // Assign ranks based on the sorted order
            for (let i = 0; i < studentScores.length; i++) {
                const { student } = studentScores[i];
                student.result = i + 1;  // Rank starts from 1
                await student.save();    // Save the rank in the database
            }

            // Save the sorted and ranked list for each class to the response
            classResults[grade] = studentScores.map(({ student, allSemTotal }, index) => ({
                _id: student._id,
                name: student.name,
                grade: student.grade,
                rank: index + 1,
                allSemTotal
            }));
        }

        res.status(200).json({ success: true, classResults });
    } catch (err) {
        console.error("Error calculating results:", err);
        res.status(500).json({ success: false, message: "Error calculating results" });
    }
};

module.exports = { calculateResultBeezTo4, calculateResult5To8 };

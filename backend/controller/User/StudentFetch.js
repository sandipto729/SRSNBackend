const userModel = require('../../model/User/UserModel');

const userFetch = async (req, res) => {
    try {
        // Fetch students from each grade
        const userBeez = await userModel.find({ role: { $regex: /student/i }, grade: 'beez' }).sort({ result: 1 }); // Sort by result (ascending)
        const userAnkur = await userModel.find({ role: { $regex: /student/i }, grade: 'ankur' }).sort({ result: 1 });
        const userKisholoy = await userModel.find({ role: { $regex: /student/i }, grade: 'kisholoy' }).sort({ result: 1 });
        const userC1 = await userModel.find({ role: { $regex: /student/i }, grade: '1' }).sort({ result: 1 });
        const userC2 = await userModel.find({ role: { $regex: /student/i }, grade: '2' }).sort({ result: 1 });
        const userC3 = await userModel.find({ role: { $regex: /student/i }, grade: '3' }).sort({ result: 1 });
        const userC4 = await userModel.find({ role: { $regex: /student/i }, grade: '4' }).sort({ result: 1 });
        
        res.status(200).json({
            success: true,
            userBeez,
            userAnkur,
            userKisholoy,
            userC1,
            userC2,
            userC3,
            userC4
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = userFetch;

const userModel = require('../../model/User/UserModel');

const userFetch = async (req, res) => {
    try {
        // Fetch students from each grade
        const userBeez = await userModel.find({
            role: { $regex: /student/i },
            grade: { $regex: /^beez$/i }  // Regex to match 'beez', case-insensitive
        }).sort({ result: 1 });
        
        const userAnkur = await userModel.find({
            role: { $regex: /student/i },
            grade: { $regex: /^ankur$/i }  // Regex to match 'ankur', case-insensitive
        }).sort({ result: 1 });
        
        const userKisholoy = await userModel.find({
            role: { $regex: /student/i },
            grade: { $regex: /^kisholoy$/i }  // Regex to match 'kisholoy', case-insensitive
        }).sort({ result: 1 });
        
        const userC1 = await userModel.find({ role: { $regex: /student/i }, grade: '1' }).sort({ result: 1 });
        const userC2 = await userModel.find({ role: { $regex: /student/i }, grade: '2' }).sort({ result: 1 });
        const userC3 = await userModel.find({ role: { $regex: /student/i }, grade: '3' }).sort({ result: 1 });
        const userC4 = await userModel.find({ role: { $regex: /student/i }, grade: '4' }).sort({ result: 1 });
        const userC5 = await userModel.find({ role: { $regex: /student/i }, grade: '5' }).sort({ result: 1 });
        const userC6 = await userModel.find({ role: { $regex: /student/i }, grade: '6' }).sort({ result: 1 });
        const userC7 = await userModel.find({ role: { $regex: /student/i }, grade: '7' }).sort({ result: 1 });
        const userC8 = await userModel.find({ role: { $regex: /student/i }, grade: '8' }).sort({ result: 1 });

        res.status(200).json({
            success: true,
            userBeez,
            userAnkur,
            userKisholoy,
            userC1,
            userC2,
            userC3,
            userC4,
            userC5,
            userC6,
            userC7,
            userC8
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = userFetch;

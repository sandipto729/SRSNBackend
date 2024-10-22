const userModel = require('../../model/User/UserModel');

const userFetch = async (req, res) => {
    try {
        const userBeez = await userModel.find({ role: { $regex: /student/i }, grade: 'beez' });
        const userAnkur = await userModel.find({ role: { $regex: /student/i }, grade: 'ankur' });
        const userKisholoy = await userModel.find({ role: { $regex: /student/i }, grade: 'kisholoy' });
        const userC1 = await userModel.find({ role: { $regex: /student/i }, grade: '1' });
        const userC2 = await userModel.find({ role: { $regex: /student/i }, grade: '2' });
        const userC3 = await userModel.find({ role: { $regex: /student/i }, grade: '3' });
        const userC4 = await userModel.find({ role: { $regex: /student/i }, grade: '4' });
        
        res.status(200).json({
            success: true,
            userBeez: userBeez,
            userAnkur: userAnkur,
            userKisholoy: userKisholoy,
            userC1: userC1,
            userC2: userC2,
            userC3: userC3,
            userC4: userC4
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = userFetch;

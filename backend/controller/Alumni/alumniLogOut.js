// async function userLogOut(req, res) {
//     try{
//         const token = req.cookies?.alumnitoken;
//         console.log('alumni token',token);
//         res.clearCookie('alumnitoken');
//         res.json({
//             message: "User Logged Out",
//             error: false,
//             success: true,
//             data:[]
//         })
//     }catch (error) {
//         console.error("Error during signout:", error);
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: true,
//             success: false
//         });
//     }
// }

// module.exports = userLogOut


const AlumniModel = require('../../model/Alumni/alumniVeriModel');

const userLogOut = async (req, res) => {
    try {
        const alumni = await AlumniModel.findById(req.alumniuser._id);
        alumni.refreshToken = null;
        await alumni.save();

        res.json({ 
            success: true, 
            message: 'Alumni logout successful',
            error: false,
            data: []
        });
    } catch (error) {
        console.error("Error during alumni signout:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: true
        });
    }
};

module.exports = userLogOut;

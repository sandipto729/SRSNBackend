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


async function userLogOut(req, res) {
    try {
        const token = req.cookies?.alumnitoken;
        console.log('alumni token:', token);

        res.clearCookie('alumnitoken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure only in production
            sameSite: 'none', // Explicitly set SameSite to 'None' for cross-site usage
            // domain: '.example.com', // Use your domain here if necessary
        });

        res.json({
            message: "User Logged Out",
            error: false,
            success: true,
            data: []
        });
    } catch (error) {
        console.error("Error during signout:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false
        });
    }
}

module.exports = userLogOut;

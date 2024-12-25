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


const userLogOut = async (req, res) => {
    try {
        // Retrieve the token from cookies
        const token = req.cookies?.alumnitoken;
        console.log('Alumni token:', token);

        // Clear the cookie with appropriate options
        res.clearCookie('alumnitoken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'none',
        });

        // Send a successful response
        res.status(200).json({
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
};

module.exports = userLogOut;

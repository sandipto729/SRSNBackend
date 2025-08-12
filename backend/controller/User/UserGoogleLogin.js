const UserModel=require('../../model/User/UserModel');
const { OAuth2Client } = require('google-auth-library');
const { generateAccessToken, generateRefreshToken } = require('../../utilis/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const UserGoogleLogin=async(req,res)=>{
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is missing in request' });
        }
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            message: "Google signin successful",
            UserModel: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports=UserGoogleLogin
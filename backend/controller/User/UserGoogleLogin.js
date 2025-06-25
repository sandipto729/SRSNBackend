const UserModel=require('../../model/User/UserModel');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

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
        const tokenData = { _id: user._id, email: user.email };
        const jwtToken = jwt.sign({ data: tokenData }, process.env.TOKEN_SECRET_KEY, { expiresIn: '3h' });
        const tokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };
        res.cookie('token', jwtToken, tokenOptions).json({
            message: "Signin successful",
            data: jwtToken,
            error: false,
            success: true
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports=UserGoogleLogin
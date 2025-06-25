const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const AlumniModel = require('../../model/Alumni/alumniVeriModel');

const AlumniGoogleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        // console.log("Received Google token:", token);

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is missing in request' });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // console.log("Google Payload:", payload);

        const alumni = await AlumniModel.findOne({ email });
        console.log('Alumni : ',alumni);

        if (!alumni) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const tokenData = { _id: alumni._id, email: alumni.email };

        const jwtToken = jwt.sign(
            { data: tokenData },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '3h' }
        );

        const tokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        };

        res.cookie('alumnitoken', jwtToken, tokenOptions).json({
            message: "Signin successful",
            data: jwtToken,
            error: false,
            success: true
        });
    } catch (err) {
        console.error("Error in Google Login:", err);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = AlumniGoogleLogin;

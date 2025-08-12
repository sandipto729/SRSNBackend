const { OAuth2Client } = require('google-auth-library');
const { generateAlumniAccessToken, generateAlumniRefreshToken } = require('../../utilis/jwt');
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
            return res.status(400).json({ success: false, message: 'Alumni not found' });
        }

        // Generate alumni tokens
        const alumniAccessToken = generateAlumniAccessToken(alumni._id);
        const alumniRefreshToken = generateAlumniRefreshToken(alumni._id);

        // Save refresh token to alumni
        alumni.refreshToken = alumniRefreshToken;
        await alumni.save();

        res.json({
            success: true,
            message: "Google signin successful",
            Alumni: {
                id: alumni._id,
                name: alumni.name,
                email: alumni.email
            },
            alumniAccessToken,
            alumniRefreshToken
        });
    } catch (err) {
        console.error("Error in Google Login:", err);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = AlumniGoogleLogin;

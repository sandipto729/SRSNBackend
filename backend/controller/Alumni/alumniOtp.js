const AlumniModel = require('../../model/Alumni/alumniVeriModel');
const sendEmail = require('../../helper/Mail');
const bcrypt = require('bcrypt');
const { generateAlumniAccessToken, generateAlumniRefreshToken, verifyAlumniRefreshToken } = require('../../utilis/jwt');
const RedisClient = require('../../config/Redis'); 


const alumniLogin = async (req, res) => {
    try {
        const { email } = req.body;

        const alumni = await AlumniModel.findOne({ email });
        if (!alumni) {
            return res.status(400).json({ success: false, message: 'Alumni not found. Signup first.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        sendEmail(email, 'OTP', `Your OTP for login to the alumni portal is ${otp}`);

        const hashedOtp = await bcrypt.hash(otp, 10);

        await RedisClient.setEx(email,60*5,hashedOtp);

        res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Retrieve the hashed OTP from Redis
        const hashedOtp = await RedisClient.get(email);
        if (!hashedOtp) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found.' });
        }

        // Compare the provided OTP with the stored hashed OTP
        const isMatch = bcrypt.compareSync(otp, hashedOtp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        // Delete the OTP from Redis after successful validation
        await RedisClient.del(email);

        // Check if the alumni exists
        const alumni = await AlumniModel.findOne({ email });
        if (!alumni) {
            return res.status(400).json({ success: false, message: 'Alumni not found.' });
        }

        // Generate alumni tokens
        const alumniAccessToken = generateAlumniAccessToken(alumni._id);
        const alumniRefreshToken = generateAlumniRefreshToken(alumni._id);

        // Save refresh token to alumni
        alumni.refreshToken = alumniRefreshToken;
        await alumni.save();

        // Return successful response with tokens
        res.json({
            success: true,
            message: 'Signin successful.',
            Alumni: {
                id: alumni._id,
                name: alumni.name,
                email: alumni.email
            },
            alumniAccessToken,
            alumniRefreshToken
        });
    } catch (err) {
        console.error("Error during OTP verification:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const alumniRefreshToken = async (req, res) => {
  try {
    const { alumniRefreshToken } = req.body;

    if (!alumniRefreshToken) {
      return res.status(401).json({ success: false, message: 'Alumni refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyAlumniRefreshToken(alumniRefreshToken);
    const alumni = await AlumniModel.findById(decoded.alumniId);

    if (!alumni || alumni.refreshToken !== alumniRefreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid alumni refresh token' });
    }

    // Generate new access token, keep the same refresh token (do not rotate)
    // This avoids race conditions when multiple tabs/devices refresh simultaneously
    const newAlumniAccessToken = generateAlumniAccessToken(alumni._id);

    res.json({
      success: true,
      message: 'Alumni tokens refreshed successfully',
      alumniAccessToken: newAlumniAccessToken,
      alumniRefreshToken // return existing refresh token
    });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid alumni refresh token' });
  }
};

module.exports = { alumniLogin, verifyOtp, alumniRefreshToken };

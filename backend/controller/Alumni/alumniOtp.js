const AlumniModel = require('../../model/Alumni/alumniVeriModel');
const sendEmail = require('../../helper/Mail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

        // Generate a JWT token for the alumni
        const tokenData = { _id: alumni._id, email: alumni.email };
        const token = jwt.sign(
            { data: tokenData },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '3h' }
        );

        // Configure cookie options
        const tokenOptions = {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // Secure cookie for production
            sameSite: 'None' // Adjust based on environment
        };

        // Set the cookie and return a successful response
        res.cookie('alumnitoken', token, tokenOptions).json({
            success: true,
            message: 'Signin successful.',
            data: token, // Optionally include the token in the response
        });
    } catch (err) {
        console.error("Error during OTP verification:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

module.exports = verifyOtp;

module.exports = { alumniLogin, verifyOtp };

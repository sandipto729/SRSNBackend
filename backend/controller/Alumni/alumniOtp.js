const AlumniModel = require('../../model/Alumni/alumniVeriModel');
const sendEmail = require('../../helper/Mail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OTPStore = new Map(); // Use Redis or similar in production

let userEmail = ''; // Temporary storage for email

const alumniLogin = async (req, res) => {
    try {
        const { email } = req.body;

        const alumni = await AlumniModel.findOne({ email });
        if (!alumni) {
            return res.status(400).json({ success: false, message: 'Alumni not found. Signup first.' });
        }

        // Save the email temporarily (it will be used later in OTP verification)
        userEmail = email;

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        sendEmail(email, 'OTP', `Your OTP for login to the alumni portal is ${otp}`);

        // Hash the OTP and store it temporarily
        const hashedOtp = await bcrypt.hash(otp, 10);
        OTPStore.set(email, hashedOtp); // Store OTP (should expire, e.g., in Redis with TTL)

        res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Verify that the email matches the stored email
        if (email !== userEmail) {
            return res.status(400).json({ success: false, message: 'Email mismatch' });
        }

        const hashedOtp = OTPStore.get(email); // Retrieve hashed OTP
        if (!hashedOtp) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found.' });
        }

        const isMatch = bcrypt.compareSync(otp, hashedOtp); // Verify OTP
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        OTPStore.delete(email); // Remove OTP after successful verification

        const alumni = await AlumniModel.findOne({ email });
        if (!alumni) {
            return res.status(400).json({ success: false, message: 'Alumni not found.' });
        }

        // Generate JWT token
        const tokenData = {
            _id: alumni._id,
            email: alumni.email,
        };

        const token = jwt.sign(
            { data: tokenData },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '3h' }
        );

        // Set the token in an HTTP-only cookie
        const tokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.cookie('alumnitoken', token, tokenOptions).json({
            success: true,
            message: 'Signin successful.',
            data: token,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { alumniLogin, verifyOtp };

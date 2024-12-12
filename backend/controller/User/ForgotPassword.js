const UserModel = require('../../model/User/UserModel');
const sendEmail = require('../../helper/Mail');
const bcrypt = require('bcrypt');
const RedisClient = require('../../config/Redis');

const userLogin = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists in the database
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found. Please sign up first.' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP via email
        await sendEmail(email, 'OTP for Reset Password', `Your OTP for resetting your password on the portal is ${otp}`);

        // Hash OTP and store it in Redis
        const hashedOtp = await bcrypt.hash(otp, 10);
        const redisKey = `forgot_password_otp_${email}`;
        await RedisClient.setEx(redisKey, 60 * 5, hashedOtp); // OTP valid for 5 minutes

        res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to send OTP.', error: err.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Retrieve hashed OTP from Redis
        const redisKey = `forgot_password_otp_${email}`;
        const hashedOtp = await RedisClient.get(redisKey);
        if (!hashedOtp) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found.' });
        }

        // Compare provided OTP with hashed OTP
        const isMatch = bcrypt.compareSync(otp, hashedOtp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        // OTP verified; delete OTP from Redis
        await RedisClient.del(redisKey);

        res.status(200).json({ success: true, message: 'OTP verified.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to verify OTP.', error: err.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the user by email
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the new password is the same as the current password
        const isPasswordSame = bcrypt.compareSync(password, user.password);
        if (isPasswordSame) {
            return res.status(400).json({ success: false, message: 'New password cannot be the same as the old password' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        await UserModel.findOneAndUpdate({ email: email }, { password: hashedPassword });

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to reset password', error: err.message });
    }
};


module.exports = { userLogin, verifyOtp, resetPassword };

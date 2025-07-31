const User = require('../../model/User/UserModel');
async function userLogOut(req, res) {
    try {
        const user = await User.findById(req.user.id);
        user.refreshToken = null;
        await user.save();

        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = userLogOut;

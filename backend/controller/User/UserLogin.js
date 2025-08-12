const UserModelModel = require('../../model/User/UserModel');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utilis/jwt');


const UserModelLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const UserModel = await UserModelModel.findOne({ email: email });
        if (!UserModel) {
            return res.status(400).json({ success: false, message: 'UserModel not found' });
        }
        const isMatch = await bcrypt.compare(password, UserModel.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(UserModel._id);
        const refreshToken = generateRefreshToken(UserModel._id);

        // Save refresh token to UserModel
        UserModel.refreshToken = refreshToken;
        await UserModel.save();

        res.json({
            success: true,
            message: 'Login successful',
            UserModel: {
                id: UserModel._id,
                // UserModelname: UserModel.UserModelname,
                email: UserModel.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const UserModel = await UserModelModel.findById(decoded.userId);

    if (!UserModel || UserModel.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(UserModel._id);
    const newRefreshToken = generateRefreshToken(UserModel._id);

    // Update refresh token in database
    UserModel.refreshToken = newRefreshToken;
    await UserModel.save();

    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
};


module.exports = { UserModelLogin, refreshToken };


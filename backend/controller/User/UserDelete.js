// backend/controller/User/UserDelete.js
const UserModel = require('../../model/User/UserModel');

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = deleteUser;
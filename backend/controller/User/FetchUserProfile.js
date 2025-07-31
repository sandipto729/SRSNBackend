const UserModle=require('../../model/User/UserModel');

const fetchUserProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports=fetchUserProfile
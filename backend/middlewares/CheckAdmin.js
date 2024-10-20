const UserModel = require('../model/User/UserModel');

const CheckAdminMiddleWares = async (req, res, next) => {
    try {
        const UserId = req.user._id;
        const user = await UserModel.findById(UserId);
        if (user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Unauthorized user' });
        }
        next();
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

}
module.exports = CheckAdminMiddleWares;
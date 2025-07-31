const jwt = require('jsonwebtoken');
const UserModel = require('../model/User/UserModel');
const { verifyAccessToken } = require('../utilis/jwt');

async function authToken(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const decoded = verifyAccessToken(token);
    const user = await UserModel.findById(decoded.userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();

  }catch(err){
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = authToken;

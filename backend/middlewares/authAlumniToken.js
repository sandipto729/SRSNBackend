const { verifyAlumniAccessToken } = require('../utilis/jwt');
const AlumniModel = require('../model/Alumni/alumniVeriModel');

async function authToken(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: "No alumni token provided",
        data: [],
        error: true,
        success: false,
      });
    }

    const decoded = verifyAlumniAccessToken(token);
    const alumni = await AlumniModel.findById(decoded.alumniId).select('-refreshToken');
    
    if (!alumni) {
      return res.status(401).json({
        message: "Alumni token is not valid",
        data: [],
        error: true,
        success: false,
      });
    }

    req.alumniuser = alumni;
    console.log('Decoded Alumni User:', req.alumniuser);
    next();
  } catch (err) {
    // JWT errors (expired, invalid, etc.) should return 401 to trigger token refresh
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
      return res.status(401).json({
        message: "Alumni token expired or invalid. Please refresh your token.",
        data: [],
        error: true,
        success: false,
      });
    }
    // Other errors (database, etc.) return 500
    console.error('Alumni auth middleware error:', err);
    res.status(500).json({
      message: "An error occurred during alumni authentication",
      data: [],
      error: true,
      success: false,
    });
  }
}

module.exports = authToken;
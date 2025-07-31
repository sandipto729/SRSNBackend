const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY }
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

// Alumni-specific token functions
const generateAlumniAccessToken = (alumniId) => {
  if (!process.env.JWT_ALUMNI_ACCESS_SECRET) {
    throw new Error('JWT_ALUMNI_ACCESS_SECRET environment variable is not set');
  }
  return jwt.sign(
    { alumniId },
    process.env.JWT_ALUMNI_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ALUMNI_ACCESS_EXPIRY || '15m' }
  );
};

const generateAlumniRefreshToken = (alumniId) => {
  if (!process.env.JWT_ALUMNI_REFRESH_SECRET) {
    throw new Error('JWT_ALUMNI_REFRESH_SECRET environment variable is not set');
  }
  return jwt.sign(
    { alumniId },
    process.env.JWT_ALUMNI_REFRESH_SECRET,
    { expiresIn: process.env.JWT_ALUMNI_REFRESH_EXPIRY || '7d' }
  );
};

const verifyAlumniRefreshToken = (token) => {
  if (!process.env.JWT_ALUMNI_REFRESH_SECRET) {
    throw new Error('JWT_ALUMNI_REFRESH_SECRET environment variable is not set');
  }
  return jwt.verify(token, process.env.JWT_ALUMNI_REFRESH_SECRET);
};

const verifyAlumniAccessToken = (token) => {
  if (!process.env.JWT_ALUMNI_ACCESS_SECRET) {
    throw new Error('JWT_ALUMNI_ACCESS_SECRET environment variable is not set');
  }
  return jwt.verify(token, process.env.JWT_ALUMNI_ACCESS_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  generateAlumniAccessToken,
  generateAlumniRefreshToken,
  verifyAlumniRefreshToken,
  verifyAlumniAccessToken
};

const axios = require('axios');

const verifyTurnstile = async (req, res, next) => {
  const token = req.body.turnstileToken;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "CAPTCHA verification is required",
    });
  }

  try {
    const { data } = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: process.env.SiteSecretKey,
        response: token,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (data.success) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return res.status(500).json({
      success: false,
      message: "CAPTCHA verification service error",
    });
  }
};

module.exports = verifyTurnstile;

const verifyTurnstile = async (req, res, next) => {
  const token = req.body.turnstileToken;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "CAPTCHA verification is required",
    });
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.SiteSecretKey}&response=${token}`,
      }
    );

    const data = await response.json();

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

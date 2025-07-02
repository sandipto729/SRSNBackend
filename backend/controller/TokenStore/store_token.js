
const FcmToken = require("../../model/Token/TokenModel");
const mongoose = require("mongoose");

const saveFcmToken = async (req, res) => {
  try {
    const { token, userId, role, deviceInfo } = req.body;

    const tokenData = {
      token,
      role,
      deviceInfo,
      lastUsedAt: new Date(),
    };

    if (userId && mongoose.isValidObjectId(userId)) {
      tokenData.userId = userId;
    }

    const savedToken = await FcmToken.findOneAndUpdate(
      { token }, // match on token
      { $set: tokenData, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: savedToken });
  } catch (error) {
    console.error("🔴 Error saving FCM token:", error);
    res.status(500).json({ success: false, message: "Failed to save token" });
  }
};

module.exports = saveFcmToken;

const admin = require('../../firebase');
const TokenModel = require('../../model/Token/TokenModel');

const sendNotification = async (req, res) => {
    try {
        const { title, body } = req.body;
        const tokens = await TokenModel.find().distinct('token');

        const message = {
            notification: { title, body },
            tokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        response.responses.forEach((resp, idx) => {
            if (!resp.success && resp.error.code === 'messaging/registration-token-not-registered') {
                const invalidToken = message.tokens[idx];
                TokenModel.deleteOne({ token: invalidToken }).then(() =>
                    console.log(`🗑️ Removed invalid token: ${invalidToken}`)
                );
            }
        });
        res.send({ success: true, response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = sendNotification
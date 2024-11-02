const EventControlModel = require('../../model/EventControl/EventControlModel');

// Fetch admission status
const getAdmissionStatus = async (req, res) => {
    try {
        const eventControl = await EventControlModel.find();
        res.status(200).json({
            success: true,
            isAdmissionOngoing: eventControl.length ? eventControl[0].isAdmissionOngoing : false,
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update admission status
const updateAdmissionStatus = async (req, res) => {
    const { isAdmissionOngoing } = req.body;
    try {
        await EventControlModel.updateOne({}, { isAdmissionOngoing }, { upsert: true }); // upsert to create if doesn't exist
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { getAdmissionStatus, updateAdmissionStatus };

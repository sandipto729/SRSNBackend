const EventModel = require('../../../model/EventControl/EventControl');

const AdmissionFetch = async (req, res) => {
    try {
        const admission = await EventModel.findOne({ name: { $regex: /admission/i } });
        res.status(200).json({ success: true, admission });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}
module.exports = AdmissionFetch;
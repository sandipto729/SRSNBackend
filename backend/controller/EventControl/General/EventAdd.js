const EventModel = require('../../../model/EventControl/EventControl');

const EventAdd = async (req, res) => {
    try {
        const event = new EventModel(req.body);
        await event.save();
        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
module.exports = EventAdd;  
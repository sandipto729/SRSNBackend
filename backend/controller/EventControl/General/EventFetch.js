const EventModel = require('../../../model/EventControl/EventControl');

const EventFetch = async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json({ success: true, events });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = EventFetch;
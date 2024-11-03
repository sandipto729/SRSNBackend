const EventModel = require('../../../model/EventControl/EventControl');
const UserModel = require('../../../model/User/UserModel');

const EventEdit = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await UserModel.findById(userId);
        const { id } = req.body;

        const event = await EventModel.findById(id);
        event.isOngoing = !event.isOngoing;
        const changes = `${user.name} has updated on ${new Date().toISOString()}(admin)`;
        event.changes.unshift(changes);

        await event.save();

        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = EventEdit;

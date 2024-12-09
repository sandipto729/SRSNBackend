const EventModel = require('../../../model/EventControl/EventControl');

const Markssubmission = async (req, res) => {
    try {
        // Querying the database for documents that match the names
        const primary = await EventModel.findOne({ name: { $regex: /PrimaryResult/i } });
        const high = await EventModel.findOne({ name: { $regex: /HighResult/i } });

        // Validate if data was found
        if (!primary || !high) {
            return res.status(404).json({ success: false, message: 'One or both results not found.' });
        }

        // Respond with the data
        res.status(200).json({ success: true, primary, high });
    } catch (err) {
        // Log the error for debugging
        console.error('Error occurred while fetching event results:', err);

        // Send error response
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = Markssubmission;

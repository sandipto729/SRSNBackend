const EventModel=require('../../../model/EventControl/EventControl');

const MarksSubmissionFetch = async (req, res) => {
    try {
        const marksSubmission = await EventModel.findOne({ name: { $regex: /MarksSubmission/i } });
        res.status(200).json({ success: true, marksSubmission });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports =  MarksSubmissionFetch 
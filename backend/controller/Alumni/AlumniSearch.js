const AlumniModel = require('../../model/Alumni/alumniVeriModel');

const alumniSearch = async (req, res) => {
    try {
        const search = req.body.search;
        const alumni = await AlumniModel.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
                { currentState: { $regex: search, $options: 'i' } },
                { bioData: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                {startingYear: { $regex: search, $options: 'i' }},
                {endingYear: { $regex: search, $options: 'i' }},
            ]
        });

        res.status(200).json({ success: true, alumni });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = alumniSearch;
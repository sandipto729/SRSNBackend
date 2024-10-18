const alumniVeriModel = require('../../model/Alumni/alumniVeriModel');
const alumniTempModel = require('../../model/Alumni/alumniTempModel');
const sendEmail = require('./../../helper/Mail');

const alumniVeri = async (req, res) => {
    const responseFromAdmin = req.body.check === "true";
    const alumniId = req.body.ID;
    // console.log(responseFromAdmin, alumniId);

    try {
        const AlumniResult = await alumniTempModel.findById(alumniId);
        // console.log(AlumniResult);

        if (!AlumniResult) {
            return res.status(404).json({ success: false, message: 'Alumni not found' });
        }

        if (responseFromAdmin) {
            const newAlumniVeri = new alumniVeriModel(AlumniResult.toObject());
            await newAlumniVeri.save();
            await alumniTempModel.findByIdAndDelete(alumniId);
            await sendEmail(
                AlumniResult.email,
                'Alumni Application Accepted',
                'Congratulations! Your alumni application has been accepted.'
            );
            res.status(200).json({ success: true, message: 'Alumni admitted successfully' });
        } else {
            await alumniTempModel.findByIdAndDelete(alumniId);
            await sendEmail(
                AlumniResult.email,
                'Alumni Application Rejected',
                'We regret to inform you that your alumni application has been rejected.'
            );
            res.status(200).json({ success: true, message: 'Alumni application rejected' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = alumniVeri;


const alumniVeriModel = require('../../model/Alumni/alumniVeriModel');
const alumniTempModel = require('../../model/Alumni/alumniTempModel');
const sendEmail = require('./../../helper/Mail');

const alumniVeri = async (req, res) => {
    const responseFromAdmin = req.body.check === "true";
    const alumniId = req.body.ID;
    
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
                'Welcome to the Sri Ramakrishna Siksha Niketan Alumni Network!',
                `
                Dear ${AlumniResult.name},
            
                Congratulations! We are delighted to inform you that your application to join the Sri Ramakrishna Siksha Niketan Alumni Network has been accepted.
            
                As a valued member of our alumni community, you will have access to:
                - Networking opportunities with fellow alumni.
                - Invitations to alumni events and gatherings.
                - Updates about the school and its achievements.
                - Opportunities to contribute and stay involved in school initiatives.
            
                Your profile is now live on our platform, and you can begin exploring all the features available. Please feel free to update your profile and connect with other alumni.
                We look forward to welcoming you to the Sri Ramakrishna Siksha Niketan Alumni Network.
                If you have any questions or need assistance, please do not hesitate to reach out to us at sriramakrishnasikshaniketan@gmail.com.
            
                Thank you for staying connected with us. Together, we can continue to uphold the legacy of Sri Ramakrishna Siksha Niketan.
            
                Warm regards,
                Alumni Relations Team
                Sri Ramakrishna Siksha Niketan
                `
            );
            
            res.status(200).json({ success: true, message: 'Alumni admitted successfully' });
        } else {
            await alumniTempModel.findByIdAndDelete(alumniId);
            await sendEmail(
                AlumniResult.email,
                'Alumni Application Rejected',
                'We regret to inform you that your alumni application for Sri Ramakrishna Siksha Niketan has been rejected.'
            );
            res.status(200).json({ success: true, message: 'Alumni application rejected' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = alumniVeri;


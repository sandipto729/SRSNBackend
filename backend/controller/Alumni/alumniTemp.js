const alumniTempModel = require('../../model/Alumni/alumniTempModel');
const sendEmail = require('./../../helper/Mail');

const alumniTemp = async (req, res) => {
    const { name, startingYear, endingYear, designation, currentState, profilePic, bioData, socialMediaLinks, mobileNumber, email } = req.body;

    try {
        const tempAlumni = new alumniTempModel({
            name,
            startingYear:startingYear||2000,
            endingYear:endingYear||2000,
            designation: designation || 'Alumni', 
            currentState,
            profilePic,
            bioData,
            socialMediaLinks,
            mobileNumber,
            email
        });

        const result = await tempAlumni.save();
        sendEmail(email, 'Alumni Application', 'Thank you for applying for an alumni position. We will get back to you soon.');
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = alumniTemp;

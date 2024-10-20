const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
const createUserPDF = require('../../helper/PdfJenerator');

const userAdmissionSignUp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserAdmissionModel.findOne({ email: email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const userAdmission = await UserAdmissionModel.create(req.body);
        const pdfPath = await createUserPDF(userAdmission);

        res.download(pdfPath, `${user.name}_details.pdf`);
        
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = userAdmissionSignUp
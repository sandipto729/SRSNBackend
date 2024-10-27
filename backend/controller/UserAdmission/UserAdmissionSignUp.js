const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
const sendEmail = require('./../../helper/Mail');

const userAdmissionSignUp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserAdmissionModel.findOne({ email: email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const { rAddressSameAsPermanent, ...userAdmissionData } = req.body;

        if (rAddressSameAsPermanent == 'Yes') {
            userAdmissionData.rAddress = userAdmissionData.address;
            userAdmissionData.rCity = userAdmissionData.city;
            userAdmissionData.rDistrict = userAdmissionData.district;
            userAdmissionData.rMunicipality =userAdmissionData.municipality;
            userAdmissionData.rPanchayt = userAdmissionData.panchayt;
            userAdmissionData.rPostOffice = userAdmissionData.postOffice;
            userAdmissionData.rPoliceStation = userAdmissionData.policeStation;
            userAdmissionData.rPinCode = userAdmissionData.pinCode;
            userAdmissionData.rState = userAdmissionData.state;
            userAdmissionData.rCountry = userAdmissionData.country;
        }
        const userAdmission = await UserAdmissionModel.create(userAdmissionData);

        sendEmail(email, 'Admission Application', 'Thank you for applying for admission. Note that your application number is ' + userAdmission._id + '. We will get back to you soon.And continuously check the school notice for updates.');
        // const userAdmission = await UserAdmissionModel.create(req.body);
        res.status(200).json({ success: true, userAdmission });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = userAdmissionSignUp
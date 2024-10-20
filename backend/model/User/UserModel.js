const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    // Basic Info
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    dob: {
        type: String
    },
    dobRegNo: {
        type: String
    },
    socialCatagory: {
        type: String
    },
    socialCatagoryRegNo: {
        type: String
    },
    religion: {
        type: String
    },
    motherTongue: {
        type: String
    },
    nationality: {
        type: String
    },
    aadharNo: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    healthID: {
        type: String
    },
    grade: {
        type: String
    },

    // Previous School Year Details
    studentCode: {
        type: String
    },

    // Permanent Contact Details
    address: {
        type: String
    },
    city: {
        type: String
    },
    district: {
        type: String
    },
    municipality: {
        type: String
    },
    panchayt: {
        type: String
    },
    postOffice: {
        type: String
    },
    policeStation: {
        type: String
    },
    pinCode: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },

    // Residential Contact Details
    rAddress: {
        type: String
    },
    rCity: {
        type: String
    },
    rDistrict: {
        type: String
    },
    rMunicipality: {
        type: String
    },
    rPanchayt: {
        type: String
    },
    rPostOffice: {
        type: String
    },
    rPoliceStation: {
        type: String
    },
    rPinCode: {
        type: String
    },
    rState: {
        type: String
    },
    rCountry: {
        type: String
    },

    // Guardian Details
    fatherName: {
        type: String
    },
    motherName: {
        type: String
    },
    guardianName: {
        type: String
    },
    guardianRelation: {
        type: String
    },
    guardianPhone: {
        type: String
    },
    guardianEmail: {
        type: String
    },
    annualIncome: {
        type: String
    },
    guardianQualification: {
        type: String
    }
},{
    timestamps: true
});

module.exports = Mongoose.model('User', UserSchema);

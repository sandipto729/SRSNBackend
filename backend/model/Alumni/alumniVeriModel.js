const mongoose = require('mongoose');

const alumniVeriSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startingYear: {
        type: String,
        required: true
    },
    endingYear: {
        type: String,
        required: true
    },
    designation: {  
        type: String,
        required: true
    },
    currentState: {
        type: String,
        required: true
    },
    profilePic: {  
        type: String,
        required: true
    },
    bioData: {
        type: String,
        required: true
    },
    socialMediaLinks: {  
        type: [String]
    },
    mobileNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const alumniVeriModel = mongoose.model('alumniVeri', alumniVeriSchema);
module.exports = alumniVeriModel;
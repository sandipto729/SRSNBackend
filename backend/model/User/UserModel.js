const Mongoose = require('mongoose');
const {BeezSyllabus,AnkurSyllabus,KisholoySyllabus,C1Syllabus,C2Syllabus,C3Syllabus,C4Syllabus,C5Syllabus,C6Syllabus,C7Syllabus,C8Syllabus}=require('./../../helper/Class');

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
    refreshToken: {
        type: String
    },
    DateOfJoining:{
        type: String
    },
    Qualification:{
        type: String
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
        type: String,
        required: true
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
    firstSem: { 
        type: Mongoose.Schema.Types.Mixed, 
        default: {}
    },
    secondSem: { 
        type: Mongoose.Schema.Types.Mixed, 
        default: {}
    },
    endSem: { 
        type: Mongoose.Schema.Types.Mixed, 
        default: {}
    },
    result:{
        type:Number,
        default:1000
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



UserSchema.pre('save', async function (next) {
    if (this.isModified('grade')) {
      if (this.grade === 'Beez') {
          this.firstSem = BeezSyllabus;
          this.secondSem = BeezSyllabus;
          this.endSem = BeezSyllabus;
      }
      else if (this.grade === 'Ankur') {
        this.firstSem = AnkurSyllabus; 
        this.secondSem = AnkurSyllabus;
        this.endSem = AnkurSyllabus;
      }
      else if (this.grade === 'Kisholoy') {
        this.firstSem = KisholoySyllabus;
        this.secondSem = KisholoySyllabus;
        this.endSem = KisholoySyllabus;
      }
      else if (this.grade === '1') {
        this.firstSem = C1Syllabus; 
        this.secondSem = C1Syllabus;
        this.endSem = C1Syllabus;
      } else if (this.grade === '2') {
        this.firstSem = C2Syllabus; 
        this.secondSem = C2Syllabus;
        this.endSem = C2Syllabus;
      }
      else if (this.grade === '3') {
        this.firstSem = C3Syllabus; 
        this.secondSem = C3Syllabus;
        this.endSem = C3Syllabus;
      }
      else if (this.grade === '4') {
        this.firstSem = C4Syllabus; 
        this.secondSem = C4Syllabus;
        this.endSem = C4Syllabus;
      }
      else if(this.grade === '5'){
        this.firstSem = C5Syllabus; 
        this.secondSem = C5Syllabus;
        this.endSem = C5Syllabus;
      }
      else if(this.grade === '6'){
        this.firstSem = C6Syllabus; 
        this.secondSem = C6Syllabus;
        this.endSem = C6Syllabus;
      }
      else if(this.grade === '7'){
        this.firstSem = C7Syllabus; 
        this.secondSem = C7Syllabus;
        this.endSem = C7Syllabus;
      }
      else if(this.grade === '8'){
        this.firstSem = C8Syllabus; 
        this.secondSem = C8Syllabus;
        this.endSem = C8Syllabus;
      }
    }
    next();
  });

module.exports = Mongoose.model('User', UserSchema);

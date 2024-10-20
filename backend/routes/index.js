const express = require('express');
const router = express.Router();

//Middlewares AuthToken
const authCheck = require('./../middlewares/AuthToken');

//Check Role Middleware
const checkAdmin=require('../middlewares/CheckAdmin');
const checkTeacher=require('../middlewares/CheckTeacher');

//Alumni Controller
const alumniTemp = require('../controller/Alumni/alumniTemp');
const alumniVeri = require('../controller/Alumni/alumniVeri');
const alumniView = require('../controller/Alumni/AlumniView');
const alumniDetails = require('../controller/Alumni/alumniDetails');
const alumniDelete = require('../controller/Alumni/alumniDelete');


//User
const StudentFetch = require('../controller/User/StudentFetch');
const UserSignUp=require('../controller/User/UserSignUp');
const UserSignIn=require('../controller/User/UserLogin');
const UserProfile=require('../controller/User/FetchUserProfile');


//Student Admission
const UserAdmissionSignUp = require('../controller/User/UserAdmissionSignUp');




//Alumni Routes((add authcheck later********************))
router.post('/alumniTemp', alumniTemp);
router.post('/alumniVeri', alumniVeri);
router.get('/alumniView', alumniView);
router.put('/alumniDetails', alumniDetails);
router.delete('/alumniDelete', alumniDelete);

//User
router.get('/studentFetch', StudentFetch);//check auth check later *********
router.post('/userSignUp', UserSignUp);//check auth check later *********
router.post('/userSignIn', UserSignIn);
router.get('/userProfile',authCheck,UserProfile);

//Student Admission
router.post('/userAdmissionSignUp', UserAdmissionSignUp);


module.exports = router;
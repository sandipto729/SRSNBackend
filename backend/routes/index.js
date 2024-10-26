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
const alumniDelete = require('../controller/Alumni/alumniDelete');
const alumniSearch=require('../controller/Alumni/AlumniSearch');
const alumniApplicationView=require('../controller/Alumni/AlumniApplicationView');


//User
const StudentFetch = require('../controller/User/StudentFetch');
const UserSignUp=require('../controller/User/UserSignUp');
const UserSignIn=require('../controller/User/UserLogin');
const UserProfile=require('../controller/User/FetchUserProfile');
const UserEdit=require('../controller/User/UserEdit');
const TeacherFetch=require('../controller/User/Teacherfetch');
const logoutUser = require('../controller/User/UserLogout');
const userMarksSubmission=require('../controller/User/StudentMarksSubmission');


//Student Admission
const UserAdmissionSignUp = require('../controller/User/UserAdmissionSignUp');
const userChangeClass = require('./../controller/User/UserChangeClass');




//Alumni Routes((add authcheck later********************))
router.post('/alumniTempSave', alumniTemp);
router.post('/alumniVeri', alumniVeri);//anumni accept
router.get('/alumniView', alumniView);
router.delete('/alumniDelete', alumniDelete);//alumni deny
router.post('/alumniSearch',alumniSearch);
router.get('/alumniApplicationView',alumniApplicationView);//alumni aplication view

//User
router.get('/studentFetch', StudentFetch);//check auth check later *********
router.post('/userSignUp', UserSignUp);//check auth check later *********
router.post('/userSignIn', UserSignIn);
router.get('/userProfile',authCheck,UserProfile);
router.put('/userEdit',authCheck,UserEdit);
router.get('/teacherFetch',TeacherFetch);
router.post('/userLogout',authCheck,logoutUser);
router.put('/chnageYearClass',userChangeClass);//check auth check later *********

//Marks Submission
router.post('/userMarksSubmission',userMarksSubmission);

//Student Admission
router.post('/userAdmissionSignUp', UserAdmissionSignUp);


module.exports = router;
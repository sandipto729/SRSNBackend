const express = require('express');
const router = express.Router();

//Middlewares AuthToken
const authCheck = require('./../middlewares/authToken');
const authAlumni=require('./../middlewares/authAlumniToken');

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
const alumniOtp=require('../controller/Alumni/alumniOtp');
const alumniDetails=require('../controller/Alumni/AlumniDetails');
const alumniUpdateProfile=require('../controller/Alumni/alumniEdit');


//User
const StudentFetch = require('../controller/User/StudentFetch');
const UserSignUp=require('../controller/User/UserSignUp');
const UserSignIn=require('../controller/User/UserLogin');
const UserProfile=require('../controller/User/FetchUserProfile');
const UserEdit=require('../controller/User/UserEdit');
const TeacherFetch=require('../controller/User/Teacherfetch');
const logoutUser = require('../controller/User/UserLogout');
const userMarksSubmission=require('../controller/User/StudentMarksSubmission');
const deleteUser = require('../controller/User/UserDelete');
const userChangeClass = require('./../controller/User/UserChangeClass');
const UserResult=require('./../controller/User/CalculateResult');

//Student Admission
const UserAdmissionSignUp = require('../controller/UserAdmission/UserAdmissionSignUp');
const UserAdmissionFetch = require('../controller/UserAdmission/UserAdmissionfetch');
const UserApplicationAdd = require('../controller/UserAdmission/UserApplicationAdd');
const UserApplicationDelete = require('../controller/UserAdmission/UserAppicationDelete');

//News
const NoticeEntery = require('../controller/Notice/NoticeEntery');
const NoticeFetch = require('../controller/Notice/Noticefetch');
const NoticeDelete=require('../controller/Notice/NoticeDelete');

//Event Controller
const EventAdd = require('../controller/EventControl/General/EventAdd');
const AdmissionFetch=require('../controller/EventControl/Admission/AdmissionFetch');
const EventEdit=require('../controller/EventControl/General/EventEdit');
const MarksSubmissionFetch=require('../controller/EventControl/MarksSubmission/MarksSubmissionFetch');
const EventToggle=require('../controller/EventControl/General/EventToggle');
const EventFetch=require('../controller/EventControl/General/EventFetch');


//Message
const Message=require('./../controller/Message/Message');




//Alumni Routes((add authcheck later********************))
router.post('/alumniTempSave', alumniTemp);
router.post('/alumniVeri', alumniVeri);//anumni accept
router.get('/alumniView', alumniView);
router.delete('/alumniDelete', alumniDelete);//alumni deny
router.post('/alumniSearch',alumniSearch);
router.get('/alumniApplicationView',alumniApplicationView);//alumni aplication view
router.post('/alumniOtp',alumniOtp.alumniLogin);
router.post('/otpVerify',alumniOtp.verifyOtp);
router.get('/alumniDetails',authAlumni,alumniDetails);
router.put('/alumniUpdateProfile',authAlumni,alumniUpdateProfile);



//User
router.get('/studentFetch', StudentFetch);//check auth check later *********
router.post('/userSignUp', UserSignUp);//check auth check later *********
router.post('/userSignIn', UserSignIn);
router.get('/userProfile',authCheck,UserProfile);
router.put('/userEdit',authCheck,UserEdit);
router.get('/teacherFetch',TeacherFetch);
router.post('/userLogout',authCheck,logoutUser);
router.put('/chnageYearClass',userChangeClass);//check auth check later *********
router.delete('/deleteUser/:userId', deleteUser);

//Message
router.post('/message',Message);

//Marks Submission
router.post('/userMarksSubmission',authCheck,userMarksSubmission);

//get result
router.get('/getResult',UserResult);

//Student Admission
router.post('/userAdmissionSignUp', UserAdmissionSignUp);
router.get('/userAdmissionFetch', UserAdmissionFetch);
router.post('/userAdmissionAdd', UserApplicationAdd);
router.delete('/userAdmissionDelete', UserApplicationDelete);


//Notice(add auth later)
router.post('/noticeEntery',NoticeEntery);
router.get('/noticeFetch',NoticeFetch);
router.delete('/noticeDelete',NoticeDelete);

//Event Controller
router.post('/eventAdd',EventAdd);
router.get('/admissionFetch',AdmissionFetch);
router.put('/eventEdit',EventEdit);
router.get('/marksSubmissionFetch',MarksSubmissionFetch);
router.put('/eventToggle',authCheck,EventToggle);
router.get('/eventFetch',EventFetch);

module.exports = router;
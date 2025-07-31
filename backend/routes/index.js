const express = require('express');
const router = express.Router();

//Middlewares AuthToken
const authCheck = require('./../middlewares/authToken');
const authAlumni=require('./../middlewares/authAlumniToken');

//Check Role Middleware
const checkAdmin=require('../middlewares/CheckAdmin');
const checkTeacher=require('../middlewares/CheckTeacher');

//Token Store
const storeToken=require('./../controller/TokenStore/store_token');
const tokenMessage=require('./../controller/TokenStore/send_message');
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
const alumniLogOut=require('../controller/Alumni/alumniLogOut');
const alumniGoogleLogin=require('../controller/Alumni/AlumniGoogleLogin');


//User
const StudentFetch = require('../controller/User/StudentFetch');
const UserSignUp=require('../controller/User/UserSignUp');
const { UserModelLogin, refreshToken }=require('../controller/User/UserLogin');
const UserProfile=require('../controller/User/FetchUserProfile');
const UserEdit=require('../controller/User/UserEdit');
const TeacherFetch=require('../controller/User/Teacherfetch');
const logoutUser = require('../controller/User/UserLogout');
const userMarksSubmission=require('../controller/User/StudentMarksSubmission');
const deleteUser = require('../controller/User/UserDelete');
const userChangeClass = require('./../controller/User/UserChangeClass');
const UserResult=require('./../controller/User/CalculateResult');
const ForgotPassword=require('./../controller/User/ForgotPassword');
const UserGoogleLogin=require('./../controller/User/UserGoogleLogin');



//Student Admission
const UserAdmissionSignUp = require('../controller/UserAdmission/UserAdmissionSignUp');
const UserAdmissionFetch = require('../controller/UserAdmission/UserAdmissionfetch');
const UserApplicationAdd = require('../controller/UserAdmission/UserApplicationAdd');
const UserApplicationAddArray = require('../controller/UserAdmission/userApplicationAddArray');
const UserApplicationDelete = require('../controller/UserAdmission/UserAppicationDelete');
const userAdmissionSearch = require('../controller/UserAdmission/userAdmissionSearch');
const UserEditById=require('../controller/User/UserEditById');
//News
const NoticeEntery = require('../controller/Notice/NoticeEntery');
const NoticeFetch = require('../controller/Notice/Noticefetch');
const NoticeDelete=require('../controller/Notice/NoticeDelete');

//Event Controller
const EventAdd = require('../controller/EventControl/General/EventAdd');
const AdmissionFetch=require('../controller/EventControl/Admission/AdmissionFetch');
const EventEdit=require('../controller/EventControl/General/EventEdit');
const MarksSubmissionFetch=require('./../controller/EventControl/MarksSubmission/MarksSubmissionFetch');
const EventToggle=require('../controller/EventControl/General/EventToggle');
const EventFetch=require('../controller/EventControl/General/EventFetch');


//Message
const Message=require('./../controller/Message/Message');

//Blog 
const BlogAdd = require('./../controller/Blog/BlogCreate');
const BlogFetch = require('./../controller/Blog/Blogfetch');
const BlogDelete=require('./../controller/Blog/BlogDelete');





//token store fcm
router.post('/save-token', storeToken);
router.post('/token-send-message', tokenMessage);
//Alumni Routes((add authcheck later********************))
router.post('/alumniTempSave', alumniTemp);
router.post('/alumniVeri', alumniVeri);//anumni accept
router.get('/alumniView', alumniView);
router.delete('/alumniDelete', alumniDelete);//alumni deny
router.post('/alumniSearch',alumniSearch);
router.get('/alumniApplicationView',alumniApplicationView);//alumni aplication view
router.post('/alumniOtp',alumniOtp.alumniLogin);
router.post('/otpVerify',alumniOtp.verifyOtp);
router.post('/alumniRefreshToken', alumniOtp.alumniRefreshToken);
router.get('/alumniDetails',authAlumni,alumniDetails);
router.put('/alumniUpdateProfile',authAlumni,alumniUpdateProfile);
router.post('/alumniLogOut',authAlumni,alumniLogOut);
router.post('/alumniGoogleLogin',alumniGoogleLogin);


//User
router.get('/studentFetch', authCheck, StudentFetch);
router.post('/userSignUp', UserSignUp);//check auth check later *********
router.post('/userSignIn', UserModelLogin);
router.post('/refresh-token', refreshToken);
router.get('/userProfile',authCheck,UserProfile);
router.put('/userEdit',authCheck,UserEdit);
router.get('/teacherFetch', authCheck, TeacherFetch);
router.post('/userLogout',authCheck,logoutUser);
router.put('/chnageYearClass', authCheck, userChangeClass);
router.delete('/deleteUser/:userId', authCheck, deleteUser);
router.post('/forgotpasswordotpsend',ForgotPassword.userLogin);
router.post('/forgotpasswordotpverify',ForgotPassword.verifyOtp);
router.post('/resetpassword',ForgotPassword.resetPassword);
router.post('/userGoogleLogin',UserGoogleLogin);


//Message
router.post('/message',Message);

//Marks Submission
router.post('/userMarksSubmission',authCheck,userMarksSubmission);

//get result
router.get('/getResultPrimary', authCheck, UserResult.calculateResultBeezTo4);
router.get('/getResultHigh', authCheck, UserResult.calculateResult5To8);

//Student Admission
router.post('/userAdmissionSignUp', UserAdmissionSignUp);
router.get('/userAdmissionFetch', authCheck, UserAdmissionFetch);
router.post('/userAdmissionAdd', authCheck, UserApplicationAdd);
router.post('/userAdmissionAddArray', authCheck, UserApplicationAddArray);
router.delete('/userAdmissionDelete', authCheck, UserApplicationDelete);
router.post('/userAdmissionSearch',userAdmissionSearch);
router.put('/userEditById', authCheck, UserEditById);


//Notice(add auth later)
router.post('/noticeEntery', authCheck, NoticeEntery);
router.get('/noticeFetch',NoticeFetch);
router.delete('/noticeDelete', authCheck, NoticeDelete);

//Event Controller
router.post('/eventAdd', authCheck, EventAdd);
router.get('/admissionFetch',AdmissionFetch);
router.put('/eventEdit', authCheck, EventEdit);
router.get('/marksSubmissionFetch', authCheck, MarksSubmissionFetch);
router.put('/eventToggle',authCheck,EventToggle);
router.get('/eventFetch', authCheck, EventFetch);


//Blog
router.post('/blogAdd', authCheck, BlogAdd);
router.get('/blogFetch',BlogFetch);
router.delete('/blogDelete', authCheck, BlogDelete);

module.exports = router;
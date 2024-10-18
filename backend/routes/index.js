const express = require('express');
const router = express.Router();

const alumniTemp = require('../controller/Alumni/alumniTemp');
const alumniVeri = require('../controller/Alumni/alumniVeri');
const alumniView = require('../controller/Alumni/AlumniView');
const alumniDetails = require('../controller/Alumni/alumniDetails');
const alumniDelete = require('../controller/Alumni/alumniDelete');


//Alumni Routes
router.post('/alumniTemp', alumniTemp);
router.post('/alumniVeri', alumniVeri);
router.get('/alumniView', alumniView);
router.put('/alumniDetails', alumniDetails);
router.delete('/alumniDelete', alumniDelete);

module.exports = router;
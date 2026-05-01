const express = require('express');
const router = express.Router();
const {
  getMyProfile, updateMyProfile,
  getMyAppointments, getMyStats,
} = require('../controllers/patientController');
const { protect, restrictTo } = require('../middleware/auth');

// All patient routes are protected
router.use(protect, restrictTo('patient'));

router.get('/me/profile',       getMyProfile);
router.put('/me/profile',       updateMyProfile);
router.get('/me/appointments',  getMyAppointments);
router.get('/me/stats',         getMyStats);

module.exports = router;

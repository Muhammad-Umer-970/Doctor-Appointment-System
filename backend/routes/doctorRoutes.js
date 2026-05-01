const express = require('express');
const router = express.Router();
const {
  getAllDoctors, getDoctorById,
  getMyProfile, updateMyProfile, updateAvailability,
  getMyAppointments, updateAppointmentStatus, getMyStats,
} = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/auth');

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/',    getAllDoctors);    // GET /api/doctors
router.get('/:id', getDoctorById);   // GET /api/doctors/:id

// ── Protected: Doctor only ────────────────────────────────────────────────────
router.use(protect, restrictTo('doctor'));

router.get('/me/profile',                     getMyProfile);
router.put('/me/profile',                     updateMyProfile);
router.put('/me/availability',                updateAvailability);
router.get('/me/appointments',                getMyAppointments);
router.get('/me/stats',                       getMyStats);
router.put('/me/appointments/:id/status',     updateAppointmentStatus);

module.exports = router;

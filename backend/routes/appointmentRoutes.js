const express = require('express');
const router = express.Router();
const {
  bookAppointment, getAppointmentById, cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/auth');
const { appointmentRules, validate } = require('../middleware/validators');

// All appointment routes require login
router.use(protect);

// Patient: book
router.post('/', restrictTo('patient'), appointmentRules, validate, bookAppointment);

// Both roles: view single
router.get('/:id', getAppointmentById);

// Patient: cancel
router.delete('/:id', restrictTo('patient'), cancelAppointment);

module.exports = router;

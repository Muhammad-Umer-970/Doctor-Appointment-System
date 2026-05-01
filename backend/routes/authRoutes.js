const express = require('express');
const router = express.Router();
const {
  registerPatient, loginPatient,
  registerDoctor, loginDoctor,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  patientRegisterRules, doctorRegisterRules,
  loginRules, validate,
} = require('../middleware/validators');

// Patient auth
router.post('/patient/register', patientRegisterRules, validate, registerPatient);
router.post('/patient/login',    loginRules, validate, loginPatient);

// Doctor auth
router.post('/doctor/register',  doctorRegisterRules, validate, registerDoctor);
router.post('/doctor/login',     loginRules, validate, loginDoctor);

// Get current logged-in user (any role)
router.get('/me', protect, getMe);

module.exports = router;

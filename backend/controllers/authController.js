const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// ─── Generate JWT ─────────────────────────────────────────────────────────────
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sendTokenResponse = (user, role, statusCode, res) => {
  const token = generateToken(user._id, role);
  res.status(statusCode).json({
    success: true,
    token,
    user: { ...user.toJSON(), role },
  });
};

// ─── PATIENT REGISTER ─────────────────────────────────────────────────────────
// POST /api/auth/patient/register
const registerPatient = async (req, res, next) => {
  try {
    const { name, email, password, phone, age, gender, bloodGroup, address, medicalHistory } = req.body;

    // Check if email already used (check both collections)
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Email already registered as a doctor.' });
    }
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const patient = await Patient.create({
      name, email, password, phone, age, gender, bloodGroup, address, medicalHistory,
    });

    sendTokenResponse(patient, 'patient', 201, res);
  } catch (error) {
    next(error);
  }
};

// ─── PATIENT LOGIN ─────────────────────────────────────────────────────────────
// POST /api/auth/patient/login
const loginPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email }).select('+password');
    if (!patient) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!patient.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });
    }

    sendTokenResponse(patient, 'patient', 200, res);
  } catch (error) {
    next(error);
  }
};

// ─── DOCTOR REGISTER ──────────────────────────────────────────────────────────
// POST /api/auth/doctor/register
const registerDoctor = async (req, res, next) => {
  try {
    const {
      name, email, password, phone, specialization, qualification,
      experience, hospital, location, fee, bio,
    } = req.body;

    // Check both collections for email uniqueness
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: 'Email already registered as a patient.' });
    }
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const doctor = await Doctor.create({
      name, email, password, phone, specialization, qualification,
      experience, hospital, location, fee, bio,
    });

    sendTokenResponse(doctor, 'doctor', 201, res);
  } catch (error) {
    next(error);
  }
};

// ─── DOCTOR LOGIN ─────────────────────────────────────────────────────────────
// POST /api/auth/doctor/login
const loginDoctor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!doctor.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });
    }

    sendTokenResponse(doctor, 'doctor', 200, res);
  } catch (error) {
    next(error);
  }
};

// ─── GET CURRENT USER (me) ────────────────────────────────────────────────────
// GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: { ...req.user.toJSON(), role: req.userRole },
  });
};

module.exports = { registerPatient, loginPatient, registerDoctor, loginDoctor, getMe };

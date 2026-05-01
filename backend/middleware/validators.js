const { body, validationResult } = require('express-validator');

// Helper to run validation and return errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Patient registration validation rules
const patientRegisterRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('gender').optional().isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender value'),
  body('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).withMessage('Invalid blood group'),
];

// Doctor registration validation rules
const doctorRegisterRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('qualification').trim().notEmpty().withMessage('Qualification is required'),
  body('experience').isNumeric().withMessage('Experience must be a number').isInt({ min: 0 }).withMessage('Experience cannot be negative'),
  body('hospital').trim().notEmpty().withMessage('Hospital/Clinic name is required'),
  body('fee').isNumeric().withMessage('Fee must be a number').isFloat({ min: 0 }).withMessage('Fee cannot be negative'),
];

// Login validation rules
const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Appointment booking validation
const appointmentRules = [
  body('doctorId').notEmpty().withMessage('Doctor ID is required').isMongoId().withMessage('Invalid doctor ID'),
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientEmail').isEmail().withMessage('Valid patient email is required'),
  body('patientPhone').trim().notEmpty().withMessage('Patient phone is required'),
  body('date').notEmpty().withMessage('Date is required').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('time').trim().notEmpty().withMessage('Time slot is required'),
];

module.exports = {
  validate,
  patientRegisterRules,
  doctorRegisterRules,
  loginRules,
  appointmentRules,
};

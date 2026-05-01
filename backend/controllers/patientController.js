const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// GET /api/patients/profile — patient: get own profile
const getMyProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user._id).select('-password');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    res.status(200).json({ success: true, patient });
  } catch (error) {
    next(error);
  }
};

// PUT /api/patients/profile — patient: update own profile
const updateMyProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'age', 'gender', 'bloodGroup', 'address', 'medicalHistory'];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Prevent email/password update through this route
    delete updates.email;
    delete updates.password;

    const patient = await Patient.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    res.status(200).json({ success: true, message: 'Profile updated successfully.', patient });
  } catch (error) {
    next(error);
  }
};

// GET /api/patients/appointments — patient: get own appointments
const getMyAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { patient: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('doctor', 'name specialization hospital location fee availability rating')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Appointment.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, total, appointments });
  } catch (error) {
    next(error);
  }
};

// GET /api/patients/stats — patient: dashboard summary
const getMyStats = async (req, res, next) => {
  try {
    const patientId = req.user._id;
    const [total, pending, confirmed, completed, cancelled, uniqueDoctors] = await Promise.all([
      Appointment.countDocuments({ patient: patientId }),
      Appointment.countDocuments({ patient: patientId, status: 'Pending' }),
      Appointment.countDocuments({ patient: patientId, status: 'Confirmed' }),
      Appointment.countDocuments({ patient: patientId, status: 'Completed' }),
      Appointment.countDocuments({ patient: patientId, status: 'Cancelled' }),
      Appointment.distinct('doctor', { patient: patientId }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        doctorsVisited: uniqueDoctors.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfile, updateMyProfile, getMyAppointments, getMyStats };

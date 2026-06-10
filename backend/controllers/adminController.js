const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// ─── Generate JWT ─────────────────────────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
// POST /api/admin/login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin account deactivated.' });
    }

    const token = generateToken(admin._id, 'admin');
    res.status(200).json({
      success: true,
      token,
      user: { ...admin.toJSON(), role: 'admin' },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalDoctors, totalPatients, totalAppointments,
      pendingAppointments, confirmedAppointments,
      completedAppointments, cancelledAppointments] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Confirmed' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments({ status: 'Cancelled' }),
    ]);

    // Recent 7 days appointments
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        recentAppointments,
        byStatus: {
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL DOCTORS ──────────────────────────────────────────────────────────
// GET /api/admin/doctors
const getAllDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', isActive } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const total = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL PATIENTS ─────────────────────────────────────────────────────────
// GET /api/admin/patients
const getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', isActive } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      patients,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL APPOINTMENTS ─────────────────────────────────────────────────────
// GET /api/admin/appointments
const getAllAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { patientEmail: { $regex: search, $options: 'i' } },
    ];

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization email')
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// ─── TOGGLE DOCTOR STATUS ─────────────────────────────────────────────────────
// PUT /api/admin/doctors/:id/toggle-status
const toggleDoctorStatus = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    doctor.isActive = !doctor.isActive;
    await doctor.save();
    res.status(200).json({
      success: true,
      message: `Doctor ${doctor.isActive ? 'activated' : 'deactivated'} successfully.`,
      isActive: doctor.isActive,
    });
  } catch (error) {
    next(error);
  }
};

// ─── TOGGLE PATIENT STATUS ────────────────────────────────────────────────────
// PUT /api/admin/patients/:id/toggle-status
const togglePatientStatus = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    patient.isActive = !patient.isActive;
    await patient.save();
    res.status(200).json({
      success: true,
      message: `Patient ${patient.isActive ? 'activated' : 'deactivated'} successfully.`,
      isActive: patient.isActive,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE DOCTOR ────────────────────────────────────────────────────────────
// DELETE /api/admin/doctors/:id
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    // Also remove their appointments
    await Appointment.deleteMany({ doctor: req.params.id });
    res.status(200).json({ success: true, message: 'Doctor deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE PATIENT ───────────────────────────────────────────────────────────
// DELETE /api/admin/patients/:id
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    await Appointment.deleteMany({ patient: req.params.id });
    res.status(200).json({ success: true, message: 'Patient deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE APPOINTMENT STATUS ────────────────────────────────────────────────
// PUT /api/admin/appointments/:id/status
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('doctor', 'name').populate('patient', 'name');
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.status(200).json({ success: true, message: 'Appointment status updated.', appointment: appt });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE APPOINTMENT ───────────────────────────────────────────────────────
// DELETE /api/admin/appointments/:id
const deleteAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.findByIdAndDelete(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.status(200).json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── SEED DEFAULT ADMIN (utility) ────────────────────────────────────────────
// POST /api/admin/seed  (only works if no admin exists)
const seedAdmin = async (req, res, next) => {
  try {
    const existing = await Admin.findOne({});
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists.' });
    }
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@medicare.com',
      password: 'admin123',
    });
    res.status(201).json({
      success: true,
      message: 'Default admin created.',
      credentials: { email: admin.email, password: 'admin123' },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin, getStats,
  getAllDoctors, getAllPatients, getAllAppointments,
  toggleDoctorStatus, togglePatientStatus,
  deleteDoctor, deletePatient,
  updateAppointmentStatus, deleteAppointment,
  seedAdmin,
};

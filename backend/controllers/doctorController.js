const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// GET /api/doctors — public, list all active doctors
const getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (specialization) filter.specialization = specialization;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospital: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [doctors, total] = await Promise.all([
      Doctor.find(filter).select('-password').skip(skip).limit(Number(limit)).sort({ rating: -1, createdAt: -1 }),
      Doctor.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/:id — public, single doctor
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/profile — doctor: get own full profile
const getMyProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user._id).select('-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// PUT /api/doctors/profile — doctor: update own profile
const updateMyProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'phone', 'specialization', 'qualification',
      'experience', 'hospital', 'location', 'fee', 'bio', 'availability',
    ];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const doctor = await Doctor.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });

    res.status(200).json({ success: true, message: 'Profile updated successfully.', doctor });
  } catch (error) {
    next(error);
  }
};

// PUT /api/doctors/availability — doctor: update availability slots
const updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    if (!Array.isArray(availability)) {
      return res.status(400).json({ success: false, message: 'Availability must be an array.' });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.user._id,
      { $set: { availability } },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, message: 'Availability updated.', doctor });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/appointments — doctor: get own appointments
const getMyAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { doctor: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('patient', 'name email phone age gender bloodGroup')
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

// PUT /api/doctors/appointments/:id/status — doctor: confirm/complete appointment
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Confirmed', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot update a cancelled appointment.' });
    }

    appointment.status = status;
    if (status === 'Cancelled') {
      appointment.cancelledBy = 'doctor';
      appointment.cancelReason = req.body.cancelReason || '';
    }
    await appointment.save();

    // Increment totalPatients on first completion
    if (status === 'Completed') {
      await Doctor.findByIdAndUpdate(req.user._id, { $inc: { totalPatients: 1 } });
    }

    res.status(200).json({ success: true, message: `Appointment marked as ${status}.`, appointment });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/stats — doctor: dashboard stats
const getMyStats = async (req, res, next) => {
  try {
    const doctorId = req.user._id;
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Appointment.countDocuments({ doctor: doctorId }),
      Appointment.countDocuments({ doctor: doctorId, status: 'Pending' }),
      Appointment.countDocuments({ doctor: doctorId, status: 'Confirmed' }),
      Appointment.countDocuments({ doctor: doctorId, status: 'Completed' }),
      Appointment.countDocuments({ doctor: doctorId, status: 'Cancelled' }),
    ]);

    res.status(200).json({
      success: true,
      stats: { total, pending, confirmed, completed, cancelled },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getMyProfile,
  updateMyProfile,
  updateAvailability,
  getMyAppointments,
  updateAppointmentStatus,
  getMyStats,
};

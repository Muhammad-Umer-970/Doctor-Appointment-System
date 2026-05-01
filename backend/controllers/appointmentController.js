const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// POST /api/appointments — patient: book appointment
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, patientName, patientEmail, patientPhone, date, time, notes } = req.body;

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: 'Doctor not found or unavailable.' });
    }

    // Prevent duplicate booking (same patient, doctor, date, time)
    const duplicate = await Appointment.findOne({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      status: { $in: ['Pending', 'Confirmed'] },
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'You already have an appointment with this doctor at the selected date and time.',
      });
    }

    // Validate date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ success: false, message: 'Appointment date cannot be in the past.' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      patientName,
      patientEmail,
      patientPhone,
      date,
      time,
      notes: notes || '',
    });

    // Populate doctor info before responding
    await appointment.populate('doctor', 'name specialization hospital');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/appointments/:id — get single appointment (owner or doctor)
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialization hospital phone')
      .populate('patient', 'name email phone age gender');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Only the patient or the doctor involved can view
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctor = appointment.doctor._id.toString() === req.user._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/appointments/:id — patient: cancel appointment
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (['Cancelled', 'Completed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an appointment that is already ${appointment.status.toLowerCase()}.`,
      });
    }

    appointment.status = 'Cancelled';
    appointment.cancelledBy = 'patient';
    appointment.cancelReason = req.body.reason || '';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment cancelled successfully.', appointment });
  } catch (error) {
    next(error);
  }
};

module.exports = { bookAppointment, getAppointmentById, cancelAppointment };

const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuth');
const {
  adminLogin, getStats,
  getAllDoctors, getAllPatients, getAllAppointments,
  toggleDoctorStatus, togglePatientStatus,
  deleteDoctor, deletePatient,
  updateAppointmentStatus, deleteAppointment,
  seedAdmin,
} = require('../controllers/adminController');

// ✅ PUBLIC routes — no token needed
router.post('/login', adminLogin);
router.post('/seed', seedAdmin);
router.get('/seed', seedAdmin); // ← ADD THIS so browser GET works too

// 🔒 Protected routes — need admin token
router.use(adminProtect);

router.get('/stats', getStats);

router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/toggle-status', toggleDoctorStatus);
router.delete('/doctors/:id', deleteDoctor);

router.get('/patients', getAllPatients);
router.put('/patients/:id/toggle-status', togglePatientStatus);
router.delete('/patients/:id', deletePatient);

router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.delete('/appointments/:id', deleteAppointment);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { adminProtect } = require('../middleware/adminAuth');
// const {
//   adminLogin, getStats,
//   getAllDoctors, getAllPatients, getAllAppointments,
//   toggleDoctorStatus, togglePatientStatus,
//   deleteDoctor, deletePatient,
//   updateAppointmentStatus, deleteAppointment,
//   seedAdmin,
// } = require('../controllers/adminController');

// // Public — login & seed
// router.post('/login', adminLogin);
// router.post('/seed', seedAdmin); // Run once to create first admin

// // Protected — all routes below require admin JWT
// router.use(adminProtect);

// router.get('/stats', getStats);

// router.get('/doctors', getAllDoctors);
// router.put('/doctors/:id/toggle-status', toggleDoctorStatus);
// router.delete('/doctors/:id', deleteDoctor);

// router.get('/patients', getAllPatients);
// router.put('/patients/:id/toggle-status', togglePatientStatus);
// router.delete('/patients/:id', deletePatient);

// router.get('/appointments', getAllAppointments);
// router.put('/appointments/:id/status', updateAppointmentStatus);
// router.delete('/appointments/:id', deleteAppointment);

// module.exports = router;

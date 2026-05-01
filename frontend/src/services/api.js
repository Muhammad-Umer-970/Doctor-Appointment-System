import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear storage and redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  patientRegister: (data) => API.post('/auth/patient/register', data),
  patientLogin:    (data) => API.post('/auth/patient/login', data),
  doctorRegister:  (data) => API.post('/auth/doctor/register', data),
  doctorLogin:     (data) => API.post('/auth/doctor/login', data),
  getMe:           ()     => API.get('/auth/me'),
};

// ── Doctors ───────────────────────────────────────────────────────────────────
export const doctorAPI = {
  getAll:               (params) => API.get('/doctors', { params }),
  getById:              (id)     => API.get(`/doctors/${id}`),
  getMyProfile:         ()       => API.get('/doctors/me/profile'),
  updateMyProfile:      (data)   => API.put('/doctors/me/profile', data),
  updateAvailability:   (data)   => API.put('/doctors/me/availability', data),
  getMyAppointments:    (params) => API.get('/doctors/me/appointments', { params }),
  updateAppointmentStatus: (id, data) => API.put(`/doctors/me/appointments/${id}/status`, data),
  getMyStats:           ()       => API.get('/doctors/me/stats'),
};

// ── Patients ──────────────────────────────────────────────────────────────────
export const patientAPI = {
  getMyProfile:      ()       => API.get('/patients/me/profile'),
  updateMyProfile:   (data)   => API.put('/patients/me/profile', data),
  getMyAppointments: (params) => API.get('/patients/me/appointments', { params }),
  getMyStats:        ()       => API.get('/patients/me/stats'),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentAPI = {
  book:   (data) => API.post('/appointments', data),
  getOne: (id)   => API.get(`/appointments/${id}`),
  cancel: (id, data) => API.delete(`/appointments/${id}`, { data }),
};

export default API;

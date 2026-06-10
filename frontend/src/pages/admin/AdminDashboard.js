import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../services/api';

// ─── Admin API helper ─────────────────────────────────────────────────────────
const adminAPI = {
  getStats: () => API.get('/admin/stats', {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  getDoctors: (params) => API.get('/admin/doctors', {
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  getPatients: (params) => API.get('/admin/patients', {
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  getAppointments: (params) => API.get('/admin/appointments', {
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  toggleDoctorStatus: (id) => API.put(`/admin/doctors/${id}/toggle-status`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  togglePatientStatus: (id) => API.put(`/admin/patients/${id}/toggle-status`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  deleteDoctor: (id) => API.delete(`/admin/doctors/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  deletePatient: (id) => API.delete(`/admin/patients/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  updateAppointmentStatus: (id, status) => API.put(`/admin/appointments/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
  deleteAppointment: (id) => API.delete(`/admin/appointments/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    Pending:   'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination & search state
  const [doctorPage, setDoctorPage] = useState(1);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorPages, setDoctorPages] = useState(1);

  const [patientPage, setPatientPage] = useState(1);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientPages, setPatientPages] = useState(1);

  const [apptPage, setApptPage] = useState(1);
  const [apptStatus, setApptStatus] = useState('');
  const [apptSearch, setApptSearch] = useState('');
  const [apptPages, setApptPages] = useState(1);

  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.info('Logged out from admin.');
    navigate('/admin/login');
  };

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.stats);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login');
    }
  }, [navigate]);

  // Load doctors
  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDoctors({ page: doctorPage, search: doctorSearch, limit: 8 });
      setDoctors(res.data.doctors);
      setDoctorPages(res.data.pages);
    } catch (err) {
      toast.error('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  }, [doctorPage, doctorSearch]);

  // Load patients
  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPatients({ page: patientPage, search: patientSearch, limit: 8 });
      setPatients(res.data.patients);
      setPatientPages(res.data.pages);
    } catch (err) {
      toast.error('Failed to load patients.');
    } finally {
      setLoading(false);
    }
  }, [patientPage, patientSearch]);

  // Load appointments
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAppointments({ page: apptPage, status: apptStatus, search: apptSearch, limit: 8 });
      setAppointments(res.data.appointments);
      setApptPages(res.data.pages);
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, [apptPage, apptStatus, apptSearch]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (tab === 'doctors') loadDoctors(); }, [tab, loadDoctors]);
  useEffect(() => { if (tab === 'patients') loadPatients(); }, [tab, loadPatients]);
  useEffect(() => { if (tab === 'appointments') loadAppointments(); }, [tab, loadAppointments]);

  // Actions
  const handleToggleDoctor = async (id, name) => {
    try {
      const res = await adminAPI.toggleDoctorStatus(id);
      toast.success(res.data.message);
      loadDoctors();
      loadStats();
    } catch { toast.error('Failed to update doctor status.'); }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Delete Dr. ${name}? This will also remove their appointments.`)) return;
    try {
      await adminAPI.deleteDoctor(id);
      toast.success('Doctor deleted.');
      loadDoctors();
      loadStats();
    } catch { toast.error('Failed to delete doctor.'); }
  };

  const handleTogglePatient = async (id) => {
    try {
      const res = await adminAPI.togglePatientStatus(id);
      toast.success(res.data.message);
      loadPatients();
    } catch { toast.error('Failed to update patient status.'); }
  };

  const handleDeletePatient = async (id, name) => {
    if (!window.confirm(`Delete patient ${name}? This will also remove their appointments.`)) return;
    try {
      await adminAPI.deletePatient(id);
      toast.success('Patient deleted.');
      loadPatients();
      loadStats();
    } catch { toast.error('Failed to delete patient.'); }
  };

  const handleApptStatus = async (id, status) => {
    try {
      await adminAPI.updateAppointmentStatus(id, status);
      toast.success('Status updated.');
      loadAppointments();
      loadStats();
    } catch { toast.error('Failed to update status.'); }
  };

  const handleDeleteAppt = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await adminAPI.deleteAppointment(id);
      toast.success('Appointment deleted.');
      loadAppointments();
      loadStats();
    } catch { toast.error('Failed to delete appointment.'); }
  };

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'doctors', label: '👨‍⚕️ Doctors' },
    { key: 'patients', label: '🧑‍🤝‍🧑 Patients' },
    { key: 'appointments', label: '📅 Appointments' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white text-lg">
              🛡️
            </div>
            <div>
              <span className="font-black text-gray-900 text-lg">
                Medi<span className="text-purple-600">Care+</span>
              </span>
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                ADMIN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{admin.name || 'Admin'}</p>
              <p className="text-xs text-gray-400">{admin.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5">Dashboard Overview</h2>
            {stats ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon="👨‍⚕️" label="Total Doctors" value={stats.totalDoctors} color="bg-teal-100" />
                  <StatCard icon="🧑‍🤝‍🧑" label="Total Patients" value={stats.totalPatients} color="bg-blue-100" />
                  <StatCard icon="📅" label="Total Appointments" value={stats.totalAppointments}
                    sub={`${stats.recentAppointments} in last 7 days`} color="bg-purple-100" />
                  <StatCard icon="⏳" label="Pending" value={stats.byStatus.pending} color="bg-yellow-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon="✅" label="Confirmed" value={stats.byStatus.confirmed} color="bg-green-100" />
                  <StatCard icon="🏁" label="Completed" value={stats.byStatus.completed} color="bg-indigo-100" />
                  <StatCard icon="❌" label="Cancelled" value={stats.byStatus.cancelled} color="bg-red-100" />
                </div>
              </>
            ) : (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* ── DOCTORS ── */}
        {tab === 'doctors' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-black text-gray-900">Manage Doctors</h2>
              <input
                type="text"
                placeholder="🔍 Search by name, email, specialization…"
                value={doctorSearch}
                onChange={(e) => { setDoctorSearch(e.target.value); setDoctorPage(1); }}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-full sm:w-72"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Name', 'Email', 'Specialization', 'Experience', 'Fee', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {doctors.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-10 text-gray-400">No doctors found.</td></tr>
                      ) : doctors.map(doc => (
                        <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{doc.name}</td>
                          <td className="px-4 py-3 text-gray-500">{doc.email}</td>
                          <td className="px-4 py-3">
                            <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              {doc.specialization}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{doc.experience} yr{doc.experience !== 1 ? 's' : ''}</td>
                          <td className="px-4 py-3 text-gray-700 font-medium">PKR {doc.fee?.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${doc.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {doc.isActive ? '● Active' : '● Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleDoctor(doc._id, doc.name)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                  doc.isActive
                                    ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                {doc.isActive ? '⏸ Deactivate' : '▶ Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {doctorPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
                    <button onClick={() => setDoctorPage(p => Math.max(1, p - 1))} disabled={doctorPage === 1}
                      className="px-3 py-1 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                    <span className="text-sm text-gray-500">Page {doctorPage} of {doctorPages}</span>
                    <button onClick={() => setDoctorPage(p => Math.min(doctorPages, p + 1))} disabled={doctorPage === doctorPages}
                      className="px-3 py-1 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50">Next →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PATIENTS ── */}
        {tab === 'patients' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-black text-gray-900">Manage Patients</h2>
              <input
                type="text"
                placeholder="🔍 Search by name or email…"
                value={patientSearch}
                onChange={(e) => { setPatientSearch(e.target.value); setPatientPage(1); }}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-full sm:w-72"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Name', 'Email', 'Phone', 'Age', 'Gender', 'Blood', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {patients.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-10 text-gray-400">No patients found.</td></tr>
                      ) : patients.map(pat => (
                        <tr key={pat._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{pat.name}</td>
                          <td className="px-4 py-3 text-gray-500">{pat.email}</td>
                          <td className="px-4 py-3 text-gray-500">{pat.phone}</td>
                          <td className="px-4 py-3 text-gray-500">{pat.age || '—'}</td>
                          <td className="px-4 py-3 text-gray-500">{pat.gender || '—'}</td>
                          <td className="px-4 py-3">
                            {pat.bloodGroup ? (
                              <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">{pat.bloodGroup}</span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {pat.isActive ? '● Active' : '● Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleTogglePatient(pat._id)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                  pat.isActive
                                    ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                {pat.isActive ? '⏸ Deactivate' : '▶ Activate'}
                              </button>
                              <button
                                onClick={() => handleDeletePatient(pat._id, pat.name)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {patientPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
                    <button onClick={() => setPatientPage(p => Math.max(1, p - 1))} disabled={patientPage === 1}
                      className="px-3 py-1 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                    <span className="text-sm text-gray-500">Page {patientPage} of {patientPages}</span>
                    <button onClick={() => setPatientPage(p => Math.min(patientPages, p + 1))} disabled={patientPage === patientPages}
                      className="px-3 py-1 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50">Next →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── APPOINTMENTS ── */}
        {tab === 'appointments' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-black text-gray-900">Manage Appointments</h2>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="🔍 Search patient…"
                  value={apptSearch}
                  onChange={(e) => { setApptSearch(e.target.value); setApptPage(1); }}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-44"
                />
                <select
                  value={apptStatus}
                  onChange={(e) => { setApptStatus(e.target.value); setApptPage(1); }}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Patient', 'Doctor', 'Date & Time', 'Status', 'Change Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-10 text-gray-400">No appointments found.</td></tr>
                      ) : appointments.map(appt => (
                        <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">{appt.patientName}</p>
                            <p className="text-xs text-gray-400">{appt.patientEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">{appt.doctor?.name || '—'}</p>
                            <p className="text-xs text-teal-600">{appt.doctor?.specialization}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">{appt.date}</p>
                            <p className="text-xs text-gray-400">{appt.time}</p>
                          </td>
                          <td className="px-4 py-3"><Badge status={appt.status} /></td>
                          <td className="px-4 py-3">
                            <select
                              value={appt.status}
                              onChange={(e) => handleApptStatus(appt._id, e.target.value)}
                              className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-300"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteAppt(appt._id)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {apptPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
                    <button onClick={() => setApptPage(p => Math.max(1, p - 1))} disabled={apptPage === 1}
                      className="px-3 py-1 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                    <span className="text-sm text-gray-500">Page {apptPage} of {apptPages}</span>
                    <button onClick={() => setApptPage(p => Math.min(apptPages, p + 1))} disabled={apptPage === apptPages}
                      className="px-3 py-1 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50">Next →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI, appointmentAPI } from '../../services/api';
import { Card, StatCard, StatusBadge, Button, Avatar, PageLoader, EmptyState } from '../../components/common/UI';
import { toast } from 'react-toastify';

const TABS = [
  { id: 'overview',      label: 'Overview',       icon: '📊' },
  { id: 'appointments',  label: 'Appointments',    icon: '📅' },
  { id: 'profile',       label: 'My Profile',      icon: '👤' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [tab, setTab]                   = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, statsRes] = await Promise.all([
        patientAPI.getMyAppointments(),
        patientAPI.getMyStats(),
      ]);
      setAppointments(apptRes.data.appointments);
      setStats(statsRes.data.stats);
    } catch {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      toast.success('Appointment cancelled.');
      fetchData();
    } catch {
      toast.error('Failed to cancel appointment.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 hidden md:flex flex-col pt-6 pb-4 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        <div className="px-4 pb-5 border-b border-gray-700">
          <Avatar name={user?.name || ''} size="md" color="blue" />
          <div className="mt-2.5">
            <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded-full text-xs font-bold">Patient</span>
          </div>
        </div>
        <nav className="px-3 mt-4 space-y-1 flex-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${tab === t.id ? 'bg-blue-600/25 text-blue-300' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="px-3 pt-4 border-t border-gray-700">
          <Link to="/doctors" className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 no-underline">
            🔍 Find Doctors
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl">
        {loading ? <PageLoader /> : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                  <p className="text-gray-500 text-sm mt-1">Here's your health activity at a glance.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <StatCard label="Total Appointments" value={stats?.total ?? 0}       icon="📅" color="blue" />
                  <StatCard label="Upcoming"           value={stats?.confirmed ?? 0}   icon="⏰" color="teal" />
                  <StatCard label="Doctors Visited"    value={stats?.doctorsVisited ?? 0} icon="👨‍⚕️" color="purple" />
                </div>

                {/* Recent appointments */}
                <Card className="overflow-hidden" hover={false}>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">Recent Appointments</h2>
                    <button onClick={() => setTab('appointments')} className="text-sm text-blue-600 font-semibold hover:underline">View all →</button>
                  </div>
                  {appointments.length === 0 ? (
                    <EmptyState icon="📅" title="No appointments yet"
                      message="Book your first appointment with one of our specialists."
                      action={<Link to="/doctors"><Button variant="primary">🔍 Find a Doctor</Button></Link>}
                    />
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {appointments.slice(0, 5).map(a => (
                        <div key={a._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{a.doctor?.name}</p>
                            <p className="text-xs text-gray-500">{a.date} · {a.time}</p>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ── APPOINTMENTS ── */}
            {tab === 'appointments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">My Appointments</h1>
                    <p className="text-gray-500 text-sm mt-1">Track and manage all your bookings.</p>
                  </div>
                  <Link to="/doctors"><Button variant="primary" size="sm">➕ New Appointment</Button></Link>
                </div>

                {appointments.length === 0 ? (
                  <Card hover={false}>
                    <EmptyState icon="📅" title="No appointments yet" message="Book your first appointment."
                      action={<Link to="/doctors"><Button variant="primary">🔍 Find a Doctor</Button></Link>}
                    />
                  </Card>
                ) : (
                  <Card className="overflow-hidden" hover={false}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Doctor</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Date & Time</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Notes</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {appointments.map(a => (
                            <tr key={a._id} className="hover:bg-gray-50">
                              <td className="px-5 py-4">
                                <p className="font-semibold text-sm text-gray-800">{a.doctor?.name}</p>
                                <p className="text-xs text-gray-500">{a.doctor?.specialization}</p>
                              </td>
                              <td className="px-5 py-4">
                                <p className="text-sm font-medium text-gray-700">{a.date}</p>
                                <p className="text-xs text-gray-500">{a.time}</p>
                              </td>
                              <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                              <td className="px-5 py-4 text-xs text-gray-500 max-w-[150px] truncate">{a.notes || '—'}</td>
                              <td className="px-5 py-4">
                                {!['Cancelled','Completed'].includes(a.status) && (
                                  <Button variant="danger" size="sm"
                                    loading={cancellingId === a._id}
                                    onClick={() => handleCancel(a._id)}>
                                    🗑 Cancel
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ── PROFILE ── */}
            {tab === 'profile' && <PatientProfile user={user} onUpdated={fetchData} />}
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 pb-safe">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors ${tab === t.id ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-lg">{t.icon}</span>{t.label.split(' ')[0]}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Patient profile sub-component ────────────────────────────────────────────
function PatientProfile({ user }) {
  const { updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({
    name: user?.name || '', phone: user?.phone || '',
    age: user?.age || '', gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '', address: user?.address || '',
  });

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await patientAPI.updateMyProfile(form);
      updateUser(res.data.patient);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'Phone', value: user?.phone, icon: '📞' },
    { label: 'Age', value: user?.age ? `${user.age} years` : '—', icon: '🎂' },
    { label: 'Gender', value: user?.gender || '—', icon: '👤' },
    { label: 'Blood Group', value: user?.bloodGroup || '—', icon: '🩸' },
    { label: 'Address', value: user?.address || '—', icon: '📍' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Profile</h1>
        <Button variant={editing ? 'outline' : 'primary'} size="sm" onClick={() => { setEditing(!editing); }}>
          {editing ? '✕ Cancel' : '✏️ Edit Profile'}
        </Button>
      </div>

      <Card className="p-6" hover={false}>
        <div className="flex items-center gap-5 mb-6">
          <Avatar name={user?.name || ''} size="xl" color="blue" />
          <div>
            <h2 className="text-xl font-black text-gray-900">{user?.name}</h2>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Patient</span>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </div>
        </div>

        <hr className="border-gray-100 mb-5" />

        {editing ? (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name', field: 'name', placeholder: 'Your full name' },
              { label: 'Phone', field: 'phone', placeholder: '+1 (555) 000-0000' },
              { label: 'Age', field: 'age', placeholder: 'Years', type: 'number' },
              { label: 'Address', field: 'address', placeholder: 'Street, City' },
            ].map(({ label, field, placeholder, type = 'text' }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600">{label}</label>
                <input type={type} className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder={placeholder} value={form[field]} onChange={set(field)} />
              </div>
            ))}
            {/* Gender select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600">Gender</label>
              <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                value={form.gender} onChange={set('gender')}>
                <option value="">Select</option>
                {['Male','Female','Other','Prefer not to say'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            {/* Blood group select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600">Blood Group</label>
              <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                value={form.bloodGroup} onChange={set('bloodGroup')}>
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex gap-3 mt-2">
              <Button variant="outline" onClick={() => setEditing(false)} className="flex-1 justify-center">Cancel</Button>
              <Button variant="primary" onClick={handleSave} loading={saving} className="flex-[2] justify-center">✅ Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map(f => (
              <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span>{f.icon}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{f.label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{f.value || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

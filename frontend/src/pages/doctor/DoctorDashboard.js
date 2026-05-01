import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { Card, StatCard, StatusBadge, Button, Avatar, PageLoader, EmptyState, Input, Select, Textarea } from '../../components/common/UI';
import { toast } from 'react-toastify';

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: '📊' },
  { id: 'appointments',  label: 'Appointments',   icon: '📅' },
  { id: 'profile',       label: 'My Profile',     icon: '👤' },
  { id: 'availability',  label: 'Availability',   icon: '🕐' },
];

const SPECIALIZATIONS = [
  'Cardiology','General Medicine','Dentistry','Neurology','Pediatrics',
  'Orthopedics','Dermatology','Gynecology','Psychiatry','Ophthalmology',
  'ENT','Urology','Radiology','Oncology','Endocrinology',
];

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_NAMES = { Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday' };
const TIME_SLOTS = [
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','1:00 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
];

export default function DoctorDashboard() {
  const { user, updateUser } = useAuth();
  const [tab, setTab]                   = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, statsRes] = await Promise.all([
        doctorAPI.getMyAppointments(),
        doctorAPI.getMyStats(),
      ]);
      setAppointments(apptRes.data.appointments);
      setStats(statsRes.data.stats);
    } catch {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id, status) => {
    try {
      await doctorAPI.updateAppointmentStatus(id, { status });
      toast.success(`Appointment marked as ${status}.`);
      fetchData();
    } catch {
      toast.error('Failed to update appointment.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 hidden md:flex flex-col pt-6 pb-4 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        <div className="px-4 pb-5 border-b border-gray-700">
          <Avatar name={user?.name || ''} size="md" color="teal" />
          <div className="mt-2.5">
            <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.specialization}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-teal-600/30 text-teal-300 rounded-full text-xs font-bold">Doctor</span>
          </div>
        </div>
        <nav className="px-3 mt-4 space-y-1 flex-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${tab === t.id ? 'bg-teal-600/25 text-teal-300' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}>
              <span>{t.icon}</span>{t.label}
              {t.id === 'appointments' && stats?.pending > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center">{stats.pending}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl">
        {loading ? <PageLoader /> : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-gray-900">Welcome, {user?.name?.replace('Dr. ', '')} 👋</h1>
                  <p className="text-gray-500 text-sm mt-1">Here's your practice at a glance.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Total Appointments" value={stats?.total ?? 0}     icon="📅" color="teal" />
                  <StatCard label="Pending Review"      value={stats?.pending ?? 0}   icon="⏳" color="amber" />
                  <StatCard label="Confirmed"           value={stats?.confirmed ?? 0} icon="✅" color="green" />
                  <StatCard label="Completed"           value={stats?.completed ?? 0} icon="🏁" color="blue" />
                </div>

                {/* Profile completeness */}
                <ProfileCompleteness user={user} onEdit={() => setTab('profile')} />

                {/* Recent appointments */}
                <Card className="overflow-hidden mt-5" hover={false}>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">Recent Appointments</h2>
                    <button onClick={() => setTab('appointments')} className="text-sm text-teal-600 font-semibold hover:underline">View all →</button>
                  </div>
                  {appointments.length === 0 ? (
                    <EmptyState icon="📋" title="No appointments yet" message="Once patients book with you, they'll appear here." />
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {appointments.slice(0, 5).map(a => (
                        <div key={a._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{a.patientName}</p>
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
                <h1 className="text-2xl font-black text-gray-900 mb-6">Patient Appointments</h1>
                {appointments.length === 0 ? (
                  <Card hover={false}>
                    <EmptyState icon="📋" title="No appointments yet" message="Patients who book with you will appear here." />
                  </Card>
                ) : (
                  <Card className="overflow-hidden" hover={false}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            {['Patient','Date & Time','Notes','Status','Actions'].map(h => (
                              <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {appointments.map(a => (
                            <tr key={a._id} className="hover:bg-gray-50">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                  <Avatar name={a.patientName} size="sm" color="blue" />
                                  <div>
                                    <p className="font-semibold text-sm text-gray-800">{a.patientName}</p>
                                    <p className="text-xs text-gray-500">{a.patientEmail}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <p className="text-sm font-medium text-gray-700">{a.date}</p>
                                <p className="text-xs text-gray-500">{a.time}</p>
                              </td>
                              <td className="px-5 py-4 text-xs text-gray-500 max-w-[140px] truncate">{a.notes || '—'}</td>
                              <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                              <td className="px-5 py-4">
                                <div className="flex gap-2 flex-wrap">
                                  {a.status === 'Pending' && (
                                    <Button variant="ghost" size="sm"
                                      className="!text-green-600 !bg-green-50 hover:!bg-green-100 border border-green-200"
                                      onClick={() => updateStatus(a._id, 'Confirmed')}>✅ Confirm</Button>
                                  )}
                                  {a.status === 'Confirmed' && (
                                    <Button variant="ghost" size="sm"
                                      className="!text-blue-600 !bg-blue-50 hover:!bg-blue-100 border border-blue-200"
                                      onClick={() => updateStatus(a._id, 'Completed')}>🏁 Complete</Button>
                                  )}
                                </div>
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
            {tab === 'profile' && <DoctorProfile user={user} onUpdated={(u) => updateUser(u)} />}

            {/* ── AVAILABILITY ── */}
            {tab === 'availability' && <AvailabilityManager user={user} onUpdated={(u) => updateUser(u)} />}
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors relative ${tab === t.id ? 'text-teal-600' : 'text-gray-400'}`}>
            <span className="text-lg">{t.icon}</span>{t.label.split(' ')[0]}
            {t.id === 'appointments' && stats?.pending > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">{stats.pending}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Profile completeness ──────────────────────────────────────────────────────
function ProfileCompleteness({ user, onEdit }) {
  const fields = ['name','email','phone','specialization','qualification','experience','hospital','location','fee','bio'];
  const filled = fields.filter(f => user?.[f]).length;
  const pct = Math.round((filled / fields.length) * 100);
  return (
    <Card className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800">Profile Completeness</h3>
        <Button variant="outline" size="sm" onClick={onEdit}>✏️ Edit Profile</Button>
      </div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-500">{filled}/{fields.length} fields completed</span>
        <span className="font-bold text-teal-600">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {pct < 100 && <p className="text-xs text-gray-400 mt-2">Complete your profile to appear higher in patient searches.</p>}
    </Card>
  );
}

// ── Doctor Profile editor ─────────────────────────────────────────────────────
function DoctorProfile({ user, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({
    name: user?.name || '', phone: user?.phone || '',
    specialization: user?.specialization || '', qualification: user?.qualification || '',
    experience: user?.experience || '', fee: user?.fee || '',
    hospital: user?.hospital || '', location: user?.location || '', bio: user?.bio || '',
  });

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await doctorAPI.updateMyProfile({
        ...form, experience: Number(form.experience), fee: Number(form.fee),
      });
      onUpdated(res.data.doctor);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const infoFields = [
    { label: 'Email', value: user?.email, icon: '📧' },
    { label: 'Phone', value: user?.phone, icon: '📞' },
    { label: 'Specialization', value: user?.specialization, icon: '🩺' },
    { label: 'Qualification', value: user?.qualification, icon: '🎓' },
    { label: 'Experience', value: user?.experience ? `${user.experience} years` : null, icon: '🏅' },
    { label: 'Hospital', value: user?.hospital, icon: '🏥' },
    { label: 'Location', value: user?.location, icon: '📍' },
    { label: 'Consultation Fee', value: user?.fee ? `Rs.${user.fee}` : null, icon: '💵' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Profile</h1>
        <Button variant={editing ? 'outline' : 'teal'} size="sm" onClick={() => setEditing(!editing)}>
          {editing ? '✕ Cancel' : '✏️ Edit Profile'}
        </Button>
      </div>

      <Card className="p-6" hover={false}>
        <div className="flex items-center gap-5 mb-6 flex-wrap">
          <Avatar name={user?.name || ''} size="xl" color="teal" />
          <div>
            <h2 className="text-xl font-black text-gray-900">{user?.name}</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              {user?.specialization && <span className="px-2.5 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">{user.specialization}</span>}
              {user?.experience && <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{user.experience} yrs exp</span>}
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-5" />

        {editing ? (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={set('name')} teal />
            <Input label="Phone" value={form.phone} onChange={set('phone')} teal />
            <Select label="Specialization" value={form.specialization} onChange={set('specialization')} teal>
              <option value="">Select</option>
              {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
            </Select>
            <Input label="Qualification" value={form.qualification} onChange={set('qualification')} teal />
            <Input label="Years of Experience" type="number" value={form.experience} onChange={set('experience')} teal />
            <Input label="Consultation Fee ($)" type="number" value={form.fee} onChange={set('fee')} teal />
            <Input label="Hospital / Clinic" value={form.hospital} onChange={set('hospital')} teal />
            <Input label="Location" value={form.location} onChange={set('location')} teal />
            <div className="col-span-2">
              <Textarea label="Professional Bio" rows={4} value={form.bio} onChange={set('bio')} teal placeholder="Describe your expertise…" />
            </div>
            <div className="col-span-2 flex gap-3 mt-2">
              <Button variant="outline" onClick={() => setEditing(false)} className="flex-1 justify-center">Cancel</Button>
              <Button variant="teal" onClick={handleSave} loading={saving} className="flex-[2] justify-center">✅ Save Changes</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {infoFields.map(f => (
                <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{f.icon}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{f.label}</span>
                  </div>
                  <p className={`text-sm font-semibold ${f.value ? 'text-gray-800' : 'text-gray-300'}`}>{f.value || 'Not set'}</p>
                </div>
              ))}
            </div>
            {user?.bio && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Professional Bio</div>
                <p className="text-sm text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

// ── Availability manager ──────────────────────────────────────────────────────
function AvailabilityManager({ user, onUpdated }) {
  // Convert array [{day, slots}] → map { Mon: ['9:00 AM', ...] }
  const toMap = (arr = []) => arr.reduce((m, { day, slots }) => ({ ...m, [day]: slots }), {});
  const [avail, setAvail] = useState(toMap(user?.availability));
  const [saving, setSaving] = useState(false);

  const toggle = (day, time) => {
    const cur = avail[day] || [];
    setAvail({
      ...avail,
      [day]: cur.includes(time) ? cur.filter(t => t !== time) : [...cur, time].sort(),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const availability = DAYS.map(day => ({ day, slots: avail[day] || [] })).filter(d => d.slots.length > 0);
    try {
      const res = await doctorAPI.updateAvailability({ availability });
      onUpdated(res.data.doctor);
      toast.success('Availability saved!');
    } catch {
      toast.error('Failed to save availability.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Availability</h1>
          <p className="text-sm text-gray-500 mt-1">Select your available time slots for each day.</p>
        </div>
        <Button variant="teal" size="sm" onClick={handleSave} loading={saving}>💾 Save Schedule</Button>
      </div>

      <div className="space-y-4">
        {DAYS.map(day => {
          const selected = avail[day] || [];
          const hasSlots = selected.length > 0;
          return (
            <Card key={day} className="p-5" hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all ${hasSlots ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-400'}`}>
                  {day}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{DAY_NAMES[day]}</p>
                  <p className="text-xs text-gray-400">{selected.length} slot{selected.length !== 1 ? 's' : ''} selected</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map(time => {
                  const active = selected.includes(time);
                  return (
                    <button key={time} onClick={() => toggle(day, time)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${active ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200 hover:border-teal-400 hover:text-teal-600'}`}>
                      {time}
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

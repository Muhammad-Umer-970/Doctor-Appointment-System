import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, Badge, Button, Avatar, PageLoader, EmptyState, Input, Select } from '../components/common/UI';
import { toast } from 'react-toastify';

const SPECIALIZATIONS = [
  'All','Cardiology','General Medicine','Dentistry','Neurology','Pediatrics',
  'Orthopedics','Dermatology','Gynecology','Psychiatry','Ophthalmology',
  'ENT','Urology','Radiology','Oncology','Endocrinology',
];

export default function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [spec, setSpec]       = useState('All');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (spec !== 'All') params.specialization = spec;
        if (search) params.search = search;
        const res = await doctorAPI.getAll(params);
        setDoctors(res.data.doctors);
      } catch {
        toast.error('Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(t);
  }, [search, spec]);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 py-14 px-6 text-center">
        <span className="text-xs font-black tracking-widest text-blue-400 uppercase">Our Network</span>
        <h1 className="text-3xl md:text-5xl font-black text-white mt-3 mb-3">Find Your Specialist</h1>
        <p className="text-gray-400 max-w-xl mx-auto">Browse verified doctors across all major specializations.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-end">
          <div className="flex-1 min-w-[220px] relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              className="w-full pl-9 pr-4 py-2.5 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search by name or specialization…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {SPECIALIZATIONS.map(s => (
              <button key={s} onClick={() => setSpec(s)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${spec === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Showing <strong>{doctors.length}</strong> doctor{doctors.length !== 1 ? 's' : ''}
        </p>

        {loading ? <PageLoader /> : doctors.length === 0 ? (
          <EmptyState icon="🔍" title="No doctors found" message="Try adjusting your search or filters."
            action={<Button variant="outline" onClick={() => { setSearch(''); setSpec('All'); }}>Clear Filters</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map(doc => (
              <DoctorCard key={doc._id} doctor={doc}
                onBook={user?.role === 'patient' ? () => setBooking(doc) : null}
                isLoggedIn={!!user}
              />
            ))}
          </div>
        )}
      </div>

      {booking && (
        <BookingModal
          doctor={booking}
          user={user}
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  );
}

// ── Doctor Card ───────────────────────────────────────────────────────────────
function DoctorCard({ doctor, onBook, isLoggedIn }) {
  const navigate = useNavigate();
  const colors = ['#2563eb','#0d9488','#7c3aed','#d97706','#dc2626','#059669'];
  const color = colors[doctor.name.charCodeAt(0) % colors.length];

  return (
    <Card className="overflow-hidden">
      <div style={{ height: 4, backgroundColor: color }} />
      <div className="p-5">
        <div className="flex gap-3.5 mb-4">
          <Avatar name={doctor.name} size="md" color="blue" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight">{doctor.name}</p>
            <Badge variant="blue" className="mt-1">{doctor.specialization}</Badge>
            {doctor.rating > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-amber-400 text-xs">⭐</span>
                <span className="text-xs font-bold text-gray-700">{doctor.rating}</span>
                <span className="text-xs text-gray-400">({doctor.totalPatients?.toLocaleString()} patients)</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'Experience', value: doctor.experience ? `${doctor.experience} yrs` : 'N/A' },
            { label: 'Fee', value: doctor.fee ? `Rs.${doctor.fee}` : 'N/A' },
            { label: 'Hospital', value: doctor.hospital || '—' },
            { label: 'Location', value: doctor.location || '—' },
          ].map(f => (
            <div key={f.label} className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">{f.label}</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5 truncate">{f.value}</p>
            </div>
          ))}
        </div>

        {onBook ? (
          <Button variant="primary" size="sm" onClick={onBook} className="w-full justify-center">
            📅 Book Appointment
          </Button>
        ) : !isLoggedIn ? (
          <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="w-full justify-center">
            🔐 Login to Book
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ doctor, user, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: user?.name || '', email: user?.email || '',
    phone: user?.phone || '', date: '', time: '', notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Build time slots from doctor's availability or fallback
  const availSlots = (doctor.availability || []).flatMap(({ day, slots }) =>
    slots.map(t => `${day} – ${t}`)
  );
  const fallbackSlots = ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'];

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Name required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone required';
    if (!form.date) e.date = 'Date required';
    else if (new Date(form.date) < new Date(new Date().toDateString())) e.date = 'Date must be in the future';
    if (!form.time) e.time = 'Select a time slot';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await appointmentAPI.book({
        doctorId: doctor._id,
        patientName: form.patientName,
        patientEmail: form.email,
        patientPhone: form.phone,
        date: form.date,
        time: form.time,
        notes: form.notes,
      });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="font-black text-lg text-gray-900">Book Appointment</h2>
            <p className="text-xs text-gray-500 mt-0.5">with {doctor.name} · {doctor.specialization}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all">✕</button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Appointment Booked!</h3>
              <p className="text-sm text-gray-600 mb-1"><strong>{doctor.name}</strong></p>
              <p className="text-sm text-gray-500 mb-1">{form.date} · {form.time}</p>
              <p className="text-xs text-gray-400 mb-6">Status: Pending — the doctor will confirm shortly.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={() => navigate('/patient/dashboard')}>📊 View Dashboard</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Doctor info */}
              <div className="flex gap-3 p-3.5 bg-blue-50 rounded-xl mb-5">
                <Avatar name={doctor.name} size="md" color="blue" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{doctor.name}</p>
                  <p className="text-xs text-gray-600">{doctor.hospital} · ${doctor.fee} consultation</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Patient Name *" placeholder="Full name" value={form.patientName} onChange={set('patientName')} error={errors.patientName} />
                  <Input label="Phone *" placeholder="+1 (555) …" value={form.phone} onChange={set('phone')} error={errors.phone} />
                </div>
                <Input label="Email *" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} error={errors.email} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Date *" type="date" value={form.date} onChange={set('date')} error={errors.date} min={new Date().toISOString().split('T')[0]} />
                  <Select label="Time Slot *" value={form.time} onChange={set('time')} error={errors.time}>
                    <option value="">Choose slot</option>
                    {(availSlots.length > 0 ? availSlots : fallbackSlots).map(s => (
                      <option key={s} value={typeof s === 'string' && s.includes('–') ? s.split('– ')[1] : s}>{s}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-600">Notes (optional)</label>
                  <textarea rows={2} className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
                    placeholder="Describe your symptoms or reason for visit…" value={form.notes} onChange={set('notes')} />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <Button variant="outline" onClick={onClose} className="flex-1 justify-center">Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-[2] justify-center">
                  ✅ Confirm Appointment
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

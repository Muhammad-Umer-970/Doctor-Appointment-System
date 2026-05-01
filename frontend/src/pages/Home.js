import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const services = [
    { icon: '❤️', title: 'Cardiology', desc: 'Expert heart care with advanced diagnostics and treatment plans.' },
    { icon: '🦷', title: 'Dentistry', desc: 'Complete oral health services from routine checkups to advanced care.' },
    { icon: '🧠', title: 'Neurology', desc: 'Cutting-edge neurological care for brain and nervous system health.' },
    { icon: '👶', title: 'Pediatrics', desc: 'Specialized care for children from infancy through adolescence.' },
    { icon: '🦴', title: 'Orthopedics', desc: 'Bone, joint, and muscle care for pain-free, active living.' },
    { icon: '💊', title: 'General Medicine', desc: 'Comprehensive primary care for patients of all ages and conditions.' },
  ];

  const stats = [
    { value: '50+', label: 'Specialist Doctors' },
    { value: '12K+', label: 'Happy Patients' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
  ];

  const testimonials = [
    { name: 'Amanda Ross', role: 'Patient since 2023', text: 'Booking an appointment has never been this seamless. The whole experience felt so professional.', rating: 5 },
    { name: 'Derek Pham', role: 'Regular Patient', text: 'I love how I can manage all my appointments from one place. The doctors are world-class.', rating: 5 },
    { name: 'Lucia Fernandez', role: 'New Patient', text: 'Found an excellent cardiologist within minutes. The filtering system made it so easy!', rating: 5 },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #060e1f 0%, #0b1a35 60%, #0f2347 100%)', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* BG circles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,.18) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,.12) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(37,99,235,.18)', border: '1px solid rgba(37,99,235,.35)', borderRadius: 20, padding: '5px 14px', marginBottom: 22 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#93c5fd', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 12.5, color: '#93c5fd', fontWeight: 700 }}>Trusted Healthcare Platform</span>
              </div>
              <h1 style={{ fontSize: 'clamp(34px,5vw,60px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: 18, fontFamily: 'inherit' }}>
                Your Health,<br /><span style={{ color: '#3b82f6' }}>Our Priority</span>
              </h1>
              <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.75, marginBottom: 34, maxWidth: 460 }}>
                Connect with verified specialists, book appointments instantly, and manage your entire healthcare journey — all in one seamless platform.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {user ? (
                  <button
                    onClick={() => navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,.35)' }}>
                    📊 Go to Dashboard
                  </button>
                ) : (
                  <Link to="/register"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 24px rgba(37,99,235,.35)' }}>
                    🚀 Get Started Free
                  </Link>
                )}
                <Link to="/doctors"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: 'rgba(255,255,255,.08)', color: '#e2e8f0', fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.15)' }}>
                  👨‍⚕️ Browse Doctors
                </Link>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: 32, marginTop: 44, flexWrap: 'wrap' }}>
                {[{ n: '50+', l: 'Doctors' }, { n: '12K+', l: 'Patients' }, { n: '4.9★', l: 'Rating' }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontWeight: 800, fontSize: 26, color: '#fff' }}>{s.n}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role cards — desktop */}
            <div className="hidden md:grid grid-cols-1 gap-4">
              {[
                { title: 'For Patients', desc: 'Book appointments, manage your health records, and connect with top doctors instantly.', icon: '❤️', color: '#3b82f6', bg: 'rgba(37,99,235,.12)', btn: 'Register as Patient', to: '/register' },
                { title: 'For Doctors', desc: 'Build your profile, set your availability, and manage patient appointments effortlessly.', icon: '🩺', color: '#14b8a6', bg: 'rgba(13,148,136,.12)', btn: 'Register as Doctor', to: '/doctor/register' },
              ].map(c => (
                <div key={c.title} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 6 }}>{c.title}</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
                    <Link to={c.to} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, background: c.bg, color: c.color, border: `1px solid ${c.color}33`, fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>
                      {c.btn} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '28px 24px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontWeight: 800, fontSize: 30, color: '#2563eb' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#2563eb' }}>What We Offer</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 900, color: '#060e1f', marginTop: 8 }}>Comprehensive Medical Services</h2>
            <p style={{ fontSize: 15, color: '#64748b', marginTop: 10, maxWidth: 520, margin: '10px auto 0' }}>From routine checkups to specialized care, we connect you with the right specialists.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <div key={s.title} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)', transition: 'all .22s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.06)'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#2563eb', padding: '72px 24px', textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: '#fff', marginBottom: 14 }}>Ready to Transform Your Healthcare?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.8)', marginBottom: 34, maxWidth: 500, margin: '0 auto 34px' }}>Whether you're a doctor or patient, MediCare+ has everything you need.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: '#fff', color: '#2563eb', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              ❤️ Register as Patient
            </Link>
            <Link to="/doctor/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: 'rgba(255,255,255,.15)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              🩺 Register as Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#2563eb' }}>Patient Stories</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 900, color: '#060e1f', marginTop: 8 }}>What Our Patients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {Array(t.rating).fill(0).map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

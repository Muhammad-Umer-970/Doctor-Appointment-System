import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#060e1f 0%,#0f2347 100%)', padding: '64px 24px', textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto">
          <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#93c5fd' }}>Our Story</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', margin: '10px 0 14px' }}>Reimagining Healthcare Access</h1>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Built in 2020, MediCare+ connects patients with verified specialists and empowers doctors to manage their practice — through a seamless, technology-first platform.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { title: 'Our Mission', icon: '❤️', color: '#2563eb', bg: '#eff6ff', text: 'To bridge the gap between patients and healthcare providers through seamless, technology-driven appointment booking — ensuring no one has to wait to receive the care they deserve.' },
            { title: 'Our Vision', icon: '⭐', color: '#0d9488', bg: '#f0fdfa', text: 'A world where both patients and doctors have powerful tools at their fingertips — helping doctors grow their practice and patients manage their health effortlessly.' },
          ].map(c => (
            <div key={c.title} style={{ background: '#f8fafc', borderRadius: 20, border: '1px solid #e2e8f0', padding: 32 }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>{c.icon}</div>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: '#060e1f', marginBottom: 12 }}>{c.title}</h2>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#2563eb' }}>What Guides Us</span>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: '#060e1f', marginTop: 8 }}>Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '❤️', title: 'Patient-First', desc: 'Every decision centers around improving patient outcomes and experiences.' },
              { icon: '🔒', title: 'Trusted & Secure', desc: 'Your medical data and privacy are protected with enterprise-grade security.' },
              { icon: '💡', title: 'Innovation', desc: 'We leverage cutting-edge technology to make healthcare more accessible.' },
              { icon: '⭐', title: 'Excellence', desc: 'We partner only with board-certified, highly rated medical professionals.' },
            ].map(v => (
              <div key={v.title} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, display: 'flex', gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{v.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 6 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#060e1f', padding: '72px 24px', textAlign: 'center' }}>
        <div className="max-w-4xl mx-auto">
          <h2 style={{ fontWeight: 900, fontSize: 32, color: '#fff', marginBottom: 44 }}>By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ n: '2020', l: 'Year Founded' }, { n: '50+', l: 'Specialist Doctors' }, { n: '12K+', l: 'Patients Served' }, { n: '4.9/5', l: 'Average Rating' }].map(s => (
              <div key={s.l}>
                <div style={{ fontWeight: 900, fontSize: 38, color: '#3b82f6' }}>{s.n}</div>
                <div style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding: '52px 24px', background: '#fff', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            ❤️ Register as Patient
          </Link>
          <Link to="/doctor/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: '#0d9488', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            🩺 Register as Doctor
          </Link>
        </div>
      </div>
    </div>
  );
}

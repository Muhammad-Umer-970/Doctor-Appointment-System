import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#060e1f', color: '#fff', padding: '52px 24px 28px' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❤️</div>
              <span style={{ fontWeight: 900, fontSize: 18 }}>Medi<span style={{ color: '#3b82f6' }}>Care+</span></span>
            </div>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.7 }}>
              Connecting patients and doctors through seamless, technology-driven healthcare booking.
            </p>
          </div>

          {/* For Patients */}
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 14 }}>For Patients</p>
            {[
              { label: 'Find Doctors', to: '/doctors' },
              { label: 'Patient Login', to: '/login' },
              { label: 'Register as Patient', to: '/register' },
              { label: 'About Us', to: '/about' },
            ].map(l => (
              <Link key={l.label} to={l.to}
                style={{ display: 'block', color: '#cbd5e1', fontSize: 13.5, padding: '4px 0', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color = '#93c5fd'}
                onMouseLeave={e => e.target.style.color = '#cbd5e1'}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* For Doctors */}
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 14 }}>For Doctors</p>
            {[
              { label: 'Doctor Login', to: '/doctor/login' },
              { label: 'Register as Doctor', to: '/doctor/register' },
            ].map(l => (
              <Link key={l.label} to={l.to}
                style={{ display: 'block', color: '#cbd5e1', fontSize: 13.5, padding: '4px 0', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color = '#5eead4'}
                onMouseLeave={e => e.target.style.color = '#cbd5e1'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 22, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 12.5, color: '#475569' }}>© 2026 MediCare+. All rights reserved.</p>
          <p style={{ fontSize: 12.5, color: '#475569' }}>Built for better healthcare ❤️</p>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute, RoleRoute, GuestRoute } from './components/common/ProtectedRoute';

import Navbar  from './components/common/Navbar';
import Footer  from './components/common/Footer';

import Home           from './pages/Home';
import About          from './pages/About';
import DoctorsPage    from './pages/DoctorsPage';

import PatientRegister from './pages/auth/PatientRegister';
import DoctorRegister  from './pages/auth/DoctorRegister';
import Login           from './pages/auth/Login';

import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard  from './pages/doctor/DoctorDashboard';
import AdminLogin       from './pages/admin/AdminLogin';
import AdminDashboard   from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public */}
              <Route path="/"        element={<Home />} />
              <Route path="/about"   element={<About />} />
              <Route path="/doctors" element={<DoctorsPage />} />

              {/* Guest-only auth routes */}
              <Route path="/register"       element={<GuestRoute><PatientRegister /></GuestRoute>} />
              <Route path="/doctor/register" element={<GuestRoute><DoctorRegister /></GuestRoute>} />
              <Route path="/login"          element={<GuestRoute><Login role="patient" /></GuestRoute>} />
              <Route path="/doctor/login"   element={<GuestRoute><Login role="doctor" /></GuestRoute>} />

              {/* Protected dashboards */}
              <Route path="/patient/dashboard" element={<RoleRoute role="patient"><PatientDashboard /></RoleRoute>} />
              <Route path="/doctor/dashboard"  element={<RoleRoute role="doctor"><DoctorDashboard /></RoleRoute>} />

              {/* Admin routes */}
              <Route path="/admin/login"     element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

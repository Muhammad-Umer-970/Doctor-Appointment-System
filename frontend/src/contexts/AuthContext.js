import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while checking stored token

  // On mount: rehydrate user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const patientRegister = async (data) => {
    const res = await authAPI.patientRegister(data);
    saveSession(res.data.token, res.data.user);
    return res.data;
  };

  const patientLogin = async (data) => {
    const res = await authAPI.patientLogin(data);
    saveSession(res.data.token, res.data.user);
    return res.data;
  };

  const doctorRegister = async (data) => {
    const res = await authAPI.doctorRegister(data);
    saveSession(res.data.token, res.data.user);
    return res.data;
  };

  const doctorLogin = async (data) => {
    const res = await authAPI.doctorLogin(data);
    saveSession(res.data.token, res.data.user);
    return res.data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      patientRegister, patientLogin,
      doctorRegister, doctorLogin,
      logout, updateUser,
      isPatient: user?.role === 'patient',
      isDoctor:  user?.role === 'doctor',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

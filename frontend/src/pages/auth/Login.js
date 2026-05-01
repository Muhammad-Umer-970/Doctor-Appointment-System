import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input, Button } from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function Login({ role = 'patient' }) {
  const { patientLogin, doctorLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const isDoctor = role === 'doctor';

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Valid email required';
    if (!form.password) errs.password = 'Password required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (isDoctor) {
        await doctorLogin(form);
        navigate('/doctor/dashboard');
      } else {
        await patientLogin(form);
        navigate('/patient/dashboard');
      }
      toast.success('Welcome back! 👋');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDoctor ? 'bg-teal-50' : 'bg-blue-50'}`}>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-7">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 ${isDoctor ? 'bg-teal-100' : 'bg-blue-100'}`}>
            {isDoctor ? '🩺' : '❤️'}
          </div>
          <h1 className="text-2xl font-black text-gray-900">{isDoctor ? 'Doctor Login' : 'Patient Login'}</h1>
          <p className="text-sm text-gray-500 mt-1">{isDoctor ? 'Access your medical dashboard' : 'Manage your appointments'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email Address" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} teal={isDoctor} />
          <Input label="Password" type="password" placeholder="Your password" value={form.password} onChange={set('password')} error={errors.password} teal={isDoctor} />

          <Button
            type="submit"
            variant={isDoctor ? 'teal' : 'primary'}
            size="lg"
            loading={loading}
            className="w-full justify-center mt-2"
          >
            🔐 Log In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to={isDoctor ? '/doctor/register' : '/register'} className={`font-semibold ${isDoctor ? 'text-teal-600' : 'text-blue-600'}`}>
            Register here
          </Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-3">
          {isDoctor ? (
            <>Looking for patient login? <Link to="/login" className="text-blue-600 font-semibold">Patient Login</Link></>
          ) : (
            <>Are you a doctor? <Link to="/doctor/login" className="text-teal-600 font-semibold">Doctor Login</Link></>
          )}
        </p>
      </div>
    </div>
  );
}

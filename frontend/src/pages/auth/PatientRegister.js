import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input, Select, Button } from '../../components/common/UI';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from "lucide-react";


export default function PatientRegister() {
  const { patientRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    phone: '', age: '', gender: '', bloodGroup: '', address: '',
  });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.phone.trim()) e.phone = 'Phone number required';
    if (form.age && (isNaN(form.age) || form.age < 1 || form.age > 120)) e.age = 'Enter valid age (1–120)';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { password, confirm, ...rest } = form;
      await patientRegister({ ...rest, password });
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/patient/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">❤️</div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Patient Registration</h1>
            <p className="text-sm text-gray-500">Create your patient account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name *" placeholder="Mr. Example" value={form.name} onChange={set('name')} error={errors.name} />
            <Input label="Email *" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} error={errors.email} />
            
            
           <div className="relative mb-4">
            <Input
              label="Password *"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set("password")}
              error={errors.password}/>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password *"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}/>
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-10 text-gray-500">
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div> 
            
            
            {/* <Input label="Password *" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} error={errors.password} />
            <Input label="Confirm Password *" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} /> */}
            
            
            
            
            <Input label="Phone *" placeholder="+92 300 000-0000" value={form.phone} onChange={set('phone')} error={errors.phone} />
            <Input label="Age" type="number" placeholder="Years" min="1" max="120" value={form.age} onChange={set('age')} error={errors.age} />
            <Select label="Gender" value={form.gender} onChange={set('gender')}>
              <option value="">Select gender</option>
              {['Male','Female','Other','Prefer not to say'].map(g => <option key={g}>{g}</option>)}
            </Select>
            <Select label="Blood Group" value={form.bloodGroup} onChange={set('bloodGroup')}>
              <option value="">Select blood group</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
            </Select>
          </div>
          <Input label="Address" placeholder="Street, City, State" value={form.address} onChange={set('address')} />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center mt-2">
            ✅ Create Patient Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold">Log in</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          Are you a doctor?{' '}
          <Link to="/doctor/register" className="text-teal-600 font-semibold">Register as Doctor</Link>
        </p>
      </div>
    </div>
  );
}

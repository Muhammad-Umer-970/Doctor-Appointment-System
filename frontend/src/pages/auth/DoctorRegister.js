import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input, Select, Textarea, Button } from '../../components/common/UI';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from "lucide-react";

// import { Eye, EyeOff } from "lucide-react";

const SPECIALIZATIONS = [
  'Cardiology','General Medicine','Dentistry','Neurology','Pediatrics',
  'Orthopedics','Dermatology','Gynecology','Psychiatry','Ophthalmology',
  'ENT','Urology','Radiology','Oncology','Endocrinology',
];

const hospital = [
  'HMC, Peshawar','KTH, Peshawar','RMI, Peshawar','IRNUM, Peshawar','Fauji Foundation Hospital, Peshawar',
  'PIMS Hospital, Islamabad','Quaid-e-Azam International Hospital, Islamabad','Capital Hospital CDA, Islamabad',
  'PAF Hospital, Islamabad','RIMS INTERNATIONAL HOSPITAL, Islamabad',
  'Ali Medical Centre, Islamabad','KRL Hospital, Islamabad','Pakistan Railway Hospital, Islamabad','National Police Hospital, Islamabad','Life Care International Hospital, Islamabad',
];

export default function DoctorRegister() {
  const { doctorRegister } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirm:'', phone:'',
    specialization:'' ,  qualification:'', experience:'',
    hospital:'' ,location:'', fee:'', bio:'',
  });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


 
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.phone.trim()) e.phone = 'Phone required';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.specialization) e.specialization = 'Specialization required';
    if (!form.qualification.trim()) e.qualification = 'Qualification required';
    if (!form.experience || isNaN(form.experience)) e.experience = 'Years of experience required';
    if (!form.hospital.trim()) e.hospital = 'Hospital/Clinic required';
    if (!form.fee || isNaN(form.fee)) e.fee = 'Consultation fee required';
    return e;
  };

  const nextStep = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { confirm, ...rest } = form;
      await doctorRegister({ ...rest, experience: Number(rest.experience), fee: Number(rest.fee) });
      toast.success('Doctor account created! Complete your profile 🎉');
      navigate('/doctor/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) { setErrors({ email: msg }); setStep(1); }
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl">🩺</div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Doctor Registration</h1>
            <p className="text-sm text-gray-500">Create your professional medical profile</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-7">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                <span className={`text-sm font-semibold transition-colors ${step >= s ? 'text-teal-700' : 'text-gray-400'}`}>{s === 1 ? 'Account Info' : 'Professional Details'}</span>
              </div>
              {s < 2 && <div className={`flex-1 h-0.5 rounded transition-all ${step > 1 ? 'bg-teal-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Full Name (with Dr.) *" placeholder="Dr. Example" value={form.name} onChange={set('name')} error={errors.name} teal />
              </div>
              <Input label="Email *" type="email" placeholder="doctor@email.com" value={form.email} onChange={set('email')} error={errors.email} teal />
              <Input label="Phone *" placeholder="+92 300 000-0000" value={form.phone} onChange={set('phone')} error={errors.phone} teal />




      <div className="relative mb-4">
        <Input 
        label="Password *" 
        type={showPassword ? "text" : "password"} 
        placeholder="Min. 6 characters" 
        value={form.password} 
        onChange={set("password")} 
        error={errors.password} teal />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-10 text-gray-500">
          {showPassword ? "Hide" : "Show"}
          {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
        </button>
      </div>

      <div className="relative">
        <Input 
        label="Confirm Password *"
        type={showConfirm ? "text" : "password"} 
        placeholder="Repeat password" 
        value={form.confirm} 
        onChange={set("confirm")} 
        error={errors.confirm} teal/>
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-10 text-gray-500">
          {showConfirm ? "Hide" : "Show"}
          {/* {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />} */}
        </button>
      </div>

              {/* <Input label="Password *" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} error={errors.password} teal />
              <Input label="Confirm Password *" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} teal /> */}
              
              
              
              
              
              
              <Button type="button" variant="teal" size="lg" onClick={nextStep} className="col-span-2 justify-center mt-2">
                Continue → Professional Details
              </Button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <Select label="Specialization *" value={form.specialization} onChange={set('specialization')} error={errors.specialization} teal>
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
              </Select>
              <Input label="Qualification *" placeholder="MBBS, MD, etc." value={form.qualification} onChange={set('qualification')} error={errors.qualification} teal />
              <Input label="Years of Experience *" type="number" placeholder="e.g. 10" min="0" value={form.experience} onChange={set('experience')} error={errors.experience} teal />
              <Input label="Consultation Fee  *" type="number" placeholder="e.g. 150" min="0" value={form.fee} onChange={set('fee')} error={errors.fee} teal />



              {/* <Select label="Hospital / Clinic  *" value={form.hospitalClinic} onChange={set('specialization')} error={errors.specialization} teal>
                <option value="">Select specialization</option>
                <option value="">Select specialization</option>
              </Select> */}



              {/* <Input label="Hospital / Clinic *" placeholder="Hospital or clinic name" value={form.hospital} onChange={set('hospital')} error={errors.hospital} teal /> */}



              <Select label="Hospital / Clinic *" value={form.hospital} onChange={set('hospital')} error={errors.hospital} teal>               
                 <option value="">Select Hospital / Clinic</option>
                 {hospital.map(s => <option key={s}>{s}</option>)} 
              </Select>  




              <Input label="Location (City, State)" placeholder="Location " value={form.location} onChange={set('location')} teal />
              <div className="col-span-2">
                <Textarea label="Professional Bio" rows={3} placeholder="Describe your expertise and patient care approach…" value={form.bio} onChange={set('bio')} teal />
              </div>
              <div className="col-span-2 flex gap-3 mt-2">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1 justify-center">← Back</Button>
                <Button type="submit" variant="teal" size="lg" loading={loading} className="flex-[2] justify-center">✅ Complete Registration</Button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already registered?{' '}
          <Link to="/doctor/login" className="text-teal-600 font-semibold">Log in</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          Are you a patient?{' '}
          <Link to="/register" className="text-blue-600 font-semibold">Register as Patient</Link>
        </p>
      </div>
    </div>
  );
}

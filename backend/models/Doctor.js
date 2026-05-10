const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      required: true,
    },
    slots: [
      {
        type: String, // e.g. "9:00 AM"
      },
    ],
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: [
        'Cardiology', 'General Medicine', 'Dentistry', 'Neurology',
        'Pediatrics', 'Orthopedics', 'Dermatology', 'Gynecology',
        'Psychiatry', 'Ophthalmology', 'ENT', 'Urology',
        'Radiology', 'Oncology', 'Endocrinology',
      ],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    // hospital: {
    //   type: String,
    //   required: [true, 'Hospital/Clinic name is required'],
    //   enum: [
    //     'HMC, Peshawar','KTH, Peshawar','RMI, Peshawar','IRNUM, Peshawar',
    //     'Fauji Foundation Hospital, Peshawar',
    //     'PIMS Hospital, Islamabad','Quaid-e-Azam International Hospital, Islamabad',
    //     'Capital Hospital CDA, Islamabad',
    //     'PAF Hospital, Islamabad','RIMS INTERNATIONAL HOSPITAL, Islamabad',
    //     'Ali Medical Centre, Islamabad','KRL Hospital, Islamabad',
    //     'Pakistan Railway Hospital, Islamabad','National Police Hospital, Islamabad',
    //     'Life Care International Hospital, Islamabad',
    //   ],
    // },
    hospital: {
      type: String,
      required: [true, 'Hospital/Clinic name is required'],
      trim: true,
      enum: [
         'HMC, Peshawar','KTH, Peshawar','RMI, Peshawar','IRNUM, Peshawar',
         'Fauji Foundation Hospital, Peshawar',
         'PIMS Hospital, Islamabad','Quaid-e-Azam International Hospital, Islamabad',
         'Capital Hospital CDA, Islamabad',
         'PAF Hospital, Islamabad','RIMS INTERNATIONAL HOSPITAL, Islamabad',
         'Ali Medical Centre, Islamabad','KRL Hospital, Islamabad',
         'Pakistan Railway Hospital, Islamabad','National Police Hospital, Islamabad',
         'Life Care International Hospital, Islamabad',
       ],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    
    fee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    availability: [availabilitySchema],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalPatients: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: 'doctor',
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
doctorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
doctorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Virtual: initials for UI
doctorSchema.virtual('initials').get(function () {
  return this.name
    .split(' ')
    .filter((w) => w !== 'Dr.')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

module.exports = mongoose.model('Doctor', doctorSchema);

# MediCare+ — Full-Stack Doctor Appointment System

A complete full-stack web application with:
- **Backend**: Node.js + Express.js + MongoDB (REST API)
- **Frontend**: React.js + Tailwind CSS

---

## 📁 Project Structure

```
medicare-plus/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & login (patient + doctor)
│   │   ├── doctorController.js    # Doctor profile, availability, appointments
│   │   ├── patientController.js   # Patient profile, appointments
│   │   └── appointmentController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + role restrict
│   │   ├── errorHandler.js        # Central error handling
│   │   └── validators.js          # express-validator rules
│   ├── models/
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   └── appointmentRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.js
    │   │       ├── Footer.js
    │   │       ├── ProtectedRoute.js
    │   │       └── UI.js          # Button, Input, Card, Badge, Avatar, etc.
    │   ├── contexts/
    │   │   └── AuthContext.js     # Global auth state
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── About.js
    │   │   ├── DoctorsPage.js     # Browse + book modal
    │   │   ├── auth/
    │   │   │   ├── Login.js       # Shared for patient + doctor
    │   │   │   ├── PatientRegister.js
    │   │   │   └── DoctorRegister.js  # 2-step form
    │   │   ├── patient/
    │   │   │   └── PatientDashboard.js
    │   │   └── doctor/
    │   │       └── DoctorDashboard.js
    │   ├── services/
    │   │   └── api.js             # Axios + all API calls
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js v18+
- MongoDB (local) **or** a MongoDB Atlas connection string

---

### 2. Backend Setup

```bash
cd medicare-plus/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET

# Start development server
npm run dev
# → Running on http://localhost:5000
```

**`.env` values to set:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/medicare_plus
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

### 3. Frontend Setup

```bash
cd medicare-plus/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Default: REACT_APP_API_URL=http://localhost:5000/api

# Start React development server
npm start
# → Running on http://localhost:3000
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/patient/register` | Register new patient |
| POST | `/api/auth/patient/login` | Patient login |
| POST | `/api/auth/doctor/register` | Register new doctor |
| POST | `/api/auth/doctor/login` | Doctor login |
| GET  | `/api/auth/me` | Get current user (protected) |

### Doctors (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors (with search/filter) |
| GET | `/api/doctors/:id` | Get single doctor |

### Doctor (Protected — Doctor role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors/me/profile` | Get own profile |
| PUT | `/api/doctors/me/profile` | Update profile |
| PUT | `/api/doctors/me/availability` | Update availability |
| GET | `/api/doctors/me/appointments` | Get appointments |
| PUT | `/api/doctors/me/appointments/:id/status` | Update appointment status |
| GET | `/api/doctors/me/stats` | Dashboard stats |

### Patient (Protected — Patient role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients/me/profile` | Get own profile |
| PUT | `/api/patients/me/profile` | Update profile |
| GET | `/api/patients/me/appointments` | Get own appointments |
| GET | `/api/patients/me/stats` | Dashboard stats |

### Appointments (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Book appointment (patient only) |
| GET  | `/api/appointments/:id` | Get single appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment (patient only) |

---

## 🔐 Authentication

All protected routes require the `Authorization: Bearer <token>` header.

The token is returned on login/register and stored in `localStorage`.

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose ODM
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- express-validator (input validation)
- morgan (request logging)
- cors, dotenv

**Frontend**
- React 18 + React Router v6
- Axios (HTTP client)
- Tailwind CSS
- react-toastify (notifications)
- Context API (global state)

# Elite Sports Club Management System (MERN Stack)

> **Train Better. Play Stronger. Achieve More.**  
> A full-stack web application designed for modern athletic clubs, sports centers, academies, and recreational complexes. Built with React (Vite), Express.js, Node.js, and MongoDB.

---

## 1. Project Overview

The **Elite Sports Club Management System** is an end-to-end web application that connects sports enthusiasts, coaches, and club administration into a single high-performance platform. 

It provides:
- A modern, responsive **Public Website** showcasing sports catalogues, courts, trainers, membership tiers, tournaments, and contact forms.
- A **Member Portal** where athletes can manage active memberships, reserve court timeslots, enroll in tournaments, review payment invoices, and receive announcements.
- A **SaaS Admin Control Center** featuring real-time KPI statistics, membership plan management, court availability control, booking approvals, payment tracking, CSV report generation, and announcement broadcasts.

---

## 2. Key Features

### Public Portal
- **Hero & Storytelling**: High-impact athletic imagery with responsive navigation and calls to action.
- **Sports Catalogue**: Complete catalog of 8 sports (Cricket, Football, Basketball, Badminton, Tennis, Volleyball, Swimming, Gym & Fitness) with filters, court capacities, and equipment guidelines.
- **Coach Directory**: Certified coach profiles with experience, ratings, and specialties.
- **Tournaments & Events**: Upcoming club competitions with prize pools and entry deadlines.
- **Membership Plans**: 4 pricing tiers (Monthly, Quarterly, Half-Yearly, Annual) rendered from MongoDB.
- **Contact Inquiries**: Client & server validated contact forms saved to database.

### Member Portal
- **Dashboard**: Membership status badges, active bookings, tournament registrations, and notifications.
- **Facility Booking**: Real-time slot reservation with backend conflict detection and capacity limits.
- **Event Registrations**: One-click tournament sign-up with deadline and seat limit enforcement.
- **Membership Checkout**: Verified checkout workflow with server-side price validation and demo payments.
- **Billing History**: Clean transaction ledger with demo payment receipts.
- **Notification Inbox**: Read/unread notifications for bookings, memberships, and club updates.
- **Profile & Security**: Member information editing and password change security.

### Admin Control Center
- **Live Statistics**: Dynamic calculation of total members, active sports, coaches, pending reservations, and revenue.
- **Charts**: Recharts visualizations for monthly registrations, booking distribution, and sports participation.
- **Member Management**: Search, filter, edit, activate/deactivate accounts.
- **Sports & Facilities**: Full CRUD for sports, rules, pricing, courts, and opening hours.
- **Coach Staff Management**: Add/edit trainers, specialties, and sports assignments.
- **Tournament Management**: Create events, manage participant rosters, and export rosters.
- **Booking Dispatch**: Approve, confirm, or reject reservations.
- **Pricing & Subscriptions**: Modify plan pricing, duration, and benefits.
- **Announcements**: Publish priority notices targeted to all members or coaches.
- **Analytical Reports & CSV Export**: Generate instant reports and download CSV files.

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js (`v18.3`) with Vite
- **Routing**: React Router DOM (`v6.23`)
- **Styling**: Bootstrap 5, Bootstrap Icons, Lucide React, and custom athletic CSS
- **State & Auth**: React Context API & Custom Hooks (`useAuth`)
- **HTTP Client**: Axios with automatic Bearer token interceptors
- **Visuals & Charts**: Recharts & React Toastify
- **Date Formatting**: Day.js

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM (`v8.4`)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs (10 salt rounds)
- **Validation**: express-validator
- **Security**: Helmet headers, CORS, HTTP-only cookies
- **Logging**: Morgan HTTP logger

### Testing & Tooling
- **Testing**: Jest (`v29.7`) & Supertest (`v7.0`)
- **Task Runner**: Concurrently & Cross-Env

---

## 4. Folder Structure

```
elite-sports-club/
│
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets (favicon, icons)
│   ├── src/
│   │   ├── assets/             # CSS design systems (variables, global, public, admin, member)
│   │   ├── components/
│   │   │   ├── common/         # Button, Loader, StatusBadge, Pagination, ProtectedRoute, etc.
│   │   │   ├── forms/          # FormInput, FormSelect, FormTextarea
│   │   │   └── layout/         # PublicNavbar, PublicFooter, AdminLayout, MemberLayout, etc.
│   │   ├── context/            # AuthContext (state, login, logout, refresh)
│   │   ├── hooks/              # useAuth hook
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, Sports, Coaches, Events, Plans, Contact, NotFound
│   │   │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── admin/          # Dashboard, Members, Sports, Facilities, Bookings, Reports, etc.
│   │   │   └── member/         # Dashboard, BrowseSports, BookSport, MyBookings, Profile, etc.
│   │   ├── services/           # Axios API services for all modules
│   │   ├── utils/              # formatDate, formatCurrency, validation
│   │   ├── App.jsx             # Route definitions & protection
│   │   └── main.jsx            # Application bootstrap
│   ├── .env                    # Client environment configuration
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Application (Node + Express + MongoDB)
│   ├── config/                 # Database connection logic
│   ├── controllers/            # Request handlers for all modules
│   ├── middleware/             # Auth, error handling, validation middleware
│   ├── models/                 # Mongoose schemas (User, Sport, Booking, Event, Payment, etc.)
│   ├── routes/                 # RESTful API route declarations
│   ├── scripts/                # Idempotent database seed script
│   ├── tests/                  # Automated integration tests with Supertest
│   ├── utils/                  # Token generators, CSV exporters
│   ├── validators/             # Request validation rules
│   ├── .env                    # Server environment variables
│   ├── package.json
│   └── server.js               # Express application entry point
│
├── docs/                       # Project Documentation
│   ├── API.md                  # RESTful API endpoint specifications
│   ├── DATABASE.md             # MongoDB database schema documentation
│   └── TESTING.md              # Test runner instructions and coverage
│
├── README.md                   # Complete beginner guide & documentation
├── package.json                # Root package for concurrently running client & server
└── .gitignore
```

---

## 5. Required Software

Before running the project, make sure you have:
1. **Node.js**: Version 18.x or 20.x or later ([Download Node.js](https://nodejs.org/)).
2. **npm**: Included with Node.js (`npm -v`).
3. **MongoDB**: Local MongoDB Community Edition or a free MongoDB Atlas Cloud connection string.

---

## 6. Installation & Setup Guide

### Step 1: Clone or Navigate to the Project Directory

```bash
cd "SCMS WITH ANTI"
```

### Step 2: Install All Dependencies

You can install all root, server, and client packages in one command:

```bash
npm run install:all
```

Or install them individually:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

---

## 7. Environment Variables Configuration

The project includes pre-configured environment files:

### Backend: `server/.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/elite_sports_club
JWT_SECRET=elite_sports_club_super_secure_jwt_secret_key_2026_xyz
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
```

*(If you use MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/elite_sports_club`)*

### Frontend: `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 8. Database Seeding

Populate the database with default accounts, sports, coaches, facilities, tournaments, membership plans, and sample bookings:

```bash
npm run seed
```

This script is **idempotent** (it can be run multiple times safely without creating duplicates or overwriting passwords).

---

## 9. Starting the Application

### Development Mode (Both Frontend & Backend Together)

From the project root folder, run:

```bash
npm run dev
```

This launches:
- **Backend API Server**: `http://localhost:5000`
- **Frontend Client (Vite)**: `http://localhost:5173`

Open your web browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 10. Default Login Credentials

You can log in at `http://localhost:5173/login`:

### 👑 Administrator Account
- **Email**: `admin@sportclub.local`
- **Password**: `Admin@12345`
- **Role**: `admin`
- **Redirects to**: `/admin/dashboard`

### 🏃 Member Account
- **Email**: `member@sportclub.local`
- **Password**: `Member@12345`
- **Role**: `member`
- **Redirects to**: `/member/dashboard`

*(Note: These credentials are created during the seed process for local demonstration. You can change passwords at any time from the Profile or Security page).*

---

## 11. Automated Testing

The test suite validates authentication, security constraints, booking conflict detection, and server-side pricing:

```bash
npm run test
```

### Test Coverage Highlights:
- ✅ Health check & public catalogue endpoints.
- ✅ New member registration & token delivery.
- ✅ Rejection of duplicate email addresses.
- ✅ Authentication failure on invalid password.
- ✅ Role-based protection: Members cannot access admin routes (HTTP 403).
- ✅ Role-based protection: Admins can access administrative endpoints (HTTP 200).
- ✅ Booking validation: Valid court slot reservation succeeds.
- ✅ Conflict Prevention: Overlapping booking on the same facility and date is rejected with HTTP 400.
- ✅ Tournament rules: Duplicate registration rejected.
- ✅ Server-side price calculation: Malicious client payment amounts are ignored in favor of database plan prices.

---

## 12. Production Build

To test and compile the production build of the React client:

```bash
npm run build
```

The compiled assets will be created in `client/dist`.

To run the production server:
```bash
npm start
```

---

## 13. Common Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **MongoDB connection error (`ECONNREFUSED 127.0.0.1:27017`)** | MongoDB service is not started on your machine. | Start MongoDB service in Windows Services or run `net start MongoDB` in an administrative terminal. If using Atlas, verify your connection string in `server/.env`. |
| **Port 5000 already in use** | Another Node or Python process is using port 5000. | Change `PORT=5001` in `server/.env` and update `VITE_API_URL=http://localhost:5001/api` in `client/.env`. |
| **Vite port 5173 taken** | Vite starts on 5174 if 5173 is busy. | Vite will automatically switch to `5174`. Check terminal output and visit the displayed URL. |
| **Unauthorized / Session Expired** | Expired JWT token in localStorage. | Click "Sign Out" or clear browser localStorage, then re-login with the credentials. |
| **Empty dashboards or 0 sports** | Database has not been seeded yet. | Run `npm run seed` from the root directory. |

---

## 14. College Faculty Demo Checklist

When demonstrating this project to faculty or examiners, recommend this order:
1. **Public Website**: Walk through the homepage, browse the sports catalogue, check the 4 membership plans, and submit a test inquiry on `/contact`.
2. **Member Experience**:
   - Log in as `member@sportclub.local`.
   - Show the personalized Member Dashboard.
   - Go to **Book a Sport**, select a court and time slot, and submit the booking.
   - Go to **Tournaments**, show the event list and register for an upcoming open tournament.
   - Go to **Membership**, click "Upgrade/Renew Plan", complete the demo payment, and show the instant membership update and invoice in **Payment History**.
   - Show **Notifications** with unread count badges.
3. **Admin Experience**:
   - Log in as `admin@sportclub.local`.
   - Show live analytics cards and Recharts graphs.
   - Open **Bookings**, locate the newly created member reservation, and approve it.
   - Open **Reports**, view live member growth and revenue statistics, and click "Export CSV".
   - Open **Announcements**, broadcast a club update, and show how it appears for members.
4. **Code & Architecture**:
   - Show `server/tests/api.test.js` and execute `npm run test` in terminal.
   - Show how models, controllers, and middleware enforce role-based access control and prevent booking conflicts.

---

## 15. License & Credits

Built for academic submission and demonstration.  
**Elite Sports Club Management System** — Clean, modular MERN architecture.

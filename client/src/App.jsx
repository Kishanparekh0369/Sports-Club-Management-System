import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Layouts & Protection
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import MemberLayout from './components/layout/MemberLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Sports from './pages/public/Sports';
import SportDetails from './pages/public/SportDetails';
import Coaches from './pages/public/Coaches';
import Events from './pages/public/Events';
import MembershipPlans from './pages/public/MembershipPlans';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminSports from './pages/admin/Sports';
import AdminCoaches from './pages/admin/Coaches';
import AdminEvents from './pages/admin/Events';
import AdminBookings from './pages/admin/Bookings';
import AdminFacilities from './pages/admin/Facilities';
import AdminMembershipPlans from './pages/admin/MembershipPlans';
import AdminMemberships from './pages/admin/Memberships';
import AdminPayments from './pages/admin/Payments';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminReports from './pages/admin/Reports';
import AdminProfile from './pages/admin/Profile';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import BrowseSports from './pages/member/BrowseSports';
import MemberSportDetails from './pages/member/SportDetails';
import MemberMembership from './pages/member/Membership';
import BookSport from './pages/member/BookSport';
import MyBookings from './pages/member/MyBookings';
import MemberEvents from './pages/member/Events';
import MyPayments from './pages/member/MyPayments';
import Notifications from './pages/member/Notifications';
import MemberProfile from './pages/member/Profile';
import MemberChangePassword from './pages/member/ChangePassword';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/sports/:id" element={<SportDetails />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/events" element={<Events />} />
        <Route path="/membership-plans" element={<MembershipPlans />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= ADMIN PROTECTED ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="sports" element={<AdminSports />} />
          <Route path="coaches" element={<AdminCoaches />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="facilities" element={<AdminFacilities />} />
          <Route path="membership-plans" element={<AdminMembershipPlans />} />
          <Route path="memberships" element={<AdminMemberships />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* ================= MEMBER PROTECTED ROUTES ================= */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={['member', 'admin']}>
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/member/dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="sports" element={<BrowseSports />} />
          <Route path="sports/:id" element={<MemberSportDetails />} />
          <Route path="membership" element={<MemberMembership />} />
          <Route path="book" element={<BookSport />} />
          <Route path="book/:sportId" element={<BookSport />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="events" element={<MemberEvents />} />
          <Route path="my-payments" element={<MyPayments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="change-password" element={<MemberChangePassword />} />
        </Route>

        {/* ================= 404 NOT FOUND ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

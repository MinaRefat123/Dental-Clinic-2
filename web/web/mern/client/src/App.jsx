import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import './index.css';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Contact from './pages/Contact';
import DoctorAppointments from './pages/DoctorAppointment';
import UserAppointmentsPage from './pages/UserAppointmentsPage';
import AdminDoctors from './pages/AdminDoctors';
import ProtectedRoute from './components/ProtectedRoute'; // Import the new ProtectedRoute component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('App useEffect - Token:', token, 'Role:', localStorage.getItem('role')); // Debug log
    setIsLoggedIn(!!token);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roleFromToken = payload.user?.role;
        if (roleFromToken) {
          localStorage.setItem('role', roleFromToken);
          setUserRole(roleFromToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Clear localStorage if token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/login', { replace: true });
      }
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  const navLinkClasses = "font-montserrat text-gray-600 hover:text-[#FF9999] transition duration-300 transform hover:scale-110";

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <motion.nav
        className="bg-white shadow-md sticky top-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                to="/"
                className="text-3xl font-bold font-montserrat text-[#FF9999] transition-all duration-300 hover:text-4xl"
              >
                Dental Clinic
              </Link>
            </motion.div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={navLinkClasses}>Home</Link>
              <Link to="/about" className={navLinkClasses}>About</Link>
              <Link to="/services" className={navLinkClasses}>Services</Link>
              <Link to="/contact" className={navLinkClasses}>Contact</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/account" className={navLinkClasses}>Account</Link>
                  <motion.button
                    onClick={handleLogout}
                    className={`${navLinkClasses} focus:outline-none`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    {userRole === 'user' && (
                      <Link
                        to="/appointments"
                        className="bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all"
                      >
                        Book
                      </Link>
                    )}
                    {userRole === 'doctor' && (
                      <Link
                        to="/doctor-appointments"
                        className="bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all"
                      >
                        My Schedule
                      </Link>
                    )}
                    {userRole === 'admin' && (
                      <>
                        <Link
                          to="/admin-appointments"
                          className="bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all mr-2"
                        >
                          Manage Appointments
                        </Link>
                        <Link
                          to="/admin-doctors"
                          className="bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                          Manage Doctors
                        </Link>
                      </>
                    )}
                  </motion.div>
                </>
              ) : (
                <>
                  <Link to="/login" className={navLinkClasses}>Login</Link>
                  <Link to="/signup" className={navLinkClasses}>Signup</Link>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    Book
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-[#FF9999] focus:outline-none"
                whileTap={{ scale: 0.9 }}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <i className={isOpen ? 'fas fa-times text-2xl' : 'fas fa-bars text-2xl'}></i>
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-white shadow-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="px-4 pt-2 pb-4 space-y-2">
                <Link to="/" className={navLinkClasses + " block"}>Home</Link>
                <Link to="/about" className={navLinkClasses + " block"}>About</Link>
                <Link to="/services" className={navLinkClasses + " block"}>Services</Link>
                <Link to="/contact" className={navLinkClasses + " block"}>Contact</Link>
                {isLoggedIn ? (
                  <>
                    <Link to="/account" className={navLinkClasses + " block"}>Account</Link>
                    <motion.button
                      onClick={handleLogout}
                      className={`${navLinkClasses} block focus:outline-none`}
                      whileTap={{ scale: 0.95 }}
                    >
                      Logout
                    </motion.button>
                    {userRole === 'user' && (
                      <Link
                        to="/appointments"
                        className="block bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full text-center shadow-md hover:shadow-lg"
                      >
                        Book
                      </Link>
                    )}
                    {userRole === 'doctor' && (
                      <Link
                        to="/doctor-appointments"
                        className="block bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full text-center shadow-md hover:shadow-lg"
                      >
                        My Schedule
                      </Link>
                    )}
                    {userRole === 'admin' && (
                      <>
                        <Link
                          to="/admin-appointments"
                          className="block bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full text-center shadow-md hover:shadow-lg"
                        >
                          Manage Appointments
                        </Link>
                        <Link
                          to="/admin-doctors"
                          className="block bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full text-center shadow-md hover:shadow-lg"
                        >
                          Manage Doctors
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/login" className={navLinkClasses + " block"}>Login</Link>
                    <Link to="/signup" className={navLinkClasses + " block"}>Signup</Link>
                    <Link
                      to="/login"
                      className="block bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-4 rounded-full text-center shadow-md hover:shadow-lg"
                    >
                      Book
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />

        {/* Protected Routes */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-appointments"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-appointments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-doctors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDoctors />
            </ProtectedRoute>
          }
        />
        <Route path="/booking" element={<Navigate to="/appointments" />} />
        <Route path="/user-dashboard" element={<Navigate to="/account" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
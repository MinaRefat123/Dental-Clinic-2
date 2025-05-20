import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileUpdateForm from '../components/ProfileUpdateForm';
import DentalHistoryView from '../components/DentalHistoryView';
import { getAppointments, getDoctorAppointments, getAllAppointments, getDoctors } from '../services/appointmentService';
import { getDoctorByUserId } from '../services/doctorService';
import DoctorSchedule from '../components/DoctorSchedule';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUser } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaTools } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({ name: '', email: '', specialty: '' });
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(localStorage.getItem('doctorId') || '');
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [availability, setAvailability] = useState({ date: '', startTime: '', endTime: '' });
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }

        // Decode token to check expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token is expired
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          navigate('/login', { replace: true });
          return;
        }

        try {
          const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const { name, email, specialty, _id, role } = profileResponse.data;
          setUserData({ name, email, specialty: specialty || '' });
          setUserRole(role);
          setUserId(_id);
          localStorage.setItem('role', role);
          localStorage.setItem('userId', _id);

          let appointmentData = [];
          if (role === 'doctor') {
            // Fetch doctorId from doctorService if not in localStorage
            let docId = localStorage.getItem('doctorId');
            if (!docId) {
              const doctor = await getDoctorByUserId(_id);
              docId = doctor._id;
              localStorage.setItem('doctorId', docId);
            }
            setDoctorId(docId);
            appointmentData = await getDoctorAppointments(docId);
          } else if (role === 'user') {
            appointmentData = await getAppointments();
          } else if (role === 'admin') {
            appointmentData = await getAllAppointments();
            const doctorData = await getDoctors();
            setDoctors(doctorData);
          }
          setAppointments(appointmentData);
          setError(null);
        } catch (err) {
          setError('Failed to load data.');
        } finally {
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    checkTokenAndFetchData();
  }, [navigate, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailability({ ...availability, [name]: value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
      } else {
        setError('Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/doctor/availability', { ...availability, doctorId: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Availability updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setAvailability({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
      } else {
        setError('Failed to update availability.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dental-history':
        return (
          <motion.div
            className="bg-white shadow-lg rounded-xl p-8 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DentalHistoryView userRole={userRole} />
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div
            className="bg-white shadow-lg rounded-xl p-8 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileUpdateForm
              onProfileUpdate={(updatedData) => {
                setUserData(updatedData);
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
              }}
            />
            {success && (
              <motion.div
                className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        );
      case 'appointments':
        return (
          <motion.div
            className="bg-white shadow-lg rounded-xl p-8 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-6">
              {userRole === 'user' ? 'Your Appointments' : userRole === 'doctor' ? 'Your Schedule' : 'All Appointments'}
            </h2>
            {userRole === 'user' && (
              <Link
                to="/appointments"
                className="inline-block mb-6 bg-[#FF9999] text-white font-montserrat font-bold py-2 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300"
              >
                Book Appointment
              </Link>
            )}
            {userRole === 'doctor' ? (
              <DoctorSchedule doctorId={doctorId} />
            ) : loading ? (
              <p className="text-center text-gray-600 font-open-sans">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-center text-gray-600 font-open-sans">No appointments found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 font-montserrat font-semibold text-gray-700">Title</th>
                      <th className="p-4 font-montserrat font-semibold text-gray-700">Date</th>
                      <th className="p-4 font-montserrat font-semibold text-gray-700">Time</th>
                      <th className="p-4 font-montserrat font-semibold text-gray-700">Details</th>
                      {userRole === 'admin' && (
                        <th className="p-4 font-montserrat font-semibold text-gray-700">Patient</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment._id} className="border-b hover:bg-gray-50 transition-all">
                        <td className="p-4 font-open-sans text-gray-600">{appointment.title}</td>
                        <td className="p-4 font-open-sans text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-open-sans text-gray-600">{appointment.time}</td>
                        <td className="p-4 font-open-sans text-gray-600">
                          {appointment.description || 'No notes'}
                        </td>
                        {userRole === 'admin' && (
                          <td className="p-4 font-open-sans text-gray-600">
                            {appointment.patientName || 'Unknown'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        );
      case 'admin-tools':
        if (userRole === 'admin') {
          const todayAppointments = appointments.filter(
            (appt) => new Date(appt.date).toDateString() === new Date().toDateString()
          );
          return (
            <motion.div
              className="bg-white shadow-lg rounded-xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-6">Admin Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link
                  to="/admin-appointments"
                  className="bg-[#FF9999] text-white font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300 text-center"
                >
                  Manage Appointments
                </Link>
                <Link
                  to="/admin-doctors"
                  className="bg-[#FF9999] text-white font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300 text-center"
                >
                  Manage Doctors
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">Total Appointments</h3>
                  <p className="text-3xl font-montserrat text-[#FF9999]">{appointments.length}</p>
                </motion.div>
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">Appointments Today</h3>
                  <p className="text-3xl font-montserrat text-[#FF9999]">{todayAppointments.length}</p>
                </motion.div>
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">Total Doctors</h3>
                  <p className="text-3xl font-montserrat text-[#FF9999]">{doctors.length}</p>
                </motion.div>
              </div>
              {doctors.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-2xl font-bold font-montserrat text-gray-800 mb-4">Recent Doctors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.slice(0, 4).map((doctor) => (
                      <div key={doctor._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="font-open-sans text-gray-600 font-semibold">{doctor.name}</p>
                        <p className="font-open-sans text-gray-500">{doctor.specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        }
        return null;
      case 'doctor-tools':
        if (userRole === 'doctor') {
          const upcomingAppointments = appointments
            .filter((appt) => new Date(appt.date) >= new Date())
            .slice(0, 3);
          return (
            <motion.div
              className="bg-white shadow-lg rounded-xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-6">Doctor Tools</h2>
              <Link
                to="/doctor-appointments"
                className="inline-block mb-6 bg-[#FF9999] text-white font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300"
              >
                Manage Full Schedule
              </Link>
              <div className="mb-8">
                <h3 className="text-2xl font-bold font-montserrat text-gray-800 mb-4">Set Availability</h3>
                <form onSubmit={handleAvailabilitySubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="date" className="block font-montserrat text-gray-700 font-semibold mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={availability.date}
                      onChange={handleAvailabilityChange}
                      className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="startTime" className="block font-montserrat text-gray-700 font-semibold mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={availability.startTime}
                      onChange={handleAvailabilityChange}
                      className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block font-montserrat text-gray-700 font-semibold mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={availability.endTime}
                      onChange={handleAvailabilityChange}
                      className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999] transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <motion.button
                      type="submit"
                      className="bg-[#FF9999] text-white font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Availability'}
                    </motion.button>
                  </div>
                </form>
              </div>
              {upcomingAppointments.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold font-montserrat text-gray-800 mb-4">Upcoming Appointments</h3>
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="bg-gray-50 p-4 rounded-lg mb-2 shadow-sm">
                      <p className="font-open-sans text-gray-600">
                        <strong>{appointment.title}</strong> - {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.section
        className="bg-gradient-to-br from-[#FF9999] to-pink-300 py-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold font-montserrat text-white tracking-tight drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome, {userData.name || 'User'}!
        </motion.h1>
        <motion.div
          className="inline-block mt-4 px-4 py-2 bg-white text-[#FF9999] font-montserrat font-semibold rounded-full shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Role: {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Unknown'}
        </motion.div>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-open-sans text-white max-w-3xl mx-auto drop-shadow-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {userRole === 'user'
            ? 'Manage your dental care with ease.'
            : userRole === 'doctor'
            ? 'Oversee your schedule and patient care.'
            : 'Administer clinic operations efficiently.'}
        </motion.p>
      </motion.section>

      <section className="py-16 max-w-6xl mx-auto px-4">
        {error && (
          <motion.div
            className="bg-red-100 text-red-700 p-4 rounded-lg mb-8 mx-auto max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            className="bg-green-100 text-green-700 p-4 rounded-lg mb-8 mx-auto max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {success}
          </motion.div>
        )}

        <div className="mb-8">
          <nav className="flex justify-center space-x-4 bg-white shadow-sm rounded-lg p-2">
            <motion.button
              className={`flex items-center py-3 px-6 font-montserrat font-semibold rounded-md transition-all duration-300 ${
                activeTab === 'profile' ? 'bg-[#FF9999] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUser className="mr-2" /> Profile
            </motion.button>
            <motion.button
              className={`flex items-center py-3 px-6 font-montserrat font-semibold rounded-md transition-all duration-300 ${
                activeTab === 'appointments' ? 'bg-[#FF9999] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('appointments')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCalendarAlt className="mr-2" /> Appointments
            </motion.button>
            {userRole === 'doctor' && (
              <motion.button
                className={`flex items-center py-3 px-6 font-montserrat font-semibold rounded-md transition-all duration-300 ${
                  activeTab === 'doctor-tools' ? 'bg-[#FF9999] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('doctor-tools')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTools className="mr-2" /> Tools
              </motion.button>
            )}
            {userRole === 'admin' && (
              <motion.button
                className={`flex items-center py-3 px-6 font-montserrat font-semibold rounded-md transition-all duration-300 ${
                  activeTab === 'admin-tools' ? 'bg-[#FF9999] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('admin-tools')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChartLine className="mr-2" /> Admin Tools
              </motion.button>
            )}
          </nav>
        </div>

        {renderTabContent()}
      </section>

      <motion.footer
        className="bg-[#333333] text-white py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Dental Clinic</h3>
            <p className="font-open-sans">Transforming smiles with care and precision.</p>
          </div>
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 font-open-sans">
              <li><Link to="/about" className="hover:text-[#FF9999] transition">About</Link></li>
              <li><Link to="/services" className="hover:text-[#FF9999] transition">Services</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF9999] transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-[#FF9999] transition" aria-label="Follow us on Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-2xl hover:text-[#FF9999] transition" aria-label="Follow us on Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-2xl hover:text-[#FF9999] transition" aria-label="Follow us on Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center font-open-sans text-gray-400">
          <p>© 2025 Dental Clinic. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Account;
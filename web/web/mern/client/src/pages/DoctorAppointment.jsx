import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDoctorAppointments, getAllAppointments } from '../services/appointmentService';
import { getDoctorByUserId } from '../services/doctorService';
import './DoctorAppointment.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const isAdminView = location.pathname === '/admin-appointments';
  const userId = localStorage.getItem('userId'); // Assume userId is stored on login
  const role = localStorage.getItem('role');
  const [doctorId, setDoctorId] = useState(localStorage.getItem('doctorId'));

  useEffect(() => {
    // If doctor and doctorId missing, fetch and store it
    if (role === 'doctor' && !doctorId && userId) {
      getDoctorByUserId(userId)
        .then(doctor => {
          localStorage.setItem('doctorId', doctor._id);
          setDoctorId(doctor._id);
        })
        .catch(err => {
          setError('Doctor profile not found.');
        });
    }
  }, [role, doctorId, userId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let data;
        if (isAdminView) {
          data = await getAllAppointments();
        } else if (role === 'doctor') {
          const docId = doctorId || localStorage.getItem('doctorId');
          if (docId) {
            data = await getDoctorAppointments(docId);
          } else {
            setError('Doctor profile not found.');
            setLoading(false);
            return;
          }
        } else {
          data = [];
        }
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [isAdminView, doctorId, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAvailability({ ...availability, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Placeholder for availability submission
      setSuccess('Availability updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setAvailability({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      setError('Failed to update availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.section
        className="bg-gradient-to-r from-[#FF9999] to-white py-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold font-montserrat text-gray-800 tracking-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isAdminView ? 'Manage All Appointments' : 'Your Appointment Schedule'}
        </motion.h1>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-open-sans text-gray-600 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isAdminView ? 'Oversee all patient bookings in the clinic.' : 'View and manage your patient appointments.'}
        </motion.p>
      </motion.section>

      <section className="py-24 max-w-6xl mx-auto px-4">
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

        {!isAdminView && (
          <motion.div
            className="mb-12 bg-white shadow-xl rounded-lg p-8 doctor-appointment-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-6">Set Availability</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block font-montserrat text-gray-600 font-semibold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={availability.date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="startTime" className="block font-montserrat text-gray-600 font-semibold mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={availability.startTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block font-montserrat text-gray-600 font-semibold mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={availability.endTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                  required
                  aria-required="true"
                />
              </div>
              <div className="md:col-span-3">
                <motion.button
                  type="submit"
                  className="bg-[#FF9999] text-white font-montserrat font-bold py-2 px-6 rounded-full hover:bg-pink-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  disabled={loading}
                  aria-label="Update availability"
                >
                  {loading ? 'Updating...' : 'Update Availability'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <motion.p
            className="text-center text-gray-600 font-open-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.p>
        ) : appointments.length === 0 ? (
          <motion.p
            className="text-center text-gray-600 font-open-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No appointments scheduled.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                className="bg-white shadow-lg rounded-lg p-6 appointment-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">{appointment.title}</h3>
                <p className="font-open-sans text-gray-600 mb-1">
                  <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p className="font-open-sans text-gray-600 mb-1">
                  <strong>Time:</strong> {appointment.time}
                </p>
                {appointment.description && (
                  <p className="font-open-sans text-gray-600 mb-4">
                    <strong>Notes:</strong> {appointment.description}
                  </p>
                )}
                {isAdminView && (
                  <p className="font-open-sans text-gray-600 mb-4">
                    <strong>Patient:</strong> {appointment.patientName || 'Unknown'}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
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

export default DoctorAppointments;
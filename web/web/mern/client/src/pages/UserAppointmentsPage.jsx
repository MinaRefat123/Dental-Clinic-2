import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for redirect
import { motion } from 'framer-motion';
import { getAppointments, createAppointment, getDoctors } from '../services/appointmentService';
import AppointmentCard from '../components/AppointmentCard';

const UserAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    doctorId: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // For redirecting to login if token is invalid

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appointmentData, doctorData] = await Promise.all([
          getAppointments().catch(err => {
            throw new Error(`Appointments fetch failed: ${err.message}`);
          }),
          getDoctors().catch(err => {
            if (err.message.includes('Token')) {
              // Redirect to login if token is invalid
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('userId');
              navigate('/login');
              throw new Error('Session expired. Please log in again.');
            }
            throw new Error(`Doctors fetch failed: ${err.message}`);
          })
        ]);
        setAppointments(appointmentData);
        // Handle the doctorData response
        if (doctorData.doctors) {
          // If backend returns { message, doctors }
          setDoctors(doctorData.doctors);
          if (doctorData.doctors.length === 0) {
            setError('No doctors available. Please contact an admin to add doctors.');
          }
        } else {
          // If backend returns an array directly
          setDoctors(doctorData);
          if (doctorData.length === 0) {
            setError('No doctors available. Please contact an admin to add doctors.');
          }
        }
      } catch (err) {
        setError(err.message.includes('Doctors fetch failed') ? 'Failed to load doctors. Please try again.' : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newAppointment = await createAppointment(formData);
      setAppointments([...appointments, newAppointment]);
      setFormData({ title: '', date: '', time: '', description: '', doctorId: '' });
      setSuccess('Appointment booked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Show backend error if available
      if (err && err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err && err.message) {
        setError(err.message);
      } else {
        setError('Failed to book appointment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (appointmentId) => {
    setAppointments(appointments.filter((appt) => appt._id !== appointmentId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-[#FF9999] to-white py-24 text-center overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' opacity='0.1'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold font-montserrat text-gray-800 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Book Your Dental Appointment
        </motion.h1>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-open-sans text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Schedule your visit with ease and manage your dental care.
        </motion.p>
      </motion.section>

      {/* Main Content */}
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

        {/* Create Appointment Form */}
        <motion.div
          className="mb-12 bg-white shadow-xl rounded-lg p-8 border-2 border-transparent bg-gradient-to-r from-[#FF9999]/10 to-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-6">Schedule an Appointment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Appointment Type
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cleaning, Checkup"
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="doctorId" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Doctor
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="time" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="description" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Additional Notes
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Any specific requests?"
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                rows="3"
              />
            </div>
            <div className="md:col-span-2">
              <motion.button
                type="submit"
                className="bg-[#FF9999] text-white font-montserrat font-bold py-2 px-6 rounded-full hover:bg-pink-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                disabled={loading || doctors.length === 0} // Disable if no doctors
                aria-label="Book appointment"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Appointments List */}
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
            No appointments booked yet.
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AppointmentCard appointment={appointment} onDelete={handleDelete} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Footer */}
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

export default UserAppointmentsPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createDoctor, deleteDoctor, getDoctors } from '../services/appointmentService';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getDoctors();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError('Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newDoctor = await createDoctor({ ...formData, role: 'doctor' });
      setDoctors([...doctors, newDoctor]);
      setFormData({ name: '', email: '', password: '', specialty: '' });
      setSuccess('Doctor added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add doctor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoctor(doctorId);
      setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
      setSuccess('Doctor deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete doctor.');
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
          Manage Doctors
        </motion.h1>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-open-sans text-gray-600 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Add and manage doctor accounts for the clinic.
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

        <motion.div
          className="mb-12 bg-white shadow-xl rounded-lg p-8 border-2 border-transparent bg-gradient-to-r from-[#FF9999]/10 to-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-6">Add New Doctor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Doctor's full name"
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="doctor@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="specialty" className="block font-montserrat text-gray-600 font-semibold mb-2">
                Specialty
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="e.g., Orthodontics"
                className="w-full p-3 border border-gray-300 rounded-lg font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                required
                aria-required="true"
              />
            </div>
            <div className="md:col-span-2">
              <motion.button
                type="submit"
                className="bg-[#FF9999] text-white font-montserrat font-bold py-2 px-6 rounded-full hover:bg-pink-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                disabled={loading}
                aria-label="Add doctor"
              >
                {loading ? 'Adding...' : 'Add Doctor'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {loading ? (
          <motion.p
            className="text-center text-gray-600 font-open-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.p>
        ) : doctors.length === 0 ? (
          <motion.p
            className="text-center text-gray-600 font-open-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No doctors added yet.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                className="bg-white shadow-lg rounded-lg p-6 border-2 border-transparent bg-gradient-to-r from-[#FF9999]/10 to-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">{doctor.name}</h3>
                <p className="font-open-sans text-gray-600 mb-1">
                  <strong>Email:</strong> {doctor.email}
                </p>
                <p className="font-open-sans text-gray-600 mb-4">
                  <strong>Specialty:</strong> {doctor.specialty}
                </p>
                <motion.button
                  onClick={() => handleDelete(doctor._id)}
                  className="bg-[#FF9999] text-white font-montserrat font-semibold py-1 px-3 rounded-full hover:bg-pink-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Delete doctor ${doctor.name}`}
                >
                  Delete
                </motion.button>
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

export default AdminDoctors;
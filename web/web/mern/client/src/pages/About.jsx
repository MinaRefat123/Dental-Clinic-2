import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { getDoctors } from '../services/appointmentService';

library.add(faUserDoctor);

const About = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-[#FF9999] to-white py-24 text-center overflow-hidden"
   
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold font-montserrat text-gray-800 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          About Our Legacy
        </motion.h1>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-open-sans text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Pioneering Excellence in Dental Care Since 2010
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-pink-400 to-[#FF9999] text-white font-montserrat py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
          >
            Get in Touch
          </a>
        </motion.div>
      </motion.section>

      {/* Mission Statement */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="bg-[#FF9999] rounded-full p-6 shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FontAwesomeIcon icon={faUserDoctor} className="text-white text-4xl" />
          </motion.div>
          <div>
            <motion.h2
              className="text-4xl font-extrabold font-montserrat text-gray-800 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our Mission & Vision
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 font-open-sans leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              At Dental Clinic, we are dedicated to delivering unparalleled dental care through innovation, precision, and a patient-centered approach. Our vision is to empower every individual with a confident, radiant smile by leveraging advanced technology and a compassionate team of experts.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <motion.h2
          className="text-5xl font-extrabold font-montserrat text-gray-800 text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Our Esteemed Team
        </motion.h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading doctors...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id || index}
                className="relative bg-white shadow-xl rounded-lg p-8 text-center group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF9999]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
                <div className="w-24 h-24 bg-[#FF9999] rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-3xl">
                  {doctor.name ? doctor.name.charAt(4) : '?'}
                </div>
                <h3 className="text-xl font-bold font-montserrat text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-[#FF9999] font-montserrat font-semibold mt-2">
                  {doctor.specialty}
                </p>
             
                {/* Optionally add a bio if you add it to the Doctor model */}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Call-to-Action Section */}
      <motion.section
        className="bg-gradient-to-r from-[#FF9999] to-pink-400 py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold font-montserrat text-white mb-6">
          Elevate Your Smile Today
        </h2>
        <p className="text-lg md:text-xl font-open-sans text-white max-w-2xl mx-auto mb-8">
          Embark on a journey to a healthier, more confident smile with our world-class dental expertise.
        </p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <a
            href="/booking"
            className="inline-block bg-white text-[#FF9999] font-montserrat font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Schedule Your Visit
          </a>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800 text-white py-12"
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
              <li><a href="/about" className="hover:text-[#FF9999] transition">About</a></li>
              <li><a href="/services" className="hover:text-[#FF9999] transition">Services</a></li>
              <li><a href="/contact" className="hover:text-[#FF9999] transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-[#FF9999] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-2xl hover:text-[#FF9999] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-2xl hover:text-[#FF9999] transition">
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

export default About;
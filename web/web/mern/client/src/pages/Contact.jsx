import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

library.add(faMapMarkerAlt, faPhone, faEnvelope);

const Contact = () => {
  // State for form inputs (placeholder for future backend integration)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Placeholder for backend submission
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-[#FF9999] to-white py-24 text-center overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' opacity='0.1'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          backgroundAttachment: 'fixed',
        }}
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
          Contact Us
        </motion.h1>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-open-sans text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          We’re Here to Help You Achieve a Perfect Smile
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="/booking"
            className="inline-block bg-gradient-to-r from-pink-400 to-[#FF9999] text-white font-montserrat py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
          >
            Book Now
          </a>
        </motion.div>
      </motion.section>

      {/* Contact Information Section */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <motion.h2
          className="text-4xl font-extrabold font-montserrat text-gray-800 text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Get in Touch
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#FF9999] text-4xl mb-4" />
            <h3 className="text-xl font-bold font-montserrat text-gray-800">Address</h3>
            <p className="text-gray-600 font-open-sans mt-2">
              123 Smile Street, Dental City, DC 12345
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FontAwesomeIcon icon={faPhone} className="text-[#FF9999] text-4xl mb-4" />
            <h3 className="text-xl font-bold font-montserrat text-gray-800">Phone</h3>
            <p className="text-gray-600 font-open-sans mt-2">
              (555) 123-4567
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-[#FF9999] text-4xl mb-4" />
            <h3 className="text-xl font-bold font-montserrat text-gray-800">Email</h3>
            <p className="text-gray-600 font-open-sans mt-2">
              info@dentalclinic.com
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gray-100">
        <motion.h2
          className="text-4xl font-extrabold font-montserrat text-gray-800 text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Send Us a Message
        </motion.h2>
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            className="bg-white shadow-xl rounded-lg p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-montserrat font-semibold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-montserrat font-semibold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-montserrat font-semibold mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                  placeholder="Your Phone Number"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-montserrat font-semibold mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 font-open-sans focus:outline-none focus:ring-2 focus:ring-[#FF9999]"
                  rows="5"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-pink-400 to-[#FF9999] text-white font-montserrat font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Send Message
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

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

export default Contact;
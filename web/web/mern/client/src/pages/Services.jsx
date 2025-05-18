import React from 'react';
import { motion } from 'framer-motion';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faTooth, faUserDoctor, faSyringe, faCrown, faTeeth, faShieldAlt, faStar } from '@fortawesome/free-solid-svg-icons';

library.add(faSmile, faTooth, faUserDoctor, faSyringe, faCrown, faTeeth, faShieldAlt, faStar);

const Services = () => {
  const services = [
    {
      title: 'Cosmetic Dentistry',
      description: 'Transform your smile with expert cosmetic treatments.',
      icon: faSmile,
    },
    {
      title: 'Orthodontics',
      description: 'Achieve perfectly aligned teeth with our expert orthodontic solutions.',
      icon: faTooth,
    },
    {
      title: 'Surgery',
      description: 'Precision dental surgery for lasting results, performed by specialists.',
      icon: faUserDoctor,
    },
    {
      title: 'Dental Implants',
      description: 'Seamless dental implants to restore your confidence and smile.',
      icon: faSyringe,
    },
    {
      title: 'Prosthodontics',
      description: 'Custom-crafted restorations for a natural, beautiful smile.',
      icon: faCrown,
    },
    {
      title: 'Root Canal Treatment',
      description: 'Pain-free root canal therapy to save your natural teeth.',
      icon: faTeeth,
    },
    {
      title: 'Gum Disease Treatment',
      description: 'Advanced care to protect and heal your gums effectively.',
      icon: faShieldAlt,
    },
  ];
    ///Back
  const testimonials = [
    { name: 'Sarah M.', quote: 'The team transformed my smile—I’ve never felt more confident!', rating: 5 },
    { name: 'John D.', quote: 'Professional, caring, and the best dental care I’ve ever experienced.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
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
          Exceptional Dental Services
        </motion.h1>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-open-sans text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Experience world-class dental care tailored to your unique needs with our expert team.
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
            Book Your Appointment Now
          </a>
        </motion.div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-5xl font-extrabold font-montserrat text-gray-800 text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Our Premium Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="relative bg-white shadow-xl rounded-lg p-8 border-t-4 border-[#FF9999] hover:shadow-2xl transition-all duration-500 group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF9999]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#FF9999] rounded-full p-4 shadow-lg">
                <FontAwesomeIcon icon={service.icon} className="text-white text-3xl" />
              </div>
              <h3 className="mt-10 text-2xl font-bold font-montserrat text-gray-800 text-center">
                {service.title}
              </h3>
              <p className="mt-4 text-gray-600 font-open-sans leading-relaxed text-center">
                {service.description}
              </p>
              <motion.div
                className="mt-6 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              >
                <a
                  href="/booking"
                  className="text-[#FF9999] font-montserrat font-semibold hover:underline"
                >
                  Book Now
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <motion.section
        className="bg-gray-100 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl font-extrabold font-montserrat text-gray-800 text-center mb-16">
          What Our Patients Say
        </h2>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="w-12 h-12 bg-[#FF9999] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="text-gray-600 font-open-sans italic mb-2">"{testimonial.quote}"</p>
                <p className="text-[#FF9999] font-montserrat font-semibold">{testimonial.name}</p>
                <div className="flex mt-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-sm mr-1" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call-to-Action Section */}
      <motion.section
        className="bg-gradient-to-r from-[#FF9999] to-pink-400 py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold font-montserrat text-white mb-6">
          Ready to Transform Your Smile?
        </h2>
        <p className="text-lg md:text-xl font-open-sans text-white max-w-2xl mx-auto mb-8">
          Schedule your appointment today and experience the best in dental care.
        </p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <a
            href="/booking"
            className="inline-block bg-white text-[#FF9999] font-montserrat font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Book Now
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

export default Services;
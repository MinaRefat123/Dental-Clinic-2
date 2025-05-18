import React from 'react';
import { motion } from 'framer-motion';
import { deleteAppointment } from '../services/appointmentService';

const AppointmentCard = ({ appointment, onDelete }) => {
  const { title, date, time, description, _id } = appointment;

  const handleCancel = async () => {
    try {
      await deleteAppointment(_id);
      onDelete(_id); // Notify parent to update state
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 border-2 border-transparent bg-gradient-to-r from-[#FF9999]/10 to-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">{title}</h3>
      <p className="font-open-sans text-gray-600 mb-1">
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>
      <p className="font-open-sans text-gray-600 mb-1">
        <strong>Time:</strong> {time}
      </p>
      {description && (
        <p className="font-open-sans text-gray-600 mb-4">
          <strong>Notes:</strong> {description}
        </p>
      )}
      <motion.button
        onClick={handleCancel}
        className="bg-[#FF9999] text-white font-montserrat font-semibold py-1 px-3 rounded-full hover:bg-pink-600 transition duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Cancel appointment"
      >
        Cancel
      </motion.button>
    </motion.div>
  );
};

export default AppointmentCard;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updateAppointmentStatus } from '../services/appointmentService';

const AppointmentStatusManager = ({ appointment, onStatusUpdate }) => {
  const [status, setStatus] = useState(appointment.status || 'pending');
  const [notes, setNotes] = useState(appointment.notes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusBadge = (statusValue) => {
    const option = statusOptions.find(opt => opt.value === statusValue) || statusOptions[0];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${option.color}`}>
        {option.label}
      </span>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await updateAppointmentStatus(appointment._id, { status, notes });
      setIsEditing(false);
      
      if (onStatusUpdate) {
        onStatusUpdate(result.appointment);
      }
    } catch (err) {
      setError(err.message || 'Failed to update appointment status');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!isEditing ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="font-medium">Status:</span>
            {getStatusBadge(status)}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm px-3 py-1 bg-[#FF9999] text-white rounded-lg hover:bg-pink-600 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            Change Status
          </motion.button>
        </div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
        >
          <h4 className="font-medium mb-3">Update Appointment Status</h4>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-[#FF9999] focus:border-[#FF9999]"
              disabled={loading}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded focus:ring-[#FF9999] focus:border-[#FF9999]"
              placeholder="Add any notes about this status change"
              disabled={loading}
            ></textarea>
          </div>
          
          <div className="flex space-x-2 justify-end">
            <button
              type="button"
              className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#FF9999] text-white rounded hover:bg-pink-600 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center space-x-1">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving</span>
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default AppointmentStatusManager;

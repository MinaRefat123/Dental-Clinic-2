import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { axiosWithAuth, getUserProfile } from '../services/authService';

const ProfileUpdateForm = ({ onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    address: '',
    gender: '',
    dateOfBirth: '',
    emergencyContact: '',
    insuranceInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await getUserProfile();

        // Format date to YYYY-MM-DD for input[type="date"]
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date instanceof Date && !isNaN(date) 
            ? date.toISOString().split('T')[0] 
            : '';
        };

        const user = response.data || {};
        setFormData({
          name: user.name || '',
          email: user.email || '',
          age: user.age || '',
          phone: user.phone || '',
          address: user.address || '',
          gender: user.gender || '',
          dateOfBirth: formatDate(user.dateOfBirth),
          emergencyContact: user.emergencyContact || '',
          insuranceInfo: user.insuranceInfo || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Profile updated successfully!');
      
      // Call the callback function if provided
      if (onProfileUpdate) {
        onProfileUpdate(response.data);
      }
      
      // Automatically clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9999]"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Your Profile</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <motion.div 
          className="bg-green-100 text-green-700 p-4 rounded-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {success}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="1"
              max="120"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact
            </label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
              placeholder="Name and phone number"
            />
          </div>
          
          <div>
            <label htmlFor="insuranceInfo" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Information
            </label>
            <input
              type="text"
              id="insuranceInfo"
              name="insuranceInfo"
              value={formData.insuranceInfo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
              placeholder="Provider and policy number"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-[#FF9999] to-pink-500 text-white font-montserrat py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : 'Update Profile'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileUpdateForm;

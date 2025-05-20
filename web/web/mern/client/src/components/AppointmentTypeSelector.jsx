import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faTooth, faUserDoctor, faSyringe, faCrown, faTeeth, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const AppointmentTypeSelector = ({ onSelect, selectedType }) => {
  const [services, setServices] = useState([]);
  const [value, setValue] = useState(selectedType || '');
  
  useEffect(() => {
    // These should match the services from the Services.jsx page
    setServices([
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
      }
    ]);
  }, []);

  const handleTypeChange = (newValue) => {
    setValue(newValue);
    if (onSelect) {
      onSelect(newValue);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Select Appointment Type</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
              value === service.title 
                ? 'border-[#FF9999] bg-[#FF9999]/10 shadow-md' 
                : 'border-gray-200 hover:border-[#FF9999]/50 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTypeChange(service.title)}
          >
            <div className="flex items-center space-x-3">
              <div className={`text-lg p-2 rounded-full ${
                value === service.title ? 'bg-[#FF9999] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <FontAwesomeIcon icon={service.icon} />
              </div>
              <div className="font-medium">{service.title}</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{service.description}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Custom option for other services */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Or specify another service
        </label>
        <input
          type="text"
          value={!services.some(s => s.title === value) ? value : ''}
          onChange={(e) => handleTypeChange(e.target.value)}
          placeholder="E.g., Teeth Whitening, Dental Cleaning, etc."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF9999] focus:border-[#FF9999]"
        />
      </div>
    </div>
  );
};

export default AppointmentTypeSelector;

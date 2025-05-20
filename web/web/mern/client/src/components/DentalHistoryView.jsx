import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserDentalHistory, getPatientDentalHistory, addTreatmentRecord } from '../services/dentalHistoryService';

const DentalHistoryView = ({ patientId, userRole }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dentalHistory, setDentalHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('treatments');
  
  // For treatment record form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    treatmentType: '',
    description: '',
    notes: '',
    images: []
  });

  useEffect(() => {
    const fetchDentalHistory = async () => {
      setLoading(true);
      try {
        let result;
        
        // If viewing as doctor/admin and patientId is provided
        if ((userRole === 'doctor' || userRole === 'admin') && patientId) {
          result = await getPatientDentalHistory(patientId);
        } else {
          // User viewing their own history
          result = await getUserDentalHistory();
        }
        
        setDentalHistory(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch dental history');
        console.error('Error fetching dental history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDentalHistory();
  }, [patientId, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const targetPatientId = patientId || dentalHistory.patientId;
      await addTreatmentRecord(targetPatientId, formData);
      
      // Refresh the dental history
      let result;
      if ((userRole === 'doctor' || userRole === 'admin') && patientId) {
        result = await getPatientDentalHistory(patientId);
      } else {
        result = await getUserDentalHistory();
      }
      
      setDentalHistory(result);
      setShowForm(false);
      setFormData({
        treatmentType: '',
        description: '',
        notes: '',
        images: []
      });
      
    } catch (err) {
      setError(err.message || 'Failed to add treatment record');
      console.error('Error adding treatment record:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dentalHistory) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9999]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dental History</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'treatments'
                ? 'border-[#FF9999] text-[#FF9999]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('treatments')}
          >
            Treatment History
          </button>
          <button
            className={`${
              activeTab === 'medical'
                ? 'border-[#FF9999] text-[#FF9999]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('medical')}
          >
            Medical Information
          </button>
          <button
            className={`${
              activeTab === 'treatment-plan'
                ? 'border-[#FF9999] text-[#FF9999]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('treatment-plan')}
          >
            Treatment Plan
          </button>
          {(userRole === 'doctor' || userRole === 'admin') && (
            <button
              className={`${
                activeTab === 'xrays'
                  ? 'border-[#FF9999] text-[#FF9999]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('xrays')}
            >
              X-Rays
            </button>
          )}
          {userRole === 'admin' && (
            <button
              className={`${
                activeTab === 'payments'
                  ? 'border-[#FF9999] text-[#FF9999]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('payments')}
            >
              Payment History
            </button>
          )}
        </nav>
      </div>
      
      {/* Content */}
      <div className="mt-6">
        {activeTab === 'treatments' && (
          <div>
            {(userRole === 'doctor' || userRole === 'admin') && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mb-4 bg-[#FF9999] text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
              >
                {showForm ? 'Cancel' : 'Add Treatment Record'}
              </button>
            )}
            
            {showForm && (
              <form onSubmit={handleAddTreatment} className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Treatment Type
                    </label>
                    <input
                      type="text"
                      name="treatmentType"
                      value={formData.treatmentType}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#FF9999] focus:border-[#FF9999]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#FF9999] focus:border-[#FF9999]"
                      required
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#FF9999] focus:border-[#FF9999]"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#FF9999] text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            )}
            
            {dentalHistory && dentalHistory.treatmentRecords && dentalHistory.treatmentRecords.length > 0 ? (
              <div className="space-y-4">
                {dentalHistory.treatmentRecords.map((record, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{record.treatmentType}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{record.description}</p>
                    {record.notes && (
                      <p className="text-gray-600 mt-2 text-sm italic">Notes: {record.notes}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-2">
                      Performed by: {record.doctorName}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No treatment records available</p>
            )}
          </div>
        )}
        
        {activeTab === 'medical' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Medical Information</h3>
            
            {dentalHistory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Medical Conditions</h4>
                  {dentalHistory.medicalConditions && dentalHistory.medicalConditions.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {dentalHistory.medicalConditions.map((condition, index) => (
                        <li key={index} className="text-gray-600">{condition}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No medical conditions listed</p>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
                  {dentalHistory.allergies && dentalHistory.allergies.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {dentalHistory.allergies.map((allergy, index) => (
                        <li key={index} className="text-gray-600">{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No allergies listed</p>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
                  {dentalHistory.currentMedications && dentalHistory.currentMedications.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {dentalHistory.currentMedications.map((med, index) => (
                        <li key={index} className="text-gray-600">
                          {med.name} - {med.dosage} ({med.frequency})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No medications listed</p>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Family Dental History</h4>
                  {dentalHistory.familyDentalHistory ? (
                    <p className="text-gray-600">{dentalHistory.familyDentalHistory}</p>
                  ) : (
                    <p className="text-gray-500 italic">No family dental history available</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No medical information available</p>
            )}
          </div>
        )}
        
        {activeTab === 'treatment-plan' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Treatment Plan</h3>
            
            {dentalHistory ? (
              <div className="border border-gray-200 rounded-lg p-6">
                {dentalHistory.treatmentPlan ? (
                  <>
                    <p className="text-gray-700">{dentalHistory.treatmentPlan}</p>
                    
                    {dentalHistory.nextRecommendedVisit && (
                      <div className="mt-4 p-3 bg-[#FF9999]/10 rounded-lg">
                        <p className="font-medium">
                          Next Recommended Visit: {new Date(dentalHistory.nextRecommendedVisit).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 italic text-center py-4">No treatment plan available</p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No treatment plan information available</p>
            )}
          </div>
        )}
        
        {activeTab === 'xrays' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">X-Ray Records</h3>
            
            {dentalHistory && dentalHistory.xrayHistory && dentalHistory.xrayHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dentalHistory.xrayHistory.map((xray, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    {xray.imageUrl && (
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={xray.imageUrl} 
                          alt={`X-ray ${xray.type}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{xray.type}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(xray.date).toLocaleDateString()}
                        </span>
                      </div>
                      {xray.findings && (
                        <p className="mt-2 text-sm text-gray-600">{xray.findings}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No X-ray records available</p>
            )}
          </div>
        )}
        
        {activeTab === 'payments' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Payment History</h3>
            
            {dentalHistory && dentalHistory.paymentHistory && dentalHistory.paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dentalHistory.paymentHistory.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.invoiceNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No payment records available</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DentalHistoryView;

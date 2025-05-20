import { axiosWithAuth } from './authService';

const API_URL = 'http://localhost:5000/api/dental-history';

// Get current user's dental history
export const getUserDentalHistory = async () => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dental history:', error);
    throw error.response ? error.response.data : error;
  }
};

// Get specific patient's dental history (for doctors/admins)
export const getPatientDentalHistory = async (patientId) => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient dental history:', error);
    throw error.response ? error.response.data : error;
  }
};

// Add treatment record to patient's history
export const addTreatmentRecord = async (patientId, recordData) => {
  try {
    const response = await axiosWithAuth().post(`${API_URL}/${patientId}/treatment`, recordData);
    return response.data;
  } catch (error) {
    console.error('Error adding treatment record:', error);
    throw error.response ? error.response.data : error;
  }
};

// Update patient's medical information
export const updateMedicalInfo = async (patientId, medicalData) => {
  try {
    const response = await axiosWithAuth().put(`${API_URL}/${patientId}/medical`, medicalData);
    return response.data;
  } catch (error) {
    console.error('Error updating medical info:', error);
    throw error.response ? error.response.data : error;
  }
};

// Update teeth condition
export const updateTeethCondition = async (patientId, teethData) => {
  try {
    const response = await axiosWithAuth().put(`${API_URL}/${patientId}/teeth`, teethData);
    return response.data;
  } catch (error) {
    console.error('Error updating teeth condition:', error);
    throw error.response ? error.response.data : error;
  }
};

// Add X-ray record
export const addXrayRecord = async (patientId, xrayData) => {
  try {
    const response = await axiosWithAuth().post(`${API_URL}/${patientId}/xray`, xrayData);
    return response.data;
  } catch (error) {
    console.error('Error adding X-ray record:', error);
    throw error.response ? error.response.data : error;
  }
};

// Update treatment plan
export const updateTreatmentPlan = async (patientId, planData) => {
  try {
    const response = await axiosWithAuth().put(`${API_URL}/${patientId}/plan`, planData);
    return response.data;
  } catch (error) {
    console.error('Error updating treatment plan:', error);
    throw error.response ? error.response.data : error;
  }
};

// Add payment record
export const addPaymentRecord = async (patientId, paymentData) => {
  try {
    const response = await axiosWithAuth().post(`${API_URL}/${patientId}/payment`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error adding payment record:', error);
    throw error.response ? error.response.data : error;
  }
};

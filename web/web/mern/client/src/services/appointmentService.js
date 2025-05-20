import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointment';
const AUTH_URL = 'http://localhost:5000/api/auth';
const DOCTOR_URL = 'http://localhost:5000/api/doctor';

export const getAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw { message: 'Failed to load appointments', error: error.message };
  }
};

export const getDoctorAppointments = async (doctorId) => {
  try {
    if (!doctorId) {
      console.error('getDoctorAppointments called without a doctorId');
      throw new Error('Doctor ID is required');
    }
    
    console.log(`[Service] Fetching appointments for doctor: ${doctorId}`);
    const response = await axios.get(`${API_URL}/doctor-appointments/${doctorId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    // Ensure we get an array back
    const appointments = Array.isArray(response.data) ? response.data : [];
    console.log(`[Service] Retrieved ${appointments.length} appointments for doctor`);
    
    return appointments;
  } catch (error) {
    console.error('[Service] Error fetching doctor appointments:', error);
    throw { message: 'Failed to load doctor appointments', error: error.message };
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-appointments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    throw { message: 'Failed to load all appointments', error: error.message };
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    // Validate doctorId is present
    if (!appointmentData.doctorId) {
      console.error('[AppointmentService] No doctorId provided for appointment');
      throw new Error('Doctor selection is required');
    }
    
    console.log('[AppointmentService] Creating appointment with doctorId:', appointmentData.doctorId);
    
    const response = await axios.post(`${API_URL}/create`, appointmentData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    console.log('[AppointmentService] Appointment created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[AppointmentService] Error creating appointment:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw { message: error.response.data.message, error: error.message };
    }
    throw { message: 'Failed to create appointment', error: error.message };
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${appointmentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw { message: 'Failed to delete appointment', error: error.message };
  }
};

export const updateAppointmentStatus = async (appointmentId, statusData) => {
  try {
    const response = await axios.patch(`${API_URL}/status/${appointmentId}`, statusData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw { message: error.response.data.message };
    }
    throw { message: 'Failed to update appointment status', error: error.message };
  }
};

export const createDoctor = async (doctorData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/doctor`, doctorData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw { message: 'Failed to create doctor', error: error.message };
  }
};

export const deleteDoctor = async (doctorId) => {
  try {
    const response = await axios.delete(`${AUTH_URL}/doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw { message: 'Failed to delete doctor', error: error.message };
  }
};

export const getDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/doctors`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw { message: 'Failed to load doctors', error: error.message };
  }
};

export const getDoctorAvailability = async (doctorId) => {
  try {
    const response = await axios.get(`${DOCTOR_URL}/availability/${doctorId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    throw { message: 'Failed to load doctor availability', error: error.message };
  }
};
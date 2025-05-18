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
    const response = await axios.get(`${API_URL}/doctor-appointments/${doctorId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
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
    const response = await axios.post(`${API_URL}/create`, appointmentData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
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
    return response.data;
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
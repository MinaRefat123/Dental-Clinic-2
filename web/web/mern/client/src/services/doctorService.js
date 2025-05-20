import axios from 'axios';

const DOCTOR_URL = 'http://localhost:5000/api/doctor';

export const getDoctorByUserId = async (userId) => {
  const response = await axios.get(`${DOCTOR_URL}/by-user/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

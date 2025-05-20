import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create and export a reusable axios instance with auth headers
export const axiosWithAuth = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// Helper to extract user info from token and store in localStorage
export const processToken = (token, responseData = null) => {
  if (!token) return null;
  
  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded token payload:', payload);
    
    // Extract and save user information
    if (payload.user) {
      const { id, role, name, email, specialty } = payload.user;
      
      // Store essential user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('role', role);
      
      // Check if this is a doctor response with direct doctorId
      if (role === 'doctor') {
        // If response data has a doctorId field (from standalone doctor login)
        if (responseData && responseData.doctorId) {
          localStorage.setItem('doctorId', responseData.doctorId);
          console.log('Stored direct doctorId:', responseData.doctorId);
        } 
        // If the payload indicates this is a direct doctor account
        else if (payload.user.isDirectDoctor) {
          localStorage.setItem('doctorId', id); // For standalone doctors, id == doctorId
          console.log('Stored doctorId from direct doctor account:', id);
        }
      }
      
      return { 
        userId: id, 
        role, 
        name, 
        email, 
        specialty,
        doctorId: localStorage.getItem('doctorId') || null 
      };
    }
    return null;
  } catch (err) {
    console.error('Error processing token:', err);
    return null;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;
    
    // Process and store token data
    const userData = processToken(token);
    return { token, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user - clear all auth data
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decode token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('role');
};

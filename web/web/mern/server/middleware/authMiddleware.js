const jwt = require('jsonwebtoken');
const Doctor = require('../Models/Doctor');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader ? 'Present' : 'Missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid Bearer token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Token extracted:', token ? 'Valid' : 'Empty');

  if (!token) {
    console.log('Token is empty after extraction');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token payload:', {
      id: decoded.user?.id,
      role: decoded.user?.role,
      exp: decoded.exp,
    });

    if (!decoded.user || !decoded.user.id || !decoded.user.role) {
      console.error('Invalid token payload structure:', decoded);
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Set base user properties from the token
    req.user = {
      id: decoded.user.id,
      role: decoded.user.role,
      email: decoded.user.email,
      name: decoded.user.name,
    };

    // If this is a doctor token, add the doctorId property directly
    // This helps the frontend and APIs know this is a standalone doctor
    if (decoded.user.role === 'doctor') {
      // Check if this is a direct doctor account (not via User)
      if (decoded.user.isDirectDoctor) {
        console.log('Processing token for standalone doctor account');
        req.user.doctorId = decoded.user.id; // For standalone doctors, id == doctorId
        req.user.isDirectDoctor = true;
      } else {
        // Find the doctor record to get the proper doctorId
        try {
          // For backward compatibility, check by name and email if the doctor exists
          const doctor = await Doctor.findOne({ 
            $or: [
              { _id: decoded.user.id },  // Direct match (new system)
              { email: decoded.user.email } // Indirect match (old system)
            ]
          });
          
          if (doctor) {
            req.user.doctorId = doctor._id;
            console.log('Found doctor record, doctorId:', doctor._id);
          } else {
            console.log('No doctor record found for this token');
          }
        } catch (err) {
          console.error('Error finding doctor record:', err);
        }
      }
    }

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};
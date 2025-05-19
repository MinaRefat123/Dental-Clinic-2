const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
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

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token validation error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Token validation failed' });
  }
};
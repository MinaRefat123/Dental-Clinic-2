const express = require('express');
const router = express.Router();
const { setAvailability, getAvailability, getDoctorByUserId } = require('../Controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/availability', authMiddleware, setAvailability);
router.get('/availability/:doctorId', authMiddleware, getAvailability);

// New: get doctor by userId
router.get('/by-user/:userId', authMiddleware, getDoctorByUserId);

module.exports = router;
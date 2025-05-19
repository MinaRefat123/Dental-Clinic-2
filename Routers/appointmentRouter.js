const express = require('express');
const router = express.Router();
const { getAppointments, getDoctorAppointments, getAllAppointments, getDoctors, createAppointment, deleteAppointment } = require('../Controllers/AppointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/appointments', authMiddleware, getAppointments);
router.get('/doctor-appointments/:doctorId', authMiddleware, getDoctorAppointments);
router.get('/all-appointments', authMiddleware, getAllAppointments);
router.get('/doctors', authMiddleware, getDoctors);
router.post('/create', authMiddleware, createAppointment);
router.delete('/:id', authMiddleware, deleteAppointment);

module.exports = router;
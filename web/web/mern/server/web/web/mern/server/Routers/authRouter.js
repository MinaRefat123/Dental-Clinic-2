const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, createDoctor, deleteDoctor } = require('../Controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/doctor', authMiddleware, createDoctor);
router.delete('/doctor/:doctorId', authMiddleware, deleteDoctor);

module.exports = router;
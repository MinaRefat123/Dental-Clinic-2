const express = require('express');
const router = express.Router();
const { setAvailability, getAvailability } = require('../Controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/availability', authMiddleware, setAvailability);
router.get('/availability/:doctorId', authMiddleware, getAvailability);

module.exports = router;
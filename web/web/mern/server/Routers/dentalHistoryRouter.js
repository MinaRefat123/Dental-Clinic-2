const express = require('express');
const router = express.Router();
const dentalHistoryController = require('../Controllers/dentalHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Get patient's dental history
router.get('/:patientId', authMiddleware, dentalHistoryController.getPatientDentalHistory);

// Get current user's dental history
router.get('/', authMiddleware, dentalHistoryController.getPatientDentalHistory);

// Add treatment record
router.post('/:patientId/treatment', authMiddleware, dentalHistoryController.addTreatmentRecord);

// Update medical information
router.put('/:patientId/medical', authMiddleware, dentalHistoryController.updateMedicalInfo);

// Update teeth condition
router.put('/:patientId/teeth', authMiddleware, dentalHistoryController.updateTeethCondition);

// Add X-ray record
router.post('/:patientId/xray', authMiddleware, dentalHistoryController.addXrayRecord);

// Update treatment plan
router.put('/:patientId/plan', authMiddleware, dentalHistoryController.updateTreatmentPlan);

// Add payment record
router.post('/:patientId/payment', authMiddleware, dentalHistoryController.addPaymentRecord);

module.exports = router;

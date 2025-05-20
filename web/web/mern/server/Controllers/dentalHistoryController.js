const DentalHistory = require('../Models/DentalHistory');
const User = require('../Models/User');

// Get dental history for a specific patient
exports.getPatientDentalHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.user.id;
    
    // Check permissions - only allow the patient themselves, doctors, or admins
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized: You cannot access this dental history' });
    }
    
    // Find or create dental history for the patient
    let dentalHistory = await DentalHistory.findOne({ patientId });
    
    if (!dentalHistory) {
      // If no history exists, create a new empty one
      const patient = await User.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      dentalHistory = new DentalHistory({
        patientId,
        treatmentRecords: [],
        medicalConditions: [],
        allergies: [],
        currentMedications: []
      });
      await dentalHistory.save();
    }
    
    res.json(dentalHistory);
  } catch (error) {
    console.error('Error fetching dental history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new treatment record to patient's dental history
exports.addTreatmentRecord = async (req, res) => {
  try {
    const { patientId, treatmentType, description, notes, images } = req.body;
    
    // Validate doctor/admin permissions
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Unauthorized: Only doctors and admins can add treatment records' });
    }
    
    // Find the patient
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Find or create dental history for the patient
    let dentalHistory = await DentalHistory.findOne({ patientId });
    if (!dentalHistory) {
      dentalHistory = new DentalHistory({
        patientId,
        treatmentRecords: [],
        medicalConditions: [],
        allergies: [],
        currentMedications: []
      });
    }
    
    // Add new treatment record
    const newRecord = {
      date: new Date(),
      treatmentType,
      description,
      performedBy: req.user.id,
      doctorName: req.user.name,
      notes,
      images: images || []
    };
    
    dentalHistory.treatmentRecords.push(newRecord);
    await dentalHistory.save();
    
    res.status(201).json({
      message: 'Treatment record added successfully',
      record: newRecord
    });
  } catch (error) {
    console.error('Error adding treatment record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medical information (conditions, allergies, medications)
exports.updateMedicalInfo = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.user.id;
    const { medicalConditions, allergies, currentMedications, familyDentalHistory, oralHygieneHabits } = req.body;
    
    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized: You cannot update this dental history' });
    }
    
    // Find or create dental history
    let dentalHistory = await DentalHistory.findOne({ patientId });
    if (!dentalHistory) {
      dentalHistory = new DentalHistory({ patientId });
    }
    
    // Update fields if provided
    if (medicalConditions) dentalHistory.medicalConditions = medicalConditions;
    if (allergies) dentalHistory.allergies = allergies;
    if (currentMedications) dentalHistory.currentMedications = currentMedications;
    if (familyDentalHistory) dentalHistory.familyDentalHistory = familyDentalHistory;
    if (oralHygieneHabits) dentalHistory.oralHygieneHabits = oralHygieneHabits;
    
    await dentalHistory.save();
    
    res.json({
      message: 'Medical information updated successfully',
      dentalHistory
    });
  } catch (error) {
    console.error('Error updating medical info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update teeth condition
exports.updateTeethCondition = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { missingTeeth, filledTeeth, implants, crowns } = req.body;
    
    // Validate doctor permissions
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Unauthorized: Only doctors and admins can update teeth condition' });
    }
    
    // Find dental history
    let dentalHistory = await DentalHistory.findOne({ patientId });
    if (!dentalHistory) {
      return res.status(404).json({ message: 'Dental history not found for this patient' });
    }
    
    // Update teeth condition
    dentalHistory.teethCondition = {
      missingTeeth: missingTeeth || dentalHistory.teethCondition?.missingTeeth || [],
      filledTeeth: filledTeeth || dentalHistory.teethCondition?.filledTeeth || [],
      implants: implants || dentalHistory.teethCondition?.implants || [],
      crowns: crowns || dentalHistory.teethCondition?.crowns || []
    };
    
    await dentalHistory.save();
    
    res.json({
      message: 'Teeth condition updated successfully',
      teethCondition: dentalHistory.teethCondition
    });
  } catch (error) {
    console.error('Error updating teeth condition:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add X-ray record
exports.addXrayRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { type, imageUrl, findings } = req.body;
    
    // Validate doctor permissions
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Unauthorized: Only doctors and admins can add X-ray records' });
    }
    
    // Find dental history
    let dentalHistory = await DentalHistory.findOne({ patientId });
    if (!dentalHistory) {
      return res.status(404).json({ message: 'Dental history not found for this patient' });
    }
    
    // Add X-ray record
    const newXray = {
      date: new Date(),
      type,
      imageUrl,
      findings
    };
    
    dentalHistory.xrayHistory.push(newXray);
    await dentalHistory.save();
    
    res.status(201).json({
      message: 'X-ray record added successfully',
      xrayRecord: newXray
    });
  } catch (error) {
    console.error('Error adding X-ray record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update treatment plan and next visit
exports.updateTreatmentPlan = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { treatmentPlan, nextRecommendedVisit } = req.body;
    
    // Validate doctor permissions
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Unauthorized: Only doctors and admins can update treatment plans' });
    }
    
    // Find dental history
    let dentalHistory = await DentalHistory.findOne({ patientId });
    if (!dentalHistory) {
      return res.status(404).json({ message: 'Dental history not found for this patient' });
    }
    
    // Update treatment plan
    if (treatmentPlan) dentalHistory.treatmentPlan = treatmentPlan;
    if (nextRecommendedVisit) dentalHistory.nextRecommendedVisit = new Date(nextRecommendedVisit);
    
    await dentalHistory.save();
    
    res.json({
      message: 'Treatment plan updated successfully',
      treatmentPlan: dentalHistory.treatmentPlan,
      nextRecommendedVisit: dentalHistory.nextRecommendedVisit
    });
  } catch (error) {
    console.error('Error updating treatment plan:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add payment record
exports.addPaymentRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { amount, service, paymentMethod, invoiceNumber } = req.body;
    
    // Validate admin permissions (only admins should handle payments)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only admins can add payment records' });
    }
    
    // Find dental history
    let dentalHistory = await DentalHistory.findOne({ patientId });
    if (!dentalHistory) {
      return res.status(404).json({ message: 'Dental history not found for this patient' });
    }
    
    // Add payment record
    const newPayment = {
      date: new Date(),
      amount,
      service,
      paymentMethod,
      invoiceNumber
    };
    
    dentalHistory.paymentHistory.push(newPayment);
    await dentalHistory.save();
    
    res.status(201).json({
      message: 'Payment record added successfully',
      paymentRecord: newPayment
    });
  } catch (error) {
    console.error('Error adding payment record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

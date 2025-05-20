const mongoose = require('mongoose');

const dentalHistorySchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  treatmentRecords: [{
    date: { type: Date, required: true },
    treatmentType: { type: String, required: true },
    description: { type: String, required: true },
    performedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    doctorName: { type: String },
    notes: { type: String },
    images: [{ type: String }]
  }],
  medicalConditions: [{ type: String }],
  allergies: [{ type: String }],
  currentMedications: [{ 
    name: { type: String },
    dosage: { type: String },
    frequency: { type: String }
  }],
  familyDentalHistory: { type: String },
  oralHygieneHabits: { type: String },
  lastCheckupDate: { type: Date },
  xrayHistory: [{
    date: { type: Date },
    type: { type: String },
    imageUrl: { type: String },
    findings: { type: String }
  }],
  teethCondition: {
    missingTeeth: [{ type: Number }],
    filledTeeth: [{ type: Number }],
    implants: [{ type: Number }],
    crowns: [{ type: Number }]
  },
  nextRecommendedVisit: { type: Date },
  treatmentPlan: { type: String },
  paymentHistory: [{
    date: { type: Date },
    amount: { type: Number },
    service: { type: String },
    paymentMethod: { type: String },
    invoiceNumber: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('DentalHistory', dentalHistorySchema);

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  appointmentType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: { type: String },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'], default: 'pending' },
  notes: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
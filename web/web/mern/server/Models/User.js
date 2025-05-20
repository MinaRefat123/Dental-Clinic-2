const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
  specialty: { type: String, required: function() { return this.role === 'doctor'; } },
  age: { type: Number },
  phone: { type: String },
  address: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dateOfBirth: { type: Date },
  profileImage: { type: String },
  emergencyContact: { type: String },
  insuranceInfo: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
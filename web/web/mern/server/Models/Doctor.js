const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialty: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'doctor' },
  phone: { type: String },
  active: { type: Boolean, default: true },
  avatar: { type: String },
  availability: {
    days: [{ type: String }],
    startTime: { type: String },
    endTime: { type: String }
  }
}, { timestamps: true });

doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

doctorSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);
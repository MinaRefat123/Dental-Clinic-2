const User = require('../Models/User');
const Doctor = require('../Models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user._id, role: user.role, name: user.name, email: user.email } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated for signup:', token);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // First check user collection
    let user = await User.findOne({ email });
    let isDoctor = false;
    let doctorData = null;
    
    // If not in users collection, check doctors collection
    if (!user) {
      doctorData = await Doctor.findOne({ email });
      if (!doctorData) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      isDoctor = true;
      // Check doctor password
      const isMatch = await doctorData.isValidPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Create payload for doctor
      const payload = { 
        user: { 
          id: doctorData._id, 
          role: 'doctor', 
          name: doctorData.name, 
          email: doctorData.email,
          specialty: doctorData.specialty
        } 
      };
      
      // Generate token
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated for doctor login:', token);
      
      // Store doctorId directly in localStorage
      return res.json({
        token,
        user: { 
          id: doctorData._id, 
          name: doctorData.name, 
          email: doctorData.email, 
          role: 'doctor',
          specialty: doctorData.specialty,
          isDirectDoctor: true
        },
        doctorId: doctorData._id  // send doctorId directly
      });
    }
    
    // Regular user login
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id, role: user.role, name: user.name, email: user.email } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated for user login:', token);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting profile for userId:', userId, 'role:', req.user.role);
    
    // Check if this is a standalone doctor
    if (req.user.role === 'doctor' && (req.user.isDirectDoctor || req.user.doctorId)) {
      // First try to find by doctorId if available
      const doctorId = req.user.doctorId || userId;
      console.log('Looking for doctor profile with doctorId:', doctorId);
      
      const doctor = await Doctor.findById(doctorId).select('-password');
      if (doctor) {
        console.log('Found doctor profile for standalone doctor');
        return res.json({
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: 'doctor',
          specialty: doctor.specialty,
          phone: doctor.phone,
          isDirectDoctor: true
        });
      }
    }
    
    // Fallback to user collection for regular users or legacy doctor accounts
    console.log('Looking for profile in User collection');
    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.log('No user profile found for ID:', userId);
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // If this is a legacy doctor, try to get additional doctor info
    if (user.role === 'doctor') {
      try {
        const doctorInfo = await Doctor.findOne({ userId: user._id });
        if (doctorInfo) {
          user.specialty = doctorInfo.specialty || user.specialty;
        }
      } catch (err) {
        console.error('Error fetching additional doctor info:', err);
      }
    }
    
    console.log('Found user profile in User collection');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, specialty, phone } = req.body;
    console.log('Updating profile for user:', userId, 'role:', req.user.role);

    // Input validation
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Create update data with common fields
    const updateData = { name };
    if (email) updateData.email = email;
    if (specialty && req.user.role === 'doctor') updateData.specialty = specialty;
    if (phone && req.user.role === 'doctor') updateData.phone = phone;

    // Check if this is a standalone doctor account
    if (req.user.role === 'doctor' && (req.user.isDirectDoctor || req.user.doctorId)) {
      const doctorId = req.user.doctorId || userId;
      console.log('Updating standalone doctor profile with ID:', doctorId);
      
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      
      console.log('Doctor profile updated successfully');
      return res.json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: 'doctor',
        specialty: doctor.specialty,
        phone: doctor.phone,
        isDirectDoctor: true
      });
    }

    // For regular users or legacy doctors, update the user record
    console.log('Updating regular user profile');
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is a legacy doctor, also update the doctor record
    if (user.role === 'doctor') {
      try {
        const doctorRecord = await Doctor.findOne({ userId: user._id });
        if (doctorRecord) {
          console.log('Updating associated doctor record');
          const doctorUpdateData = {};
          if (name) doctorUpdateData.name = name;
          if (email) doctorUpdateData.email = email;
          if (specialty) doctorUpdateData.specialty = specialty;
          if (phone) doctorUpdateData.phone = phone;
          
          await Doctor.findByIdAndUpdate(doctorRecord._id, doctorUpdateData);
        }
      } catch (err) {
        console.error('Error updating associated doctor record:', err);
      }
    }

    console.log('Regular user profile updated successfully');
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty || ''
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only admins can create doctors' });
    }

    const { name, email, password, specialty, phone } = req.body;

    // Input validation
    if (!name || !email || !password || !specialty) {
      return res.status(400).json({ message: 'Name, email, password, and specialty are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check if doctor already exists with this email
    let existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    // Create directly in doctors collection without user entry
    const doctor = new Doctor({
      name,
      email,
      password, // Will be hashed by pre-save hook
      specialty,
      phone: phone || '',
      role: 'doctor'
    });
    
    // Save doctor (password will be automatically hashed by pre-save hook)
    await doctor.save();

    res.status(201).json({ 
      message: 'Doctor created successfully',
      doctor: { 
        _id: doctor._id, 
        name: doctor.name, 
        email: doctor.email, 
        specialty: doctor.specialty 
      }
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only admins can delete doctors' });
    }

    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await Doctor.findByIdAndDelete(doctorId);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
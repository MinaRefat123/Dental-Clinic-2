const mongoose = require('mongoose');
const Appointment = require('../Models/Appointment');
const User = require('../Models/User');
const Doctor = require('../Models/Doctor');

/**
 * Get all appointments for the currently logged-in user (patient)
 */
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[API] Fetching appointments for patient: ${userId}`);
    
    const appointments = await Appointment.find({ patientId: userId })
      .sort({ date: 1, time: 1 }) // Sort by date and time
      .populate('doctorId', 'name specialty'); // Get doctor details
    
    console.log(`[API] Found ${appointments.length} appointments for patient ${userId}`);
    res.json(appointments);
  } catch (error) {
    console.error('[API] Error fetching patient appointments:', error);
    res.status(500).json({ success: false, message: 'Failed to load appointments', error: error.message });
  }
};

/**
 * Get all appointments for a specific doctor
 * Uses string comparison to ensure ID formats match properly
 */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    console.log(`[API] Fetching appointments for doctor: ${doctorId}`);
    
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      console.log(`[API] Invalid doctorId format: ${doctorId}`);
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }
    
    // Find appointments by doctorId (string match for consistency)
    const appointments = await Appointment.find({ 
      doctorId: doctorId.toString() 
    }).sort({ date: 1, time: 1 });
    
    console.log(`[API] Found ${appointments.length} appointments for doctor ${doctorId}`);
    res.json(appointments);
  } catch (error) {
    console.error('[API] Error fetching doctor appointments:', error);
    res.status(500).json({ success: false, message: 'Failed to load doctor appointments', error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('name specialty email');
    if (!doctors || doctors.length === 0) {
      return res.status(200).json({ message: 'No doctors available', doctors: [] });
    }
    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status, notes } = req.body;
    
    // Validate admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only admins can update appointment status' });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Update appointment status
    appointment.status = status;
    if (notes) appointment.notes = notes;
    appointment.updatedBy = req.user.id;
    
    await appointment.save();
    
    res.json({ 
      message: 'Appointment status updated successfully',
      appointment 
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { title, appointmentType, date, time, description, doctorId } = req.body;
    const patientId = req.user.id;

    if (req.user.role !== 'user' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only users and admins can create appointments' });
    }

    // Find the patient user
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Find the doctor (using our updated doctor model)
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.error(`Doctor not found with ID: ${doctorId}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    console.log(`Creating appointment for patient ${patient.name} with doctor ${doctor.name}`);
    // doctorId from the doctor collection is correctly passed along

    
    const [reqHours, reqMinutes] = time.split(':').map(Number);
    if (reqHours < 9 || (reqHours === 23 && reqMinutes > 0) || reqHours > 23) {
      return res.status(400).json({ message: 'Appointments can only be booked between 9 AM and 11 PM.' });
    }

    
    const requestedDate = new Date(date);
    if (isNaN(requestedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    requestedDate.setHours(reqHours, reqMinutes, 0, 0);
    const requestedStartTime = requestedDate.getTime();

    
    const requestedEndTime = requestedStartTime + 60 * 60 * 1000; // 1 hour in milliseconds
    const endHours = new Date(requestedEndTime).getHours();
    if (endHours > 23 || (endHours === 23 && new Date(requestedEndTime).getMinutes() > 0)) {
      return res.status(400).json({ message: 'Appointment end time exceeds 11 PM limit.' });
    }

    console.log(`Requested Appointment: Start=${new Date(requestedStartTime).toISOString()}, End=${new Date(requestedEndTime).toISOString()}`);

   
    const requestedDateOnly = new Date(requestedDate);
    requestedDateOnly.setHours(0, 0, 0, 0);

    //  appointments for the same doctor on the same day
    const existingAppointments = await Appointment.find({
      doctorId,
      date: {
        $gte: requestedDateOnly,
        $lt: new Date(requestedDateOnly.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Check for conflicts
    for (const appt of existingAppointments) {
      const [apptHours, apptMinutes] = appt.time.split(':').map(Number);
      const apptDate = new Date(appt.date);
      apptDate.setHours(apptHours, apptMinutes, 0, 0);
      const apptStartTime = apptDate.getTime();
      const apptEndTime = apptStartTime + 60 * 60 * 1000; // One-hour duration

      console.log(`Existing Appointment: Start=${new Date(apptStartTime).toISOString()}, End=${new Date(apptEndTime).toISOString()}`);

     
      if (
        (requestedStartTime < apptEndTime && requestedEndTime > apptStartTime) ||
        (requestedStartTime === apptStartTime) 
      ) {
        return res.status(400).json({ message: 'Appointments must be at least one hour long and cannot overlap with existing bookings.' });
      }
    }

    const appointment = new Appointment({
      title,
      appointmentType,
      date: requestedDate,
      time,
      description,
      patientId,
      patientName: patient.name,
      doctorId,
      doctorName: doctor.name,
      status: 'pending'
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    
    if (req.user.role !== 'admin' && req.user.id !== appointment.patientId.toString() && !(req.user.role === 'doctor' && req.user.id === appointment.doctorId.toString())) {
      return res.status(403).json({ message: 'Unauthorized: Only the patient, doctor, or admin can delete this appointment' });
    }

    await Appointment.findByIdAndDelete(appointmentId);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
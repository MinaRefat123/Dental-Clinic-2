const Appointment = require('../Models/Appointment');
const User = require('../Models/User');
const Doctor = require('../Models/Doctor');

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ patientId: userId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctorId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { title, date, time, description, doctorId } = req.body;
    const patientId = req.user.id;

    if (req.user.role !== 'user' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only users and admins can create appointments' });
    }

    const patient = await User.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Patient or doctor not found' });
    }

    
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
      date: requestedDate,
      time,
      description,
      patientId,
      patientName: patient.name,
      doctorId,
      doctorName: doctor.name
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
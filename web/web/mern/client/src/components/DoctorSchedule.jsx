import React, { useEffect, useState } from 'react';
import { getDoctorAppointments } from '../services/appointmentService';

const DoctorSchedule = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0); // For manual refresh functionality

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format appointment time
  const formatTime = (timeString) => {
    // If time is in 24hr format like "14:30", convert to "2:30 PM"
    if (timeString && timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12; // Convert to 12-hour format
      return `${formattedHour}:${minutes} ${ampm}`;
    }
    return timeString; // Return as-is if not in expected format
  };

  // Get CSS class for appointment status
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800'; // pending
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) {
        console.log('[DoctorSchedule] No doctorId provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('[DoctorSchedule] Fetching appointments with doctorId:', doctorId);
        
        // Validate doctorId format
        if (doctorId.length !== 24 || !/^[0-9a-f]+$/i.test(doctorId)) {
          console.warn('[DoctorSchedule] doctorId format may be incorrect:', doctorId);
        }
        
        const data = await getDoctorAppointments(doctorId);
        console.log('[DoctorSchedule] Appointments fetched:', data);
        
        if (Array.isArray(data)) {
          // Sort appointments by date and time
          const sortedAppointments = [...data].sort((a, b) => {
            return new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time);
          });
          setAppointments(sortedAppointments);
        } else {
          console.error('[DoctorSchedule] Unexpected response format:', data);
          setAppointments([]);
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('[DoctorSchedule] Error fetching appointments:', err);
        setError('Failed to load schedule: ' + (err.message || 'Unknown error'));
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId, refresh]);

  if (!doctorId) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold font-montserrat text-[#FF9999]">Your Schedule</h3>
          <button 
            onClick={() => setRefresh(prev => prev + 1)}
            className="bg-[#FF9999] text-white px-3 py-1 rounded-md hover:bg-pink-600 transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="text-center text-red-500 mb-4">Doctor profile not found</div>
        <div className="text-center text-gray-500 text-sm">Please contact administrator to set up your doctor profile</div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold font-montserrat text-[#FF9999]">Your Schedule</h3>
          <div className="animate-pulse bg-gray-200 w-20 h-8 rounded-md"></div>
        </div>
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9999]"></div>
        </div>
        <div className="text-center text-gray-500">Loading your appointments...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold font-montserrat text-[#FF9999]">Your Schedule</h3>
          <button 
            onClick={() => setRefresh(prev => prev + 1)}
            className="bg-[#FF9999] text-white px-3 py-1 rounded-md hover:bg-pink-600 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
          <p className="text-red-600">{error}</p>
          <p className="text-gray-500 text-sm mt-2">Try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold font-montserrat text-[#FF9999]">Your Schedule</h3>
        <button 
          onClick={() => setRefresh(prev => prev + 1)}
          className="bg-[#FF9999] text-white px-3 py-1 rounded-md hover:bg-pink-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-5xl mb-4">📅</div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Scheduled</h4>
          <p className="text-gray-500">Your schedule is clear. Check back later for new appointments.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Appointment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">{appt.title}</div>
                    <div className="text-sm text-gray-500">{appt.appointmentType}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{formatDate(appt.date)}</td>
                  <td className="px-4 py-4 text-gray-700">{formatTime(appt.time)}</td>
                  <td className="px-4 py-4 text-gray-700">
                    <div className="font-medium">{appt.patientName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(appt.status)}`}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;

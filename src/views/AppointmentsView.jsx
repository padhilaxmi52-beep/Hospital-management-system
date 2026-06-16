import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, User, Stethoscope, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function AppointmentsView() {
  const { 
    appointments, 
    patients, 
    doctors, 
    bookAppointment, 
    updateAppointmentStatus, 
    session 
  } = useContext(AppContext);

  const isPatient = session?.user?.role === 'patient';
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleOpenModal = () => {
    setPatientId(patients.length > 0 ? patients[0].id : '');
    setDoctorId(doctors.length > 0 ? doctors[0].id : '');
    setDate('');
    setTime('');
    setReason('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!patientId || !doctorId || !date || !time || !reason) return;
    bookAppointment({
      patientId,
      doctorId,
      date,
      time: formatTime(time),
      reason
    });
    setIsModalOpen(false);
  };

  // Helper to convert 24hr input format (e.g. 14:30) to 12hr AM/PM format (e.g. 02:30 PM)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'badge-secondary'; // Green
      case 'Completed': return 'badge-info'; // Teal/Blue
      case 'Cancelled': return 'badge-danger'; // Red
      default: return 'badge-warning'; // Yellow (Pending)
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Clinic Appointments</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Schedule, confirm, and complete patient consultations.</p>
        </div>
        {!isPatient && (
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={18} /> Schedule Appointment
          </button>
        )}
      </div>

      {/* Appointments List Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={styles.th}>Appt ID</th>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Assigned Doctor</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Consultation Reason</th>
                <th style={styles.th}>Status</th>
                {!isPatient && <th style={styles.th} style={{ ...styles.th, textAlign: 'center' }}>Manage Status</th>}
              </tr>
            </thead>
            <tbody>
              {appointments.slice().reverse().map((app) => {
                const patient = patients.find(p => p.id === app.patientId);
                const doctor = doctors.find(d => d.id === app.doctorId);
                return (
                  <tr key={app.id} style={styles.tr}>
                    <td style={styles.td}><strong>{app.id}</strong></td>
                    <td style={styles.td}>
                      {patient ? `${patient.name} (${app.patientId})` : app.patientId}
                    </td>
                    <td style={styles.td}>
                      {doctor ? doctor.name : app.doctorId}
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: 600 }}>{app.date}</span> at <span style={{ color: 'var(--text-muted)' }}>{app.time}</span>
                    </td>
                    <td style={styles.td}>{app.reason}</td>
                    <td style={styles.td}>
                      <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    {!isPatient && (
                      <td style={styles.td} style={{ ...styles.td, textAlign: 'center' }}>
                        <select
                          value={app.status}
                          onChange={(e) => updateAppointmentStatus(app.id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirm</option>
                          <option value="Completed">Complete</option>
                          <option value="Cancelled">Cancel</option>
                        </select>
                      </td>
                    )}
                  </tr>
                );
              })}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={isPatient ? 6 : 7} style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No appointments scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal (Staff Flow) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Clinic Appointment"
        onSave={handleSave}
        saveText="Schedule Visit"
        isSaveDisabled={!patientId || !doctorId || !date || !time || !reason}
      >
        <form style={styles.modalForm} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label className="form-label" htmlFor="appPatient">Select Patient</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <select
                id="appPatient"
                className="form-control"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                style={styles.inputWithIcon}
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
                {patients.length === 0 && <option value="">No Patients Available</option>}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appDoctor">Select Doctor</label>
            <div style={styles.inputWrapper}>
              <Stethoscope size={16} style={styles.inputIcon} />
              <select
                id="appDoctor"
                className="form-control"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                style={styles.inputWithIcon}
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
                {doctors.length === 0 && <option value="">No Doctors Available</option>}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appDate">Appointment Date</label>
            <div style={styles.inputWrapper}>
              <Calendar size={16} style={styles.inputIcon} />
              <input
                type="date"
                id="appDate"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appTime">Appointment Time</label>
            <div style={styles.inputWrapper}>
              <Clock size={16} style={styles.inputIcon} />
              <input
                type="time"
                id="appTime"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appReason">Reason for Consultation</label>
            <div style={styles.inputWrapper}>
              <AlertCircle size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="appReason"
                className="form-control"
                placeholder="Routine full body physical"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  th: {
    padding: '16px 24px',
    textAlign: 'left',
    background: 'var(--bg-app)',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  td: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.925rem',
  },
  tr: {
    transition: 'var(--transition)',
  },
  statusSelect: {
    background: '#ffffff',
    border: '1.5px solid var(--border-color)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
    color: 'var(--text-main)',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    color: 'var(--text-light)',
    pointerEvents: 'none',
  },
  inputWithIcon: {
    paddingLeft: 42,
  }
};

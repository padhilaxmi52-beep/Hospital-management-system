import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Modal from '../../components/Modal';
import { Calendar, Clock, Stethoscope, AlertCircle, Plus, XCircle } from 'lucide-react';

export default function PatientAppointments() {
  const { 
    appointments, 
    doctors, 
    bookAppointment, 
    updateAppointmentStatus, 
    session 
  } = useContext(AppContext);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  // Filter appointments for this patient
  const myAppointments = appointments.filter(a => a.patientId === session?.user?.id);

  const handleOpenModal = () => {
    setDoctorId(doctors.length > 0 ? doctors[0].id : '');
    setDate('');
    setTime('');
    setReason('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!doctorId || !date || !time || !reason) return;
    bookAppointment({
      patientId: session.user.id,
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
      case 'Completed': return 'badge-info'; // Blue
      case 'Cancelled': return 'badge-danger'; // Red
      default: return 'badge-warning'; // Yellow (Pending)
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Consultations</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Schedule appointments and manage your hospital visits.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      {/* Appointment History Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={styles.th}>Appt ID</th>
                <th style={styles.th}>Specialist Doctor</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Current Status</th>
                <th style={styles.th} style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.slice().reverse().map((app) => {
                const doctor = doctors.find(d => d.id === app.doctorId);
                const canCancel = app.status === 'Pending' || app.status === 'Confirmed';
                return (
                  <tr key={app.id} style={styles.tr}>
                    <td style={styles.td}><strong>{app.id}</strong></td>
                    <td style={styles.td}>
                      {doctor ? `${doctor.name} (${doctor.specialization})` : app.doctorId}
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
                    <td style={styles.td} style={{ ...styles.td, textAlign: 'center' }}>
                      {canCancel ? (
                        <button
                          className="btn btn-ghost"
                          onClick={() => updateAppointmentStatus(app.id, 'Cancelled')}
                          style={styles.cancelBtn}
                          title="Cancel Appointment"
                        >
                          <XCircle size={16} style={{ marginRight: 4 }} /> Cancel
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>No Actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {myAppointments.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    You have no consultations scheduled. Click "Book Appointment" to request a slot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Clinical Consultation"
        onSave={handleSave}
        saveText="Book Appointment"
        isSaveDisabled={!doctorId || !date || !time || !reason}
      >
        <form style={styles.modalForm} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label className="form-label" htmlFor="appDoctor">Choose Doctor</label>
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
            <label className="form-label" htmlFor="appDate">Preferred Date</label>
            <div style={styles.inputWrapper}>
              <Calendar size={16} style={styles.inputIcon} />
              <input
                type="date"
                id="appDate"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.inputWithIcon}
                min={new Date().toISOString().split('T')[0]} // only allow current and future dates
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appTime">Preferred Time</label>
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
                placeholder="Fever, cough, or general checkup details"
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
  cancelBtn: {
    color: 'var(--danger)',
    fontSize: '0.85rem',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
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

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Clipboard, User, Stethoscope, AlertCircle, FileText } from 'lucide-react';

export default function RecordsView() {
  const { records, patients, doctors, addRecord } = useContext(AppContext);
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenModal = () => {
    setPatientId(patients.length > 0 ? patients[0].id : '');
    setDoctorId(doctors.length > 0 ? doctors[0].id : '');
    setProblem('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!patientId || !doctorId || !problem || !description) return;
    addRecord({
      patientId,
      doctorId,
      problem,
      description
    });
    setIsModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Clinical Medical Records</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure health records and diagnostic archives.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <Plus size={18} /> New Medical Record
        </button>
      </div>

      {/* Records Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={styles.th}>Record ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Assigned Doctor</th>
                <th style={styles.th}>Diagnosis/Problem</th>
                <th style={styles.th}>Description & Treatment Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.slice().reverse().map((rec) => {
                const patient = patients.find(p => p.id === rec.patientId);
                const doctor = doctors.find(d => d.id === rec.doctorId);
                return (
                  <tr key={rec.id} style={styles.tr}>
                    <td style={styles.td}><strong>{rec.id}</strong></td>
                    <td style={styles.td}>{rec.date}</td>
                    <td style={styles.td}>
                      {patient ? `${patient.name} (${rec.patientId})` : rec.patientId}
                    </td>
                    <td style={styles.td}>
                      {doctor ? doctor.name : rec.doctorId}
                    </td>
                    <td style={styles.td}>
                      <span className="badge badge-warning">{rec.problem}</span>
                    </td>
                    <td style={styles.td} style={{ ...styles.td, whiteSpace: 'normal', maxBreak: 300 }}>
                      {rec.description}
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No medical records logged in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Medical Record"
        onSave={handleSave}
        saveText="Save Record"
        isSaveDisabled={!patientId || !doctorId || !problem || !description}
      >
        <form style={styles.modalForm} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="recPatient">Select Patient</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <select
                id="recPatient"
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
            <label className="form-label" htmlFor="recDoctor">Attending Specialist</label>
            <div style={styles.inputWrapper}>
              <Stethoscope size={16} style={styles.inputIcon} />
              <select
                id="recDoctor"
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
            <label className="form-label" htmlFor="recProblem">Diagnosis/Problem Summary</label>
            <div style={styles.inputWrapper}>
              <AlertCircle size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="recProblem"
                className="form-control"
                placeholder="High Blood Pressure, Sprained Ankle"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recDesc">Clinical Notes & Treatment Plan</label>
            <div style={styles.inputWrapper}>
              <FileText size={16} style={{ ...styles.inputIcon, top: 14 }} />
              <textarea
                id="recDesc"
                className="form-control"
                placeholder="Patient reports acute joint pain. Advised MRI scan and prescribed Ibuprofen 400mg twice daily for 5 days."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...styles.inputWithIcon, minHeight: 100, resize: 'vertical' }}
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

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { Search, Plus, Trash2, UserPlus, MapPin, Stethoscope, Clipboard } from 'lucide-react';

export default function PatientsView() {
  const { patients, doctors, addPatient, deletePatient } = useContext(AppContext);
  const [search, setSearch] = useState('');
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorId, setDoctorId] = useState('');

  // Filter patients by search term
  const filteredPatients = patients.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase()) || 
         p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
         p.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = () => {
    setName('');
    setAddress('');
    setDiagnosis('');
    setDoctorId(doctors.length > 0 ? doctors[0].id : '');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !address || !diagnosis) return;
    addPatient({
      name,
      address,
      diagnosis,
      admissionDate: new Date().toISOString().split('T')[0],
      doctorId
    });
    setIsModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Patient Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>View, search, and register hospital patients.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <Plus size={18} /> Register Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={styles.searchCard}>
        <Search size={18} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search patients by ID, name, or diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Patients Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Diagnosis</th>
                <th style={styles.th}>Attending Doctor</th>
                <th style={styles.th}>Admitted On</th>
                <th style={styles.th} style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => {
                const doc = doctors.find(d => d.id === p.doctorId);
                return (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}><strong>{p.id}</strong></td>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.address}</td>
                    <td style={styles.td}>
                      <span className="badge badge-info">{p.diagnosis}</span>
                    </td>
                    <td style={styles.td}>
                      {doc ? doc.name : <span style={{ color: 'var(--text-light)' }}>Not Assigned</span>}
                    </td>
                    <td style={styles.td}>{p.admissionDate}</td>
                    <td style={styles.td} style={{ ...styles.td, textAlign: 'center' }}>
                      <button 
                        className="btn btn-ghost" 
                        onClick={() => deletePatient(p.id)}
                        style={styles.deleteBtn}
                        title="Delete Patient Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Patient"
        onSave={handleSave}
        saveText="Register"
        isSaveDisabled={!name || !address || !diagnosis}
      >
        <form style={styles.modalForm} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label className="form-label" htmlFor="patName">Full Name</label>
            <div style={styles.inputWrapper}>
              <UserPlus size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="patName"
                className="form-control"
                placeholder="Bruce Wayne"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="patAddr">Address</label>
            <div style={styles.inputWrapper}>
              <MapPin size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="patAddr"
                className="form-control"
                placeholder="Wayne Manor, Gotham"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="patDiagnosis">Primary Diagnosis / Symptoms</label>
            <div style={styles.inputWrapper}>
              <Clipboard size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="patDiagnosis"
                className="form-control"
                placeholder="Muscle strain, Back fatigue"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="patDoctor">Assign Doctor</label>
            <div style={styles.inputWrapper}>
              <Stethoscope size={16} style={styles.inputIcon} />
              <select
                id="patDoctor"
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
  searchCard: {
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  searchIcon: {
    color: 'var(--text-light)',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '0.975rem',
    color: 'var(--text-main)',
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
  deleteBtn: {
    color: 'var(--danger)',
    padding: 6,
    borderRadius: 'var(--radius-sm)',
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

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { User, Plus, Trash2, Mail, Award, DollarSign, Stethoscope } from 'lucide-react';

export default function DoctorsView() {
  const { doctors, addDoctor, deleteDoctor, session } = useContext(AppContext);
  const isAdmin = session?.user?.role === 'admin';

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [salary, setSalary] = useState('');
  const [email, setEmail] = useState('');

  const handleOpenModal = () => {
    setName('');
    setSpecialization('');
    setQualification('');
    setSalary('');
    setEmail('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !specialization || !qualification || !email) return;
    addDoctor({
      name,
      specialization,
      qualification,
      salary: salary ? Number(salary) : 0,
      email
    });
    setIsModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Medical Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Meet our clinical specialists and medical team.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={18} /> Add Specialist
          </button>
        )}
      </div>

      {/* Doctors Cards Grid */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {doctors.map((doc) => (
          <div className="card scale-in" key={doc.id} style={styles.doctorCard}>
            <div style={styles.cardHeader}>
              <div style={styles.iconContainer}>
                <Stethoscope size={24} color="var(--primary)" />
              </div>
              <div style={styles.headerText}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{doc.name}</h3>
                <span className="badge badge-primary" style={{ marginTop: 4 }}>{doc.specialization}</span>
              </div>
            </div>

            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <Award size={16} style={{ color: 'var(--text-light)' }} />
                <span><strong>Quals:</strong> {doc.qualification}</span>
              </div>
              <div style={styles.infoRow}>
                <Mail size={16} style={{ color: 'var(--text-light)' }} />
                <span>{doc.email}</span>
              </div>
              
              {isAdmin && (
                <div style={{ ...styles.infoRow, background: 'var(--bg-app)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginTop: 12 }}>
                  <DollarSign size={16} color="var(--secondary)" />
                  <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                    Salary: ${Number(doc.salary).toLocaleString()}/yr
                  </span>
                </div>
              )}
            </div>

            {isAdmin && (
              <div style={styles.cardActions}>
                <button 
                  className="btn btn-outline" 
                  onClick={() => deleteDoctor(doc.id)}
                  style={styles.deleteBtn}
                  title="Remove Specialist"
                >
                  <Trash2 size={16} /> Delete Doctor
                </button>
              </div>
            )}
          </div>
        ))}

        {doctors.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }} className="card">
            <span style={{ color: 'var(--text-muted)' }}>No doctors registered in the system database.</span>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Hospital Specialist"
        onSave={handleSave}
        saveText="Save Specialist"
        isSaveDisabled={!name || !specialization || !qualification || !email}
      >
        <form style={styles.modalForm} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label className="form-label" htmlFor="docName">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="docName"
                className="form-control"
                placeholder="Dr. Emily Stone"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="docSpec">Clinical Specialization</label>
            <div style={styles.inputWrapper}>
              <Stethoscope size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="docSpec"
                className="form-control"
                placeholder="Neurology"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="docQual">Qualifications</label>
            <div style={styles.inputWrapper}>
              <Award size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="docQual"
                className="form-control"
                placeholder="MBBS, PhD (Harvard)"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="docEmail">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type="email"
                id="docEmail"
                className="form-control"
                placeholder="emily@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          {isAdmin && (
            <div className="form-group">
              <label className="form-label" htmlFor="docSalary">Annual Salary ($)</label>
              <div style={styles.inputWrapper}>
                <DollarSign size={16} style={styles.inputIcon} />
                <input
                  type="number"
                  id="docSalary"
                  className="form-control"
                  placeholder="180000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  style={styles.inputWithIcon}
                />
              </div>
            </div>
          )}
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
  doctorCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
  },
  cardHeader: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    background: 'var(--primary-light)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  cardActions: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: 16,
    marginTop: 'auto',
  },
  deleteBtn: {
    width: '100%',
    color: 'var(--danger)',
    borderColor: 'var(--danger)',
    padding: '8px 16px',
    fontSize: '0.85rem',
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

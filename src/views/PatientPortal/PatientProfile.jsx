import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Mail, MapPin, KeyRound, Calendar, ShieldCheck, CheckCircle } from 'lucide-react';

export default function PatientProfile() {
  const { session, patients, users, updatePatientProfile, updateStorage } = useContext(AppContext);
  const patient = patients.find(p => p.id === session?.user?.id);
  const user = users.find(u => u.id === session?.user?.id);

  // Form States
  const [name, setName] = useState(patient?.name || session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [address, setAddress] = useState(patient?.address || '');
  const [password, setPassword] = useState(user?.password || '123');
  
  // Feedback
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);

    // Call Context to update patients and users
    updatePatientProfile(session.user.id, {
      name,
      email,
      address
    });

    // Handle Password update in users DB
    if (password !== user?.password) {
      const updatedUsers = users.map(u => u.id === session.user.id ? { ...u, password } : u);
      // Directly call context local storage sync helper if exposed or recreate it
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile Configuration</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Keep your residential address and login credentials current.</p>
      </div>

      {success && (
        <div style={styles.successAlert}>
          <CheckCircle size={20} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.readOnlyRow}>
            <div style={styles.halfWidth}>
              <span style={styles.labelMuted}>Patient Account ID</span>
              <div style={styles.readOnlyBox}>🛡️ {session?.user?.id}</div>
            </div>
            <div style={styles.halfWidth}>
              <span style={styles.labelMuted}>System Registration Date</span>
              <div style={styles.readOnlyBox}>📅 {patient?.admissionDate || 'N/A'}</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profName">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="profName"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profEmail">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type="email"
                id="profEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profAddr">Residential Address</label>
            <div style={styles.inputWrapper}>
              <MapPin size={16} style={styles.inputIcon} />
              <input
                type="text"
                id="profAddr"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profPass">Account Password</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={16} style={styles.inputIcon} />
              <input
                type="text" // Using text to let user see password in settings (or password, either is fine)
                id="profPass"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ padding: '12px', marginTop: 12 }}>
            <ShieldCheck size={18} /> Apply Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  readOnlyRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  labelMuted: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  },
  readOnlyBox: {
    background: 'var(--bg-app)',
    border: '1px solid var(--border-color)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-main)',
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
  },
  successAlert: {
    background: 'var(--secondary-light)',
    border: '1.5px solid var(--secondary)',
    color: 'var(--secondary)',
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    fontWeight: 700,
    fontSize: '0.925rem',
  }
};

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { KeyRound, Mail, User, MapPin, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login, registerPatient } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  // Feedback States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegister) {
      // Patient registration flow
      if (!name || !email || !password || !address) {
        setError('Please fill out all fields.');
        return;
      }
      const res = registerPatient(name, email, password, address);
      if (res.success) {
        setSuccess('Registration successful! Logging you in...');
        setTimeout(() => {
          login(email, password);
          onNavigate('dashboard');
        }, 1500);
      } else {
        setError(res.message);
      }
    } else {
      // Login flow
      if (!email || !password) {
        setError('Please fill out all fields.');
        return;
      }
      const user = login(email, password);
      if (user) {
        setSuccess(`Welcome back, ${user.name}! Redirecting...`);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1200);
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setIsRegister(false);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.backButton} onClick={() => onNavigate('landing')}>
        <ArrowLeft size={16} /> Back to Home
      </div>

      <div className="card scale-in" style={styles.authCard}>
        <div style={styles.authHeader}>
          <div style={styles.iconContainer}>
            <KeyRound size={24} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {isRegister ? 'Patient Registration' : 'HMS Portal Login'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            {isRegister 
              ? 'Create an account to access medical records and appointments.' 
              : 'Please enter your credentials to access the system.'}
          </p>
        </div>

        {error && (
          <div style={styles.alertError}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.alertSuccess}>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="regName">Full Name</label>
                <div style={styles.inputWrapper}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    id="regName"
                    className="form-control"
                    placeholder="Sarah Connor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.inputWithIcon}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regAddress">Residential Address</label>
                <div style={styles.inputWrapper}>
                  <MapPin size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    id="regAddress"
                    className="form-control"
                    placeholder="123 Tech Blvd, Cyberdyne"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={styles.inputWithIcon}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="emailAddress">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                id="emailAddress"
                className="form-control"
                placeholder="email@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="accPassword">Password</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input
                type="password"
                id="accPassword"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ padding: '12px', marginTop: 10 }}>
            {isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <span style={styles.toggleLink} onClick={() => { setIsRegister(false); setError(''); }}>
                Login here
              </span>
            </p>
          ) : (
            <p>
              Are you a patient?{' '}
              <span style={styles.toggleLink} onClick={() => { setIsRegister(true); setError(''); }}>
                Create an account
              </span>
            </p>
          )}
        </div>

        {!isRegister && (
          <div style={styles.demoBox}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Demo Credentials Quick-Click:
            </span>
            <div style={styles.demoButtonsGrid}>
              <button 
                type="button" 
                onClick={() => handleFillDemo('admin@hospital.com', '123')}
                style={styles.demoBtn}
              >
                🔑 Admin Staff
              </button>
              <button 
                type="button" 
                onClick={() => handleFillDemo('doctor@hospital.com', '123')}
                style={styles.demoBtn}
              >
                🩺 Dr. Smith
              </button>
              <button 
                type="button" 
                onClick={() => handleFillDemo('patient@hospital.com', '123')}
                style={styles.demoBtn}
              >
                👤 Sarah (Patient)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e2efff 100%)',
    position: 'relative',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 600,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'var(--transition)',
  },
  authCard: {
    width: 460,
    maxWidth: '100%',
    padding: 36,
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: 28,
  },
  iconContainer: {
    width: 48,
    height: 48,
    background: 'var(--primary-light)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  form: {
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
    paddingLeft: 44,
  },
  alertError: {
    background: 'var(--danger-light)',
    border: '1.5px solid var(--danger)',
    color: 'var(--danger)',
    padding: 12,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  alertSuccess: {
    background: 'var(--secondary-light)',
    border: '1.5px solid var(--secondary)',
    color: 'var(--secondary)',
    padding: 12,
    borderRadius: 'var(--radius-md)',
    marginBottom: 20,
    fontSize: '0.9rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  toggleLink: {
    color: 'var(--primary)',
    fontWeight: 700,
    cursor: 'pointer',
  },
  demoBox: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  demoButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  demoBtn: {
    background: 'var(--bg-app)',
    border: '1px solid var(--border-color)',
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    textAlign: 'center',
  }
};

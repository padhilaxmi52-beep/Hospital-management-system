import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Activity, 
  UserCheck, 
  Users, 
  FileText, 
  Calendar, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Heart 
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const { session } = useContext(AppContext);

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div className="container" style={styles.navContainer}>
          <div style={styles.logo} onClick={() => onNavigate('landing')}>
            <div style={styles.logoIcon}><Heart fill="#e11d48" color="#e11d48" size={20} /></div>
            <span style={styles.logoText}>City General <span style={{ color: 'var(--primary)' }}>Hospital</span></span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#about" style={styles.navLink}>About</a>
            <a href="#contact" style={styles.navLink}>Contact</a>
            {session ? (
              <button onClick={() => onNavigate('dashboard')} className="btn btn-primary">
                Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={() => onNavigate('login')} className="btn btn-primary">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={styles.hero}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div className="fade-in" style={styles.heroTextContainer}>
            <div style={styles.badgeContainer}>
              <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                ⭐ Trustworthy Healthcare Management
              </span>
            </div>
            <h1 style={styles.heroTitle}>
              Advanced Digital Care & Efficient Hospital Management
            </h1>
            <p style={styles.heroSubtitle}>
              Streamlining hospital operations with modern patient management, scheduling, secure electronic medical records, and a dedicated portal for patients.
            </p>
            <div style={styles.heroButtons}>
              {session ? (
                <button onClick={() => onNavigate('dashboard')} className="btn btn-primary" style={{ padding: '14px 28px' }}>
                  Go to Dashboard <ArrowRight size={18} />
                </button>
              ) : (
                <>
                  <button onClick={() => onNavigate('login')} className="btn btn-primary" style={{ padding: '14px 28px' }}>
                    Access Portal <ArrowRight size={18} />
                  </button>
                  <a href="#features" className="btn btn-outline" style={{ padding: '14px 28px' }}>
                    Explore Features
                  </a>
                </>
              )}
            </div>
          </div>
          
          <div className="scale-in" style={styles.heroVisual}>
            <div style={styles.glowBox}>
              <div style={styles.hospitalCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>🏥 City General</span>
                  <span className="badge badge-secondary">Active Server</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={styles.statMini}>
                    <Activity size={18} color="var(--primary)" />
                    <span>Real-time Patient Monitoring</span>
                  </div>
                  <div style={styles.statMini}>
                    <Calendar size={18} color="var(--secondary)" />
                    <span>Digital Doctor Schedules</span>
                  </div>
                  <div style={styles.statMini}>
                    <FileText size={18} color="var(--accent)" />
                    <span>Encrypted Medical History</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={styles.section}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={styles.sectionTitle}>Core System Features</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '12px auto 0' }}>
              Built to meet standard healthcare management requirements, offering specific portal services for administrators, staff, doctors, and patients.
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Users size={28} />
              </div>
              <h3 style={styles.featureTitle}>Patient Management</h3>
              <p style={styles.featureDesc}>Full registration, address storage, medical diagnosis history, and immediate status checks.</p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                <UserCheck size={28} />
              </div>
              <h3 style={styles.featureTitle}>Doctor Portal</h3>
              <p style={styles.featureDesc}>Track physician directories, clinical specialties, work salaries, and specific patient assignments.</p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: 'var(--accent-light)', color: 'var(--accent)' }}>
                <FileText size={28} />
              </div>
              <h3 style={styles.featureTitle}>Secure Records</h3>
              <p style={styles.featureDesc}>Maintain diagnoses, visit notes, and treatment details in an easily accessible record database.</p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <Calendar size={28} />
              </div>
              <h3 style={styles.featureTitle}>Scheduling Hub</h3>
              <p style={styles.featureDesc}>Centralized appointment bookings allowing patients to request slots and doctors to coordinate care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ ...styles.section, background: '#fff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 800 }}>
          <h2 style={styles.sectionTitle}>Digitizing Patient Care</h2>
          <p style={{ ...styles.aboutText, marginTop: 24 }}>
            City General Hospital Management System is designed to solve operational bottlenecks in modern hospitals. By connecting administrators, medical specialists, staff, and patients under a single unified dashboard, we enable secure and immediate access to health scheduling and diagnostics.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 40 }}>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>24/7</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Emergency Service</span>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>99.9%</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Uptime & Security</span>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>10k+</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Patients Managed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.section}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={styles.sectionTitle}>Get in Touch</h2>
            <p style={{ color: 'var(--text-muted)' }}>We are always here to support your clinical operations.</p>
          </div>

          <div style={styles.contactContainer}>
            <div style={styles.contactItem}>
              <Mail size={24} color="var(--primary)" />
              <h4 style={{ margin: '8px 0 4px' }}>Email Us</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@citygeneralhospital.com</p>
            </div>
            <div style={styles.contactItem}>
              <Phone size={24} color="var(--secondary)" />
              <h4 style={{ margin: '8px 0 4px' }}>Call Support</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+91 9876543210</p>
            </div>
            <div style={styles.contactItem}>
              <MapPin size={24} color="var(--accent)" />
              <h4 style={{ margin: '8px 0 4px' }}>Our Location</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bhubaneswar, Odisha, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container text-center">
          <p style={{ fontWeight: 600 }}>&copy; 2026 City General Hospital. All rights reserved.</p>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: 8 }}>
            Built for clinical efficiency & educational demonstration.
          </p>
        </div>
      </footer>

    </div>
  );
}

const styles = {
  navbar: {
    height: 72,
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  logoIcon: {
    background: 'var(--primary-light)',
    padding: 8,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  navLink: {
    fontWeight: 600,
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  hero: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e2efff 100%)',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  heroTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  badgeContainer: {
    display: 'flex',
  },
  heroTitle: {
    fontSize: '3.25rem',
    lineHeight: '1.15',
    color: 'var(--text-main)',
    fontWeight: 800,
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: 16,
    marginTop: 12,
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowBox: {
    position: 'relative',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: 3,
    boxShadow: '0 20px 40px rgba(0, 123, 255, 0.25)',
  },
  hospitalCard: {
    background: '#fff',
    borderRadius: 'calc(var(--radius-lg) - 3px)',
    padding: 32,
    width: 380,
    maxWidth: '100%',
  },
  statMini: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-app)',
    fontWeight: 600,
    fontSize: '0.9rem',
    border: '1px solid var(--border-color)',
    transition: 'var(--transition)',
  },
  section: {
    padding: '80px 0',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    fontWeight: 800,
    textAlign: 'center',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '32px 24px',
    height: '100%',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    marginBottom: 10,
  },
  featureDesc: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  aboutText: {
    fontSize: '1.125rem',
    color: 'var(--text-muted)',
    lineHeight: '1.7',
  },
  contactContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    marginTop: 20,
  },
  contactItem: {
    background: '#fff',
    padding: 24,
    borderRadius: 'var(--radius-lg)',
    textAlign: 'center',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
  },
  footer: {
    background: 'var(--bg-sidebar)',
    color: 'var(--text-on-dark)',
    padding: '40px 0',
    marginTop: 'auto',
  }
};

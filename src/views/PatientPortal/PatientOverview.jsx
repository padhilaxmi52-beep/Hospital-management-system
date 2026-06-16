import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar, User, Clipboard, Heart, AlertCircle, Phone } from 'lucide-react';

export default function PatientOverview() {
  const { session, patients, doctors, appointments } = useContext(AppContext);
  const patient = patients.find(p => p.id === session?.user?.id);
  const doctor = doctors.find(d => d.id === patient?.doctorId);

  // Find next upcoming appointment
  const nextApp = appointments
    .filter(a => a.patientId === session?.user?.id && a.status !== 'Cancelled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="fade-in">
      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerText}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            {getGreeting()}, {session?.user?.name}!
          </h2>
          <p style={{ margin: '6px 0 0', opacity: 0.9 }}>
            Welcome to your patient portal. View your clinical status, care details, and book new appointments.
          </p>
        </div>
        <div style={styles.bannerVisual}>❤️</div>
      </div>

      {/* Main Patient Stats Grid */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        
        {/* Diagnosis Status */}
        <div className="card" style={styles.summaryCard}>
          <div style={{ ...styles.iconBg, background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Clipboard size={22} />
          </div>
          <div style={styles.cardContent}>
            <span style={styles.cardLabel}>Current Diagnosis</span>
            <h3 style={styles.cardValue}>{patient?.diagnosis || 'Healthy'}</h3>
            <span style={styles.cardSub}>Admitted: {patient?.admissionDate || 'N/A'}</span>
          </div>
        </div>

        {/* Assigned Doctor */}
        <div className="card" style={styles.summaryCard}>
          <div style={{ ...styles.iconBg, background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <User size={22} />
          </div>
          <div style={styles.cardContent}>
            <span style={styles.cardLabel}>Attending Doctor</span>
            <h3 style={styles.cardValue}>{doctor ? doctor.name : 'Not Assigned'}</h3>
            <span style={styles.cardSub}>
              {doctor ? `${doctor.specialization} (${doctor.qualification})` : 'Awaiting assignment'}
            </span>
          </div>
        </div>

        {/* Next Appointment */}
        <div className="card" style={styles.summaryCard}>
          <div style={{ ...styles.iconBg, background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Calendar size={22} />
          </div>
          <div style={styles.cardContent}>
            <span style={styles.cardLabel}>Next Appointment</span>
            <h3 style={styles.cardValue}>
              {nextApp ? nextApp.date : 'None Scheduled'}
            </h3>
            <span style={styles.cardSub}>
              {nextApp ? `${nextApp.time} (${nextApp.status})` : 'Book a consultation below'}
            </span>
          </div>
        </div>

      </div>

      <div className="grid-2">
        {/* Clinic Support Info */}
        <div className="card" style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Emergency & Contact Details</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
            If you require immediate medical assistance, please contact the dispatch desk or go directly to the ER.
          </p>
          <div style={styles.supportBox}>
            <Phone size={18} color="var(--danger)" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24/7 ER Hotline</h4>
              <p style={{ color: 'var(--danger)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>+91 9876543210</p>
            </div>
          </div>
          <div style={{ ...styles.supportBox, marginTop: 12 }}>
            <AlertCircle size={18} color="var(--primary)" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>General Inquiries</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                support@citygeneralhospital.com
              </p>
            </div>
          </div>
        </div>

        {/* Wellness Tip */}
        <div className="card" style={{ ...styles.infoCard, background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderColor: '#bfdbfe' }}>
          <h3 style={{ ...styles.cardTitle, color: 'var(--primary)' }}>Patient Wellness Guideline</h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginTop: 10 }}>
            "Healing is a matter of time, but it is sometimes also a matter of opportunity."
          </p>
          <ul style={styles.wellnessList}>
            <li>✔️ Ensure you complete any prescribed antibiotic schedules.</li>
            <li>✔️ Schedule routine blood panels and general health checkups annually.</li>
            <li>✔️ Keep your address and contact details updated to facilitate prescription delivery.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    color: '#ffffff',
    padding: '32px 40px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    boxShadow: 'var(--shadow-md)',
  },
  bannerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  bannerVisual: {
    fontSize: '3rem',
    opacity: 0.9,
  },
  summaryCard: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    padding: 24,
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1.25,
  },
  cardSub: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: 2,
    fontWeight: 500,
  },
  infoCard: {
    padding: 28,
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    marginBottom: 10,
  },
  supportBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-color)',
  },
  wellnessList: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  }
};

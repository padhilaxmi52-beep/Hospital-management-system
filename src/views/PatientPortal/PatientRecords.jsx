import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Stethoscope, Calendar, Clipboard, Shield } from 'lucide-react';

export default function PatientRecords() {
  const { records, doctors, session } = useContext(AppContext);

  // Filter records that belong to this patient
  const myRecords = records.filter(r => r.patientId === session?.user?.id);

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Medical History</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure access to your diagnosis history and physician prescriptions.</p>
        </div>
      </div>

      {/* Records Grid */}
      <div style={styles.gridContainer}>
        {myRecords.slice().reverse().map((rec) => {
          const doctor = doctors.find(d => d.id === rec.doctorId);
          return (
            <div className="card scale-in" key={rec.id} style={styles.recordCard}>
              
              {/* Record Top Bar */}
              <div style={styles.cardHeader}>
                <div style={styles.problemContainer}>
                  <Clipboard size={18} color="var(--primary)" />
                  <span style={styles.problemTitle}>{rec.problem}</span>
                </div>
                <div style={styles.dateContainer}>
                  <Calendar size={14} style={{ color: 'var(--text-light)' }} />
                  <span style={styles.dateText}>{rec.date}</span>
                </div>
              </div>

              {/* Record Doctor Details */}
              <div style={styles.doctorBar}>
                <div style={styles.doctorAvatar}>
                  <Stethoscope size={16} />
                </div>
                <div>
                  <h4 style={styles.doctorName}>{doctor ? doctor.name : 'Attending Doctor'}</h4>
                  <small style={styles.doctorSpec}>{doctor ? doctor.specialization : 'General Medicine'}</small>
                </div>
                <span className="badge badge-primary" style={styles.recordIdBadge}>
                  {rec.id}
                </span>
              </div>

              {/* Record Care Plan */}
              <div style={styles.prescriptionBox}>
                <h5 style={styles.boxTitle}>Physician Care Notes & Prescription:</h5>
                <p style={styles.boxText}>{rec.description}</p>
              </div>

            </div>
          );
        })}

        {myRecords.length === 0 && (
          <div className="card text-center" style={{ padding: 48 }}>
            <Shield size={40} color="var(--text-light)" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>No Clinical Records Logged</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400, margin: '6px auto 0' }}>
              Your physician has not logged any medical consultation notes or prescriptions in your electronic health history yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: 24,
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 24,
  },
  recordCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    gap: 16,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: 12,
  },
  problemContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  problemTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  doctorBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  doctorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-full)',
    background: 'var(--secondary-light)',
    color: 'var(--secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    margin: 0,
  },
  doctorSpec: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  recordIdBadge: {
    position: 'absolute',
    right: 0,
    fontSize: '0.65rem',
  },
  prescriptionBox: {
    background: 'var(--bg-app)',
    borderRadius: 'var(--radius-md)',
    padding: 16,
    border: '1px solid var(--border-color)',
  },
  boxTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: 6,
  },
  boxText: {
    fontSize: '0.925rem',
    lineHeight: '1.6',
    color: 'var(--text-main)',
    margin: 0,
    whiteSpace: 'pre-line',
  }
};

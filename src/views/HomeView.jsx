import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, Stethoscope, Briefcase, FileText, Calendar } from 'lucide-react';

export default function HomeView() {
  const { getStats, patients, session } = useContext(AppContext);
  const stats = getStats();

  // Animated counters on mount
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    employees: 0,
    records: 0
  });

  useEffect(() => {
    const duration = 800; // ms
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounts({
        patients: Math.min(Math.ceil((stats.patients / steps) * step), stats.patients),
        doctors: Math.min(Math.ceil((stats.doctors / steps) * step), stats.doctors),
        employees: Math.min(Math.ceil((stats.employees / steps) * step), stats.employees),
        records: Math.min(Math.ceil((stats.records / steps) * step), stats.records),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats.patients, stats.doctors, stats.employees, stats.records]);

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 20 }}>Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="card" style={styles.statCard}>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Total Patients</span>
            <h2 style={styles.statNumber}>{counts.patients}</h2>
          </div>
          <div style={{ ...styles.statIcon, background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Doctors Active</span>
            <h2 style={styles.statNumber}>{counts.doctors}</h2>
          </div>
          <div style={{ ...styles.statIcon, background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <Stethoscope size={24} />
          </div>
        </div>

        {session?.user?.role === 'admin' && (
          <div className="card" style={styles.statCard}>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Hospital Staff</span>
              <h2 style={styles.statNumber}>{counts.employees}</h2>
            </div>
            <div style={{ ...styles.statIcon, background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <Briefcase size={24} />
            </div>
          </div>
        )}

        <div className="card" style={styles.statCard}>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Medical Records</span>
            <h2 style={styles.statNumber}>{counts.records}</h2>
          </div>
          <div style={{ ...styles.statIcon, background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity / Patients */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={styles.tableHeader}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Recently Admitted Patients</h3>
          <span className="badge badge-primary">Showing top 5</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Patient Name</th>
                <th style={styles.th}>Diagnosis</th>
                <th style={styles.th}>Attending Doctor ID</th>
                <th style={styles.th}>Admission Date</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(-5).reverse().map((patient) => (
                <tr key={patient.id} style={styles.tr}>
                  <td style={styles.td}><strong>{patient.id}</strong></td>
                  <td style={styles.td}>{patient.name}</td>
                  <td style={styles.td}>
                    <span className="badge badge-info">{patient.diagnosis}</span>
                  </td>
                  <td style={styles.td}>{patient.doctorId || 'Unassigned'}</td>
                  <td style={styles.td}>{patient.admissionDate}</td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No patients registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  statCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: '2.25rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  }
};

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldAlert, Users, Mail, Award, CheckCircle } from 'lucide-react';

export default function EmployeesView() {
  const { employees, session } = useContext(AppContext);

  // Security guard for non-admins (just in case)
  if (session?.user?.role !== 'admin') {
    return (
      <div style={styles.forbidden}>
        <ShieldAlert size={48} color="var(--danger)" />
        <h3 style={{ marginTop: 16 }}>Access Denied</h3>
        <p style={{ color: 'var(--text-muted)' }}>You do not have administrative permissions to view this resource.</p>
      </div>
    );
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Nurse': return 'badge-secondary';
      case 'Receptionist': return 'badge-info';
      case 'Security': return 'badge-warning';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Employee Registry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Administrative list of hospital operations staff.</p>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {employees.map((emp) => (
          <div className="card scale-in" key={emp.id} style={styles.empCard}>
            <div style={styles.headerRow}>
              <div style={styles.avatar}>
                {emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{emp.name}</h3>
                <small style={{ color: 'var(--text-light)', fontWeight: 600 }}>ID: {emp.id}</small>
              </div>
            </div>

            <div style={styles.body}>
              <div style={styles.infoRow}>
                <Award size={16} style={{ color: 'var(--text-light)' }} />
                <span className={`badge ${getRoleBadgeClass(emp.role)}`}>{emp.role}</span>
              </div>
              <div style={styles.infoRow}>
                <Mail size={16} style={{ color: 'var(--text-light)' }} />
                <span style={{ fontSize: '0.875rem' }}>{emp.email}</span>
              </div>
            </div>

            <div style={styles.footer}>
              <span style={styles.statusSpan}>
                <CheckCircle size={14} color="var(--secondary)" /> Active Workforce
              </span>
            </div>
          </div>
        ))}

        {employees.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }} className="card">
            <span style={{ color: 'var(--text-muted)' }}>No staff registered in the registry.</span>
          </div>
        )}
      </div>
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
  empCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-full)',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  footer: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: 12,
    marginTop: 'auto',
  },
  statusSpan: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--secondary)',
  },
  forbidden: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    textAlign: 'center',
  }
};

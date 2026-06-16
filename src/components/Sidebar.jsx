import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  ClipboardList, 
  Calendar, 
  Users2, 
  LogOut, 
  Heart,
  UserRound
} from 'lucide-react';

export default function Sidebar({ role, activeView, onViewChange, onLogout, isCollapsed }) {
  // Navigation lists for different roles
  const getNavItems = () => {
    if (role === 'patient') {
      return [
        { id: 'patient-home', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'patient-appointments', label: 'My Bookings', icon: <Calendar size={20} /> },
        { id: 'patient-records', label: 'Health Records', icon: <ClipboardList size={20} /> },
        { id: 'patient-profile', label: 'Edit Profile', icon: <UserRound size={20} /> }
      ];
    }

    const items = [
      { id: 'home', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { id: 'patients', label: 'Patients', icon: <Users size={20} /> },
      { id: 'doctors', label: 'Doctors', icon: <Stethoscope size={20} /> },
      { id: 'records', label: 'Medical Records', icon: <ClipboardList size={20} /> },
      { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> }
    ];

    if (role === 'admin') {
      items.push({ id: 'employees', label: 'Employees', icon: <Users2 size={20} /> });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <aside style={{ ...styles.sidebar, width: isCollapsed ? 76 : 260 }}>
      {/* Sidebar Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <Heart fill="#f43f5e" color="#f43f5e" size={24} style={styles.logoIcon} />
          {!isCollapsed && <span style={styles.logoText}>HMS Portal</span>}
        </div>
        {!isCollapsed && (
          <span style={styles.roleBadge} className={`badge badge-${role === 'admin' ? 'danger' : role === 'doctor' ? 'primary' : role === 'patient' ? 'secondary' : 'info'}`}>
            {role}
          </span>
        )}
      </div>

      {/* Sidebar Menu */}
      <ul style={styles.menu}>
        {navItems.map((item) => (
          <li key={item.id} style={{ marginBottom: 4 }}>
            <button
              onClick={() => onViewChange(item.id)}
              style={{
                ...styles.menuButton,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                background: activeView === item.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeView === item.id ? '#ffffff' : '#94a3b8',
                borderLeft: activeView === item.id ? '4px solid var(--primary)' : '4px solid transparent',
              }}
            >
              <span style={{ 
                ...styles.iconWrapper, 
                color: activeView === item.id ? 'var(--primary)' : 'inherit',
                marginRight: isCollapsed ? 0 : 16 
              }}>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>

      {/* Sidebar Footer (Logout) */}
      <div style={styles.footer}>
        <button
          onClick={onLogout}
          style={{
            ...styles.logoutBtn,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
        >
          <span style={{ marginRight: isCollapsed ? 0 : 16 }}><LogOut size={20} /></span>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    height: '100vh',
    background: 'var(--bg-sidebar)',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
  },
  header: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    flexShrink: 0,
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.025em',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    padding: '2px 8px',
    fontSize: '0.65rem',
  },
  menu: {
    flexGrow: 1,
    padding: '24px 0',
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'var(--transition)',
    outline: 'none',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: '20px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    transition: 'var(--transition)',
    outline: 'none',
  }
};

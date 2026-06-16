import React from 'react';
import { Menu, User, Calendar, Shield } from 'lucide-react';

export default function TopHeader({ user, onToggleSidebar }) {
  // Simple avatar initials or icon depending on role
  const getAvatarContent = () => {
    if (user?.name) {
      const parts = user.name.split(' ');
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    return <User size={18} />;
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <button 
          onClick={onToggleSidebar} 
          style={styles.toggleBtn}
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <span style={styles.systemTime}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div style={styles.right}>
        <div style={styles.userInfo}>
          <div style={styles.textContainer}>
            <span style={styles.userName}>{user?.name || 'Loading Profile...'}</span>
            <span style={styles.userRole}>{user?.role?.toUpperCase()}</span>
          </div>
          <div style={styles.avatar}>
            {getAvatarContent()}
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 72,
    background: '#ffffff',
    borderBottom: '1px solid var(--border-color)',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)',
    flexShrink: 0,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  systemTime: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'var(--text-main)',
  },
  userRole: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: 'var(--text-light)',
    letterSpacing: '0.05em',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-full)',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.9rem',
    border: '2px solid #ffffff',
    boxShadow: 'var(--shadow-sm)',
  }
};

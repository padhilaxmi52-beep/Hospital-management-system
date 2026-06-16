import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  onSave, 
  saveText = 'Save', 
  cancelText = 'Cancel',
  isSaveDisabled = false,
  children 
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={styles.overlay} onClick={onClose}>
      <div 
        className="modal-content scale-in" 
        style={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {children}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-ghost"
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            {cancelText}
          </button>
          {onSave && (
            <button 
              type="button" 
              onClick={onSave} 
              disabled={isSaveDisabled}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.9rem', opacity: isSaveDisabled ? 0.6 : 1 }}
            >
              {saveText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#ffffff',
    width: '500px',
    maxWidth: '90%',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    border: '1px solid var(--border-color)',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
  },
  body: {
    padding: '24px',
    overflowY: 'auto',
    flexGrow: 1,
    background: '#ffffff',
  },
  footer: {
    padding: '16px 24px',
    background: 'var(--bg-app)',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  }
};

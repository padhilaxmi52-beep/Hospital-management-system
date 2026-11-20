import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function UpdatePatientDoctor({ patient, onClose, onUpdate }) {
    const { doctors, updatePatientProfile } = useContext(AppContext); // ✅ Get updatePatientProfile
    const [selectedDoctor, setSelectedDoctor] = useState(patient.doctor_id || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ✅ Call updatePatientProfile with patient ID and new doctor ID
            const result = await updatePatientProfile(patient.id, {
                doctorId: selectedDoctor
            });
            
            if (result) {
                alert('✅ Doctor assigned successfully!');
                if (onUpdate) onUpdate();
                if (onClose) onClose();
            } else {
                alert('❌ Failed to assign doctor. Please try again.');
            }
        } catch (error) {
            console.error('Assign doctor error:', error);
            alert('❌ Error assigning doctor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <h3>Assign Doctor to {patient.name}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label>Select Doctor</label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            style={styles.select}
                            disabled={loading}
                        >
                            <option value="">Unassigned</option>
                            {doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} - {doc.specialization}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={styles.buttonGroup}>
                        <button type="submit" style={styles.saveBtn} disabled={loading}>
                            {loading ? 'Assigning...' : 'Assign Doctor'}
                        </button>
                        <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '400px',
        maxWidth: '90%',
    },
    formGroup: {
        marginBottom: '16px',
    },
    select: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        background: 'white',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '16px',
    },
    saveBtn: {
        padding: '10px 20px',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        flex: 1,
    },
    cancelBtn: {
        padding: '10px 20px',
        background: '#e2e8f0',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        flex: 1,
    },
};
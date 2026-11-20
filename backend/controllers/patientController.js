// const { Patient, User } = require('../models');
// const { generateId } = require('../utils/helpers');
// const bcrypt = require('bcrypt');

// // Get all patients
// exports.getAllPatients = async (req, res) => {
//     try {
//         const patients = await Patient.findAll();
//         res.json({
//             success: true,
//             patients
//         });
//     } catch (error) {
//         console.error('Get patients error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to get patients.'
//         });
//     }
// };

// // Get single patient
// exports.getPatient = async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.id);
//         if (!patient) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Patient not found.'
//             });
//         }
//         res.json({
//             success: true,
//             patient
//         });
//     } catch (error) {
//         console.error('Get patient error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to get patient.'
//         });
//     }
// };

// // Create new patient (Admin only)
// exports.createPatient = async (req, res) => {
//     console.log("DATA FROM FRONTEND:", req.body);

//     try {
//         const { name, email, phone, address, diagnosis, doctorId } = req.body;

//         if (!name || !address || !diagnosis) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Name, address, and diagnosis are required.'
//             });
//         }

//         // Generate IDs
//         const patientId = generateId('PAT');
//         const userId = generateId('U');

//         // Create default email if not provided
//         const patientEmail = email || `${name.toLowerCase().replace(/\s+/g, '')}@hospital.com`;
//         const patientPhone = phone || '9876543210';

//         // Check if email already exists
//         const existingUser = await User.findByEmail(patientEmail);
//         if (existingUser) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Email already registered.'
//             });
//         }

//         // Create user
//         await User.create({
//             id: userId,
//             email: patientEmail,
//             password:'123',
//             name,
//             role: 'patient'
//         });

//         // Create patient
//         await Patient.create({
//             id: patientId,
//             name,
//             email: patientEmail,
//             phone: patientPhone,
//             address,
//             diagnosis,
//             admissionDate: new Date().toISOString().split('T')[0],
//             doctorId: doctorId || null,
//             userId
//         });

//         const newPatient = await Patient.findById(patientId);

//         res.status(201).json({
//             success: true,
//             message: 'Patient registered successfully.',
//             patient: newPatient
//         });

//     } catch (error) {
//         console.error('Create patient error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create patient.'
//         });
//     }
// };

// // Update patient
// exports.updatePatient = async (req, res) => {
//     try {
//         const { name, address, diagnosis, doctorId } = req.body;
//         const patientId = req.params.id;

//         const patient = await Patient.findById(patientId);
//         if (!patient) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Patient not found.'
//             });
//         }

//         await Patient.update(patientId, {
//             name,
//             address,
//             diagnosis,
//             doctorId
//         });

//         // Update user name if provided
//         if (name && patient.user_id) {
//             await User.update(patient.user_id, { name });
//         }

//         const updatedPatient = await Patient.findById(patientId);

//         res.json({
//             success: true,
//             message: 'Patient updated successfully.',
//             patient: updatedPatient
//         });

//     } catch (error) {
//         console.error('Update patient error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update patient.'
//         });
//     }
// };

// // Delete patient
// exports.deletePatient = async (req, res) => {
//     try {
//         const patientId = req.params.id;
//         const patient = await Patient.findById(patientId);

//         if (!patient) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Patient not found.'
//             });
//         }

//         // Delete patient (cascades to appointments and medical records)
//         await Patient.delete(patientId);

//         // Delete associated user if exists
//         if (patient.user_id) {
//             await User.delete(patient.user_id);
//         }

//         res.json({
//             success: true,
//             message: 'Patient deleted successfully.'
//         });

//     } catch (error) {
//         console.error('Delete patient error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to delete patient.'
//         });
//     }
// };

// // Get patient's medical records
// exports.getPatientRecords = async (req, res) => {
//     try {
//         const MedicalRecord = require('../models/MedicalRecord');
//         const records = await MedicalRecord.findByPatient(req.params.id);
//         res.json({
//             success: true,
//             records
//         });
//     } catch (error) {
//         console.error('Get patient records error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to get patient records.'
//         });
//     }
// };

// // Get patient's appointments
// exports.getPatientAppointments = async (req, res) => {
//     try {
//         const Appointment = require('../models/Appointment');
//         const appointments = await Appointment.findByPatient(req.params.id);
//         res.json({
//             success: true,
//             appointments
//         });
//     } catch (error) {
//         console.error('Get patient appointments error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to get patient appointments.'
//         });
//     }
// };
const Patient = require('../models/Patient');
const User = require('../models/User');
const db = require('../config/database');
const { generateId } = require('../utils/helpers');
const bcrypt = require('bcrypt');

// ✅ GET all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll();
        res.json({
            success: true,
            patients
        });
    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get patients',
            error: error.message
        });
    }
};

// ✅ GET single patient
exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        res.json({
            success: true,
            patient
        });
    } catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get patient',
            error: error.message
        });
    }
};

// ✅ CREATE patient
exports.createPatient = async (req, res) => {
    try {
        console.log('📝 Creating patient with data:', req.body);
        
        const { name, email, phone, address, diagnosis, doctorId } = req.body;

        // Validate required fields
        if (!name || !address) {
            return res.status(400).json({
                success: false,
                message: 'Name and address are required'
            });
        }

        // Generate IDs
        const patientId = generateId('PAT');
        const userId = generateId('U');

        // Check if email already exists
        if (email) {
            const [existingUser] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            if (existingUser.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
        }

        // Create user
        const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '')}@hospital.com`;
        const userPhone = phone || '9876543210';
        
        await db.query(
            'INSERT INTO users (id, email, password, name, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, userEmail, '123', name, 'patient', userPhone]
        );

        // Create patient
        await db.query(
            `INSERT INTO patients 
            (id, user_id, name, email, phone, address, diagnosis) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [patientId, userId, name, userEmail, userPhone, address, diagnosis || 'Under Observation']
        );

        // Get the created patient
        const [newPatient] = await db.query(
            `SELECT p.*, u.name as user_name 
             FROM patients p 
             LEFT JOIN users u ON p.user_id = u.id 
             WHERE p.id = ?`,
            [patientId]
        );

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            patient: newPatient[0]
        });

    } catch (error) {
        console.error('❌ Create patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create patient',
            error: error.message
        });
    }
};

// ✅ UPDATE patient
exports.updatePatient = async (req, res) => {
    try {
        const { name, address, diagnosis, doctorId } = req.body;
        const patientId = req.params.id;

        const [existing] = await db.query(
            'SELECT * FROM patients WHERE id = ?',
            [patientId]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const updates = [];
        const values = [];
        
        if (name) { updates.push('name = ?'); values.push(name); }
        if (address) { updates.push('address = ?'); values.push(address); }
        if (diagnosis) { updates.push('diagnosis = ?'); values.push(diagnosis); }
        if (doctorId) { updates.push('doctor_id = ?'); values.push(doctorId); }
        
        if (updates.length > 0) {
            values.push(patientId);
            await db.query(
                `UPDATE patients SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
        }

        const [updated] = await db.query(
            `SELECT p.*, u.name as user_name 
             FROM patients p 
             LEFT JOIN users u ON p.user_id = u.id 
             WHERE p.id = ?`,
            [patientId]
        );

        res.json({
            success: true,
            message: 'Patient updated successfully',
            patient: updated[0]
        });

    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update patient',
            error: error.message
        });
    }
};

// ✅ DELETE patient
exports.deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id;

        const [existing] = await db.query(
            'SELECT user_id FROM patients WHERE id = ?',
            [patientId]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        await db.query('DELETE FROM patients WHERE id = ?', [patientId]);
        
        if (existing[0].user_id) {
            await db.query('DELETE FROM users WHERE id = ?', [existing[0].user_id]);
        }

        res.json({
            success: true,
            message: 'Patient deleted successfully'
        });

    } catch (error) {
        console.error('Delete patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete patient',
            error: error.message
        });
    }
};

// ✅ GET patient records
exports.getPatientRecords = async (req, res) => {
    try {
        const patientId = req.params.id;
        const [records] = await db.query(
            'SELECT * FROM medical_records WHERE patient_id = ? ORDER BY date DESC',
            [patientId]
        );
        res.json({
            success: true,
            records
        });
    } catch (error) {
        console.error('Get patient records error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get patient records',
            error: error.message
        });
    }
};

// ✅ GET patient appointments
exports.getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.params.id;
        const [appointments] = await db.query(
            `SELECT a.*, d.name as doctor_name 
             FROM appointments a 
             LEFT JOIN doctors d ON a.doctor_id = d.id 
             WHERE a.patient_id = ? 
             ORDER BY a.appointment_date DESC`,
            [patientId]
        );
        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Get patient appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get patient appointments',
            error: error.message
        });
    }
};
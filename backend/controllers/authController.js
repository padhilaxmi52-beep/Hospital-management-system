const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Patient, Doctor, Employee } = require('../models');
const db = require('../config/database');
const { generateId } = require('../utils/helpers');

// Register new patient
exports.registerPatient = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        if (!name || !email || !password || !address || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Patient already registered. Please login.'
            });
        }

        const existingPatientEmail = await Patient.findByEmail(email);
        if (existingPatientEmail) {
            return res.status(409).json({
                success: false,
                message: 'Patient already registered. Please login.'
            });
        }

        const existingPatientPhone = await Patient.findByPhone(phone);
        if (existingPatientPhone) {
            return res.status(409).json({
                success: false,
                message: 'Patient already registered. Please login.'
            });
        }

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const userId = generateId('U');
            const patientId = generateId('PAT');

            // ✅ Store plain text password for demo
            // (This matches your existing users)
            await User.create({
                id: userId,
                email,
                password: password, // Plain text
                name,
                role: 'patient'
            });

            await Patient.create({
                id: patientId,
                name,
                email,
                phone,
                address,
                diagnosis: 'Healthy (New Patient)',
                admissionDate: new Date().toISOString().split('T')[0],
                doctorId: null,
                userId
            });

            await connection.commit();

            const token = jwt.sign(
                { id: userId, email, role: 'patient' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(201).json({
                success: true,
                message: 'Registration successful!',
                token,
                user: {
                    id: userId,
                    email,
                    name,
                    role: 'patient'
                }
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
};

// ✅ FIXED: Login that handles both plain text and hashed passwords
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // ✅ Check if password is hashed (starts with $2b$)
        const isHashed = user.password.startsWith('$2b$');
        
        let isPasswordValid = false;
        
        if (isHashed) {
            // Compare with bcrypt
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Compare as plain text
            isPasswordValid = user.password === password;
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        let additionalData = {};
        
        if (user.role === 'patient') {
            const patient = await Patient.findById(req.userId);
            additionalData.patient = patient;
        } else if (user.role === 'doctor') {
            const doctor = await Doctor.findById(req.userId);
            additionalData.doctor = doctor;
        } else if (user.role === 'staff' || user.role === 'admin') {
            const employee = await Employee.findById(req.userId);
            additionalData.employee = employee;
        }

        res.json({
            success: true,
            user,
            ...additionalData
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile.'
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.userId;

        if (email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already in use.'
                });
            }
        }

        if (name || email) {
            await User.update(userId, { name, email });
        }

        if (password) {
            // Store as plain text (matching your database)
            await db.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [password, userId]
            );
        }

        const updatedUser = await User.findById(userId);

        res.json({
            success: true,
            message: 'Profile updated successfully.',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile.'
        });
    }
};
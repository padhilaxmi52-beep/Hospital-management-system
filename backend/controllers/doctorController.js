const { Doctor, User } = require('../models');
const { generateId } = require('../utils/helpers');
const bcrypt = require('bcrypt');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll();
        res.json({
            success: true,
            doctors
        });
    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctors.'
        });
    }
};

// Get single doctor
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            });
        }
        res.json({
            success: true,
            doctor
        });
    } catch (error) {
        console.error('Get doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctor.'
        });
    }
};

// Create doctor (Admin only)
exports.createDoctor = async (req, res) => {
    try {
        const { name, specialization, qualification, salary, email } = req.body;

        if (!name || !specialization || !qualification || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name, specialization, qualification, and email are required.'
            });
        }

        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered.'
            });
        }

        const doctorId = generateId('DOC');
        const userId = generateId('U');

        // Create user
        await User.create({
            id: userId,
            email,
            password: await bcrypt.hash('123', 10),
            name,
            role: 'doctor'
        });

        // Create doctor
        await Doctor.create({
            id: doctorId,
            name,
            specialization,
            qualification,
            salary: salary || 0,
            email,
            userId
        });

        const newDoctor = await Doctor.findById(doctorId);

        res.status(201).json({
            success: true,
            message: 'Doctor added successfully.',
            doctor: newDoctor
        });

    } catch (error) {
        console.error('Create doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create doctor.'
        });
    }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
    try {
        const { name, specialization, qualification, salary, email } = req.body;
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            });
        }

        await Doctor.update(doctorId, {
            name,
            specialization,
            qualification,
            salary,
            email
        });

        // Update user if exists
        if (doctor.user_id) {
            await User.update(doctor.user_id, { name, email });
        }

        const updatedDoctor = await Doctor.findById(doctorId);

        res.json({
            success: true,
            message: 'Doctor updated successfully.',
            doctor: updatedDoctor
        });

    } catch (error) {
        console.error('Update doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update doctor.'
        });
    }
};

// Delete doctor (Admin only)
exports.deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            });
        }

        // Delete doctor
        await Doctor.delete(doctorId);

        // Delete associated user if exists
        if (doctor.user_id) {
            await User.delete(doctor.user_id);
        }

        res.json({
            success: true,
            message: 'Doctor deleted successfully.'
        });

    } catch (error) {
        console.error('Delete doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete doctor.'
        });
    }
};

// Get doctor's patients
exports.getDoctorPatients = async (req, res) => {
    try {
        const patients = await Doctor.getPatients(req.params.id);
        res.json({
            success: true,
            patients
        });
    } catch (error) {
        console.error('Get doctor patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctor patients.'
        });
    }
};

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
    try {
        const Appointment = require('../models/Appointment');
        const appointments = await Appointment.findByDoctor(req.params.id);
        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctor appointments.'
        });
    }
};
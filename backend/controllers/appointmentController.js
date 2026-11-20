const Appointment = require('../models/Appointment');
const { generateId } = require('../utils/helpers');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get appointments.'
        });
    }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found.'
            });
        }
        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get appointment.'
        });
    }
};

// Create appointment
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, reason, status } = req.body;

        if (!patientId || !doctorId || !date || !time || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Patient ID, Doctor ID, date, time, and reason are required.'
            });
        }

        const appointmentId = generateId('APP');

        await Appointment.create({
            id: appointmentId,
            patientId,
            doctorId,
            date,
            time,
            reason,
            status: status || 'Pending'
        });

        const newAppointment = await Appointment.findById(appointmentId);

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully.',
            appointment: newAppointment
        });

    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book appointment.'
        });
    }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentId = req.params.id;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required.'
            });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found.'
            });
        }

        await Appointment.updateStatus(appointmentId, status);

        const updatedAppointment = await Appointment.findById(appointmentId);

        res.json({
            success: true,
            message: `Appointment ${status} successfully.`,
            appointment: updatedAppointment
        });

    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment status.'
        });
    }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
    try {
        const { date, time, reason, doctorId } = req.body;
        const appointmentId = req.params.id;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found.'
            });
        }

        await Appointment.update(appointmentId, {
            date,
            time,
            reason,
            doctorId
        });

        const updatedAppointment = await Appointment.findById(appointmentId);

        res.json({
            success: true,
            message: 'Appointment updated successfully.',
            appointment: updatedAppointment
        });

    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment.'
        });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found.'
            });
        }

        await Appointment.delete(appointmentId);

        res.json({
            success: true,
            message: 'Appointment deleted successfully.'
        });

    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete appointment.'
        });
    }
};

// Get appointments by patient
exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const appointments = await Appointment.findByPatient(req.params.patientId);
        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Get appointments by patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get patient appointments.'
        });
    }
};

// Get appointments by doctor
exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const appointments = await Appointment.findByDoctor(req.params.doctorId);
        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Get appointments by doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctor appointments.'
        });
    }
};
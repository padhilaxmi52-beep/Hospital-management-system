const { Patient, Doctor, Employee, MedicalRecord, Appointment } = require('../models');

// Get dashboard stats
exports.getStats = async (req, res) => {
    try {
        const [patients, doctors, employees, records, appointments] = await Promise.all([
            Patient.getCount(),
            Doctor.getCount(),
            Employee.getCount(),
            MedicalRecord.getCount(),
            Appointment.getCount()
        ]);

        res.json({
            success: true,
            stats: {
                patients,
                doctors,
                employees,
                records,
                appointments
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics.'
        });
    }
};

// Get recent patients for dashboard
exports.getRecentPatients = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const patients = await Patient.getRecent(limit);
        res.json({
            success: true,
            patients
        });
    } catch (error) {
        console.error('Get recent patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get recent patients.'
        });
    }
};
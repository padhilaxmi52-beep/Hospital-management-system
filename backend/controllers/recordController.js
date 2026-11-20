const MedicalRecord = require('../models/MedicalRecord');
const { generateId } = require('../utils/helpers');

// Get all medical records
exports.getAllRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.findAll();
        res.json({
            success: true,
            records
        });
    } catch (error) {
        console.error('Get records error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get medical records.'
        });
    }
};

// Get single record
exports.getRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found.'
            });
        }
        res.json({
            success: true,
            record
        });
    } catch (error) {
        console.error('Get record error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get medical record.'
        });
    }
};

// Create medical record
exports.createRecord = async (req, res) => {
    try {
        const { patientId, doctorId, problem, description } = req.body;

        if (!patientId || !doctorId || !problem || !description) {
            return res.status(400).json({
                success: false,
                message: 'Patient ID, Doctor ID, problem, and description are required.'
            });
        }

        const recordId = generateId('REC');
        const today = new Date().toISOString().split('T')[0];

        await MedicalRecord.create({
            id: recordId,
            patientId,
            doctorId,
            date: today,
            problem,
            description
        });

        const newRecord = await MedicalRecord.findById(recordId);

        res.status(201).json({
            success: true,
            message: 'Medical record created successfully.',
            record: newRecord
        });

    } catch (error) {
        console.error('Create record error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create medical record.'
        });
    }
};

// Update medical record
exports.updateRecord = async (req, res) => {
    try {
        const { problem, description, doctorId } = req.body;
        const recordId = req.params.id;

        const record = await MedicalRecord.findById(recordId);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found.'
            });
        }

        await MedicalRecord.update(recordId, {
            problem,
            description,
            doctorId
        });

        const updatedRecord = await MedicalRecord.findById(recordId);

        res.json({
            success: true,
            message: 'Medical record updated successfully.',
            record: updatedRecord
        });

    } catch (error) {
        console.error('Update record error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update medical record.'
        });
    }
};

// Delete medical record
exports.deleteRecord = async (req, res) => {
    try {
        const recordId = req.params.id;
        const record = await MedicalRecord.findById(recordId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found.'
            });
        }

        await MedicalRecord.delete(recordId);

        res.json({
            success: true,
            message: 'Medical record deleted successfully.'
        });

    } catch (error) {
        console.error('Delete record error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete medical record.'
        });
    }
};

// Get records by patient
exports.getRecordsByPatient = async (req, res) => {
    try {
        const records = await MedicalRecord.findByPatient(req.params.patientId);
        res.json({
            success: true,
            records
        });
    } catch (error) {
        console.error('Get records by patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get patient records.'
        });
    }
};
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, patientController.getAllPatients);
router.get('/:id', authMiddleware, patientController.getPatient);
router.post('/', authMiddleware, adminMiddleware, patientController.createPatient);
router.put('/:id', authMiddleware, patientController.updatePatient);
router.delete('/:id', authMiddleware, adminMiddleware, patientController.deletePatient);
router.get('/:id/records', authMiddleware, patientController.getPatientRecords);
router.get('/:id/appointments', authMiddleware, patientController.getPatientAppointments);

module.exports = router;
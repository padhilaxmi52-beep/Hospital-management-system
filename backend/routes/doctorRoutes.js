const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Protected routes
router.get('/', authMiddleware, doctorController.getAllDoctors);
router.get('/:id', authMiddleware, doctorController.getDoctor);
router.post('/', authMiddleware, adminMiddleware, doctorController.createDoctor);
router.put('/:id', authMiddleware, adminMiddleware, doctorController.updateDoctor);
router.delete('/:id', authMiddleware, adminMiddleware, doctorController.deleteDoctor);
router.get('/:id/patients', authMiddleware, doctorController.getDoctorPatients);
router.get('/:id/appointments', authMiddleware, doctorController.getDoctorAppointments);

module.exports = router;
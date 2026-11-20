const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes
router.get('/', authMiddleware, appointmentController.getAllAppointments);
router.get('/:id', authMiddleware, appointmentController.getAppointment);
router.post('/', authMiddleware, appointmentController.createAppointment);
router.put('/:id', authMiddleware, appointmentController.updateAppointment);
router.put('/:id/status', authMiddleware, appointmentController.updateAppointmentStatus);
router.delete('/:id', authMiddleware, appointmentController.deleteAppointment);
router.get('/patient/:patientId', authMiddleware, appointmentController.getAppointmentsByPatient);
router.get('/doctor/:doctorId', authMiddleware, appointmentController.getAppointmentsByDoctor);

module.exports = router;
const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes
router.get('/', authMiddleware, recordController.getAllRecords);
router.get('/:id', authMiddleware, recordController.getRecord);
router.post('/', authMiddleware, recordController.createRecord);
router.put('/:id', authMiddleware, recordController.updateRecord);
router.delete('/:id', authMiddleware, recordController.deleteRecord);
router.get('/patient/:patientId', authMiddleware, recordController.getRecordsByPatient);

module.exports = router;
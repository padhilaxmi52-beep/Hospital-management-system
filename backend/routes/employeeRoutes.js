const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Protected routes (Admin only)
router.get('/', authMiddleware, adminMiddleware, employeeController.getAllEmployees);
router.get('/:id', authMiddleware, adminMiddleware, employeeController.getEmployee);
router.post('/', authMiddleware, adminMiddleware, employeeController.createEmployee);
router.put('/:id', authMiddleware, adminMiddleware, employeeController.updateEmployee);
router.delete('/:id', authMiddleware, adminMiddleware, employeeController.deleteEmployee);

module.exports = router;
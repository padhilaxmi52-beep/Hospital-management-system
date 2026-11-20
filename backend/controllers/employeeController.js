const { Employee, User } = require('../models');
const { generateId } = require('../utils/helpers');
const bcrypt = require('bcrypt');

// Get all employees (Admin only)
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json({
            success: true,
            employees
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get employees.'
        });
    }
};

// Get single employee
exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.'
            });
        }
        res.json({
            success: true,
            employee
        });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get employee.'
        });
    }
};

// Create employee (Admin only)
exports.createEmployee = async (req, res) => {
    try {
        const { name, role, email } = req.body;

        if (!name || !role || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name, role, and email are required.'
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

        const employeeId = generateId('EMP');
        const userId = generateId('U');

        // Create user
        await User.create({
            id: userId,
            email,
            password: await bcrypt.hash('123', 10),
            name,
            role: role.toLowerCase()
        });

        // Create employee
        await Employee.create({
            id: employeeId,
            name,
            role,
            email,
            userId
        });

        const newEmployee = await Employee.findById(employeeId);

        res.status(201).json({
            success: true,
            message: 'Employee added successfully.',
            employee: newEmployee
        });

    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create employee.'
        });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const { name, role, email } = req.body;
        const employeeId = req.params.id;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.'
            });
        }

        await Employee.update(employeeId, {
            name,
            role,
            email
        });

        // Update user if exists
        if (employee.user_id) {
            await User.update(employee.user_id, { name, email });
        }

        const updatedEmployee = await Employee.findById(employeeId);

        res.json({
            success: true,
            message: 'Employee updated successfully.',
            employee: updatedEmployee
        });

    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update employee.'
        });
    }
};

// Delete employee (Admin only)
exports.deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.'
            });
        }

        // Delete employee
        await Employee.delete(employeeId);

        // Delete associated user if exists
        if (employee.user_id) {
            await User.delete(employee.user_id);
        }

        res.json({
            success: true,
            message: 'Employee deleted successfully.'
        });

    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete employee.'
        });
    }
};
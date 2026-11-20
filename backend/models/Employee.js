const db = require('../config/database');

class Employee {
    static async create({ id, name, role, email, userId }) {
        const [result] = await db.query(
            'INSERT INTO employees (id, name, role, email, user_id) VALUES (?, ?, ?, ?, ?)',
            [id, name, role, email, userId]
        );
        return result;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM employees WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT e.*, u.email as user_email, u.name as user_name
             FROM employees e
             LEFT JOIN users u ON e.user_id = u.id
             WHERE e.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.query(
            `SELECT e.*, u.email as user_email, u.name as user_name
             FROM employees e
             LEFT JOIN users u ON e.user_id = u.id
             ORDER BY e.name`
        );
        return rows;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        
        if (data.name) { fields.push('name = ?'); values.push(data.name); }
        if (data.role) { fields.push('role = ?'); values.push(data.role); }
        if (data.email) { fields.push('email = ?'); values.push(data.email); }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        const [result] = await db.query(
            `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM employees WHERE id = ?',
            [id]
        );
        return result;
    }

    static async getCount() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM employees'
        );
        return rows[0].count;
    }
}

module.exports = Employee;
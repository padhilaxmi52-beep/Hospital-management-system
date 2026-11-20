const db = require('../config/database');

class Doctor {
    static async create({ id, name, specialization, qualification, salary, email, userId }) {
        const [result] = await db.query(
            'INSERT INTO doctors (id, name, specialization, qualification, salary, email, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, specialization, qualification, salary, email, userId]
        );
        return result;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM doctors WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT d.*, u.email as user_email, u.name as user_name
             FROM doctors d
             LEFT JOIN users u ON d.user_id = u.id
             WHERE d.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.query(
            `SELECT d.*, u.email as user_email, u.name as user_name
             FROM doctors d
             LEFT JOIN users u ON d.user_id = u.id
             ORDER BY d.name`
        );
        return rows;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        
        if (data.name) { fields.push('name = ?'); values.push(data.name); }
        if (data.specialization) { fields.push('specialization = ?'); values.push(data.specialization); }
        if (data.qualification) { fields.push('qualification = ?'); values.push(data.qualification); }
        if (data.salary !== undefined) { fields.push('salary = ?'); values.push(data.salary); }
        if (data.email) { fields.push('email = ?'); values.push(data.email); }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        const [result] = await db.query(
            `UPDATE doctors SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM doctors WHERE id = ?',
            [id]
        );
        return result;
    }

    static async getCount() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM doctors'
        );
        return rows[0].count;
    }

    static async getPatients(doctorId) {
        const [rows] = await db.query(
            'SELECT * FROM patients WHERE doctor_id = ?',
            [doctorId]
        );
        return rows;
    }
}

module.exports = Doctor;
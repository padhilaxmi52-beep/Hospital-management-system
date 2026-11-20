const db = require('../config/database');

class Appointment {
    static async create({ id, patientId, doctorId, date, time, reason, status }) {
        const [result] = await db.query(
            'INSERT INTO appointments (id, patient_id, doctor_id, date, time, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, patientId, doctorId, date, time, reason, status || 'Pending']
        );
        return result;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT a.*, p.name as patient_name, d.name as doctor_name, d.specialization as doctor_specialization
             FROM appointments a
             LEFT JOIN patients p ON a.patient_id = p.id
             LEFT JOIN doctors d ON a.doctor_id = d.id
             WHERE a.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.query(
            `SELECT a.*, p.name as patient_name, d.name as doctor_name
             FROM appointments a
             LEFT JOIN patients p ON a.patient_id = p.id
             LEFT JOIN doctors d ON a.doctor_id = d.id
             ORDER BY a.date DESC, a.time DESC`
        );
        return rows;
    }

    static async findByPatient(patientId) {
        const [rows] = await db.query(
            `SELECT a.*, d.name as doctor_name, d.specialization as doctor_specialization
             FROM appointments a
             LEFT JOIN doctors d ON a.doctor_id = d.id
             WHERE a.patient_id = ?
             ORDER BY a.date DESC, a.time DESC`,
            [patientId]
        );
        return rows;
    }

    static async findByDoctor(doctorId) {
        const [rows] = await db.query(
            `SELECT a.*, p.name as patient_name
             FROM appointments a
             LEFT JOIN patients p ON a.patient_id = p.id
             WHERE a.doctor_id = ?
             ORDER BY a.date DESC, a.time DESC`,
            [doctorId]
        );
        return rows;
    }

    static async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, id]
        );
        return result;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        
        if (data.date) { fields.push('date = ?'); values.push(data.date); }
        if (data.time) { fields.push('time = ?'); values.push(data.time); }
        if (data.reason) { fields.push('reason = ?'); values.push(data.reason); }
        if (data.status) { fields.push('status = ?'); values.push(data.status); }
        if (data.doctorId) { fields.push('doctor_id = ?'); values.push(data.doctorId); }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        const [result] = await db.query(
            `UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM appointments WHERE id = ?',
            [id]
        );
        return result;
    }

    static async getCount() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM appointments'
        );
        return rows[0].count;
    }

    static async getPendingCount() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE status = "Pending"'
        );
        return rows[0].count;
    }
}

module.exports = Appointment;
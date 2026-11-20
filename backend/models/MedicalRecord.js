const db = require('../config/database');

class MedicalRecord {
    static async create({ id, patientId, doctorId, date, problem, description }) {
        const [result] = await db.query(
            'INSERT INTO medical_records (id, patient_id, doctor_id, date, problem, description) VALUES (?, ?, ?, ?, ?, ?)',
            [id, patientId, doctorId, date, problem, description]
        );
        return result;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT r.*, p.name as patient_name, d.name as doctor_name
             FROM medical_records r
             LEFT JOIN patients p ON r.patient_id = p.id
             LEFT JOIN doctors d ON r.doctor_id = d.id
             WHERE r.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.query(
            `SELECT r.*, p.name as patient_name, d.name as doctor_name
             FROM medical_records r
             LEFT JOIN patients p ON r.patient_id = p.id
             LEFT JOIN doctors d ON r.doctor_id = d.id
             ORDER BY r.date DESC`
        );
        return rows;
    }

    static async findByPatient(patientId) {
        const [rows] = await db.query(
            `SELECT r.*, d.name as doctor_name
             FROM medical_records r
             LEFT JOIN doctors d ON r.doctor_id = d.id
             WHERE r.patient_id = ?
             ORDER BY r.date DESC`,
            [patientId]
        );
        return rows;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        
        if (data.problem) { fields.push('problem = ?'); values.push(data.problem); }
        if (data.description) { fields.push('description = ?'); values.push(data.description); }
        if (data.doctorId) { fields.push('doctor_id = ?'); values.push(data.doctorId); }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        const [result] = await db.query(
            `UPDATE medical_records SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM medical_records WHERE id = ?',
            [id]
        );
        return result;
    }

    static async getCount() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM medical_records'
        );
        return rows[0].count;
    }
}

module.exports = MedicalRecord;
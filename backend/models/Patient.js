// const db = require('../config/database');

// class Patient {
//     static async create({ id, name, email, phone, address, diagnosis, admissionDate, doctorId, userId }) {
//         const [result] = await db.query(
//             `INSERT INTO patients 
//             (id, name, email, phone, address, diagnosis, admission_date, doctor_id, user_id) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [id, name, email, phone, address, diagnosis, admissionDate, doctorId, userId]
//         );
//         return result;
//     }

//     static async findByEmail(email) {
//         const [rows] = await db.query(
//             'SELECT * FROM patients WHERE email = ?',
//             [email]
//         );
//         return rows[0];
//     }

//     static async findByPhone(phone) {
//         const [rows] = await db.query(
//             'SELECT * FROM patients WHERE phone = ?',
//             [phone]
//         );
//         return rows[0];
//     }

//     static async findById(id) {
//         const [rows] = await db.query(
//             `SELECT p.*, d.name as doctor_name, d.specialization as doctor_specialization,
//              u.name as user_name, u.email as user_email, u.role as user_role
//              FROM patients p
//              LEFT JOIN doctors d ON p.doctor_id = d.id
//              LEFT JOIN users u ON p.user_id = u.id
//              WHERE p.id = ?`,
//             [id]
//         );
//         return rows[0];
//     }

//     static async findAll() {
//         const [rows] = await db.query(
//             `SELECT p.*, d.name as doctor_name, d.specialization as doctor_specialization
//              FROM patients p
//              LEFT JOIN doctors d ON p.doctor_id = d.id
//              ORDER BY p.created_at DESC`
//         );
//         return rows;
//     }

//     static async update(id, data) {
//         const fields = [];
//         const values = [];
        
//         if (data.name) { fields.push('name = ?'); values.push(data.name); }
//         if (data.email) { fields.push('email = ?'); values.push(data.email); }
//         if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
//         if (data.address) { fields.push('address = ?'); values.push(data.address); }
//         if (data.diagnosis) { fields.push('diagnosis = ?'); values.push(data.diagnosis); }
//         if (data.doctorId) { fields.push('doctor_id = ?'); values.push(data.doctorId); }
        
//         if (fields.length === 0) return null;
        
//         values.push(id);
//         const [result] = await db.query(
//             `UPDATE patients SET ${fields.join(', ')} WHERE id = ?`,
//             values
//         );
//         return result;
//     }

//     static async delete(id) {
//         const [result] = await db.query(
//             'DELETE FROM patients WHERE id = ?',
//             [id]
//         );
//         return result;
//     }

//     static async getCount() {
//         const [rows] = await db.query(
//             'SELECT COUNT(*) as count FROM patients'
//         );
//         return rows[0].count;
//     }

//     static async getRecent(limit = 5) {
//         const [rows] = await db.query(
//             `SELECT p.*, d.name as doctor_name
//              FROM patients p
//              LEFT JOIN doctors d ON p.doctor_id = d.id
//              ORDER BY p.created_at DESC
//              LIMIT ?`,
//             [limit]
//         );
//         return rows;
//     }
// }

// module.exports = Patient;
const db = require('../config/database');

class Patient {
    static async create({ id, user_id, name, email, phone, address, diagnosis }) {
        const [result] = await db.query(
            `INSERT INTO patients 
            (id, user_id, name, email, phone, address, diagnosis) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, user_id, name, email, phone, address, diagnosis]
        );
        return result;
    }

    static async findAll() {
        const [rows] = await db.query(
            `SELECT p.*, u.name as user_name, u.email as user_email 
             FROM patients p 
             LEFT JOIN users u ON p.user_id = u.id 
             ORDER BY p.created_at DESC`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT p.*, u.name as user_name, u.email as user_email 
             FROM patients p 
             LEFT JOIN users u ON p.user_id = u.id 
             WHERE p.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM patients WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findByPhone(phone) {
        const [rows] = await db.query(
            'SELECT * FROM patients WHERE phone = ?',
            [phone]
        );
        return rows[0];
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.name) { fields.push('name = ?'); values.push(data.name); }
        if (data.email) { fields.push('email = ?'); values.push(data.email); }
        if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
        if (data.address) { fields.push('address = ?'); values.push(data.address); }
        if (data.diagnosis) { fields.push('diagnosis = ?'); values.push(data.diagnosis); }
        if (data.doctorId) { fields.push('doctor_id = ?'); values.push(data.doctorId); }
        if (fields.length === 0) return null;
        values.push(id);
        const [result] = await db.query(
            `UPDATE patients SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM patients WHERE id = ?',
            [id]
        );
        return result;
    }

    static async getCount() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM patients'
        );
        return rows[0].count;
    }
}

module.exports = Patient;
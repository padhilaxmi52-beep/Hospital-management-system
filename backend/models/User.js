const db = require('../config/database');

class User {
    static async create({ id, email, password, name, role }) {
        const [result] = await db.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
            [id, email, password, name, role]
        );
        return result;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updatePassword(id, hashedPassword) {
        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        return result;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        
        if (data.name) { fields.push('name = ?'); values.push(data.name); }
        if (data.email) { fields.push('email = ?'); values.push(data.email); }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        const [result] = await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        return result;
    }
}

module.exports = User;
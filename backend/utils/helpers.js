// Generate unique ID
const generateId = (prefix) => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${num}`;
};

// Format date
const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
};

// Validate email
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validate phone
const isValidPhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
};

module.exports = {
    generateId,
    formatDate,
    isValidEmail,
    isValidPhone
};
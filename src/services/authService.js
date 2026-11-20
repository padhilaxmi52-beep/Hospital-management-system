// import api from './api';

// const authService = {
//     login: async (email, password) => {
//         const response = await api.post('/auth/login', { email, password });
//         if (response.data.success) {
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('user', JSON.stringify(response.data.user));
//         }
//         return response.data;
//     },

//     register: async (userData) => {
//         const response = await api.post('/auth/register', userData);
//         if (response.data.success) {
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('user', JSON.stringify(response.data.user));
//         }
//         return response.data;
//     },

//     logout: () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//     },

//     getCurrentUser: () => {
//         const userStr = localStorage.getItem('user');
//         return userStr ? JSON.parse(userStr) : null;
//     },

//     getToken: () => localStorage.getItem('token'),

//     isAuthenticated: () => !!localStorage.getItem('token')
// };

// export default authService;


import api from './api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken: () => localStorage.getItem('token'),

    isAuthenticated: () => !!localStorage.getItem('token')
};

export default authService;
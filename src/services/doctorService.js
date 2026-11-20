// import api from './api';

// const doctorService = {
//     getAll: async () => {
//         const response = await api.get('/doctors');
//         return response.data;
//     },

//     getById: async (id) => {
//         const response = await api.get(`/doctors/${id}`);
//         return response.data;
//     },

//     create: async (data) => {
//         const response = await api.post('/doctors', data);
//         return response.data;
//     },

//     update: async (id, data) => {
//         const response = await api.put(`/doctors/${id}`, data);
//         return response.data;
//     },

//     delete: async (id) => {
//         const response = await api.delete(`/doctors/${id}`);
//         return response.data;
//     },

//     getPatients: async (doctorId) => {
//         const response = await api.get(`/doctors/${doctorId}/patients`);
//         return response.data;
//     },

//     getAppointments: async (doctorId) => {
//         const response = await api.get(`/doctors/${doctorId}/appointments`);
//         return response.data;
//     }
// };

// export default doctorService;

import api from './api';

const doctorService = {
    getAll: async () => {
        const response = await api.get('/doctors');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/doctors/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/doctors', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/doctors/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/doctors/${id}`);
        return response.data;
    },

    getPatients: async (doctorId) => {
        const response = await api.get(`/doctors/${doctorId}/patients`);
        return response.data;
    },

    getAppointments: async (doctorId) => {
        const response = await api.get(`/doctors/${doctorId}/appointments`);
        return response.data;
    }
};

export default doctorService;
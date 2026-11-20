// import api from './api';

// const appointmentService = {
//     getAll: async () => {
//         const response = await api.get('/appointments');
//         return response.data;
//     },

//     getById: async (id) => {
//         const response = await api.get(`/appointments/${id}`);
//         return response.data;
//     },

//     create: async (data) => {
//         const response = await api.post('/appointments', data);
//         return response.data;
//     },

//     update: async (id, data) => {
//         const response = await api.put(`/appointments/${id}`, data);
//         return response.data;
//     },

//     updateStatus: async (id, status) => {
//         const response = await api.put(`/appointments/${id}/status`, { status });
//         return response.data;
//     },

//     delete: async (id) => {
//         const response = await api.delete(`/appointments/${id}`);
//         return response.data;
//     },

//     getByPatient: async (patientId) => {
//         const response = await api.get(`/appointments/patient/${patientId}`);
//         return response.data;
//     },

//     getByDoctor: async (doctorId) => {
//         const response = await api.get(`/appointments/doctor/${doctorId}`);
//         return response.data;
//     }
// };

// export default appointmentService;


import api from './api';

const appointmentService = {
    getAll: async () => {
        const response = await api.get('/appointments');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/appointments/${id}/status`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    },

    getByPatient: async (patientId) => {
        const response = await api.get(`/appointments/patient/${patientId}`);
        return response.data;
    },

    getByDoctor: async (doctorId) => {
        const response = await api.get(`/appointments/doctor/${doctorId}`);
        return response.data;
    }
};

export default appointmentService;
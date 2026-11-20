// import api from './api';

// const recordService = {
//     getAll: async () => {
//         const response = await api.get('/records');
//         return response.data;
//     },

//     getById: async (id) => {
//         const response = await api.get(`/records/${id}`);
//         return response.data;
//     },

//     create: async (data) => {
//         const response = await api.post('/records', data);
//         return response.data;
//     },

//     update: async (id, data) => {
//         const response = await api.put(`/records/${id}`, data);
//         return response.data;
//     },

//     delete: async (id) => {
//         const response = await api.delete(`/records/${id}`);
//         return response.data;
//     },

//     getByPatient: async (patientId) => {
//         const response = await api.get(`/records/patient/${patientId}`);
//         return response.data;
//     }
// };

// export default recordService;




import api from './api';

const recordService = {
    getAll: async () => {
        const response = await api.get('/records');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/records/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/records', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/records/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/records/${id}`);
        return response.data;
    },

    getByPatient: async (patientId) => {
        const response = await api.get(`/records/patient/${patientId}`);
        return response.data;
    }
};

export default recordService;
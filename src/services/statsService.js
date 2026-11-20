// import api from './api';

// const statsService = {
//     getStats: async () => {
//         const response = await api.get('/stats');
//         return response.data;
//     },

//     getRecentPatients: async (limit = 5) => {
//         const response = await api.get(`/stats/recent-patients?limit=${limit}`);
//         return response.data;
//     }
// };

// export default statsService;



import api from './api';

const statsService = {
    getStats: async () => {
        const response = await api.get('/stats');
        return response.data;
    },

    getRecentPatients: async (limit = 5) => {
        const response = await api.get(`/stats/recent-patients?limit=${limit}`);
        return response.data;
    }
};

export default statsService;
import api from './api';

export const sportService = {
  getSports: async (params = {}) => {
    const res = await api.get('/sports', { params });
    return res.data;
  },

  getSportById: async (id) => {
    const res = await api.get(`/sports/${id}`);
    return res.data;
  },

  createSport: async (sportData) => {
    const res = await api.post('/sports', sportData);
    return res.data;
  },

  updateSport: async (id, sportData) => {
    const res = await api.put(`/sports/${id}`, sportData);
    return res.data;
  },

  deleteSport: async (id) => {
    const res = await api.delete(`/sports/${id}`);
    return res.data;
  }
};

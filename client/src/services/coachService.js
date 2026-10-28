import api from './api';

export const coachService = {
  getCoaches: async (params = {}) => {
    const res = await api.get('/coaches', { params });
    return res.data;
  },

  getCoachById: async (id) => {
    const res = await api.get(`/coaches/${id}`);
    return res.data;
  },

  createCoach: async (coachData) => {
    const res = await api.post('/coaches', coachData);
    return res.data;
  },

  updateCoach: async (id, coachData) => {
    const res = await api.put(`/coaches/${id}`, coachData);
    return res.data;
  },

  deleteCoach: async (id) => {
    const res = await api.delete(`/coaches/${id}`);
    return res.data;
  }
};

import api from './api';

export const facilityService = {
  getFacilities: async (params = {}) => {
    const res = await api.get('/facilities', { params });
    return res.data;
  },

  getFacilityById: async (id) => {
    const res = await api.get(`/facilities/${id}`);
    return res.data;
  },

  createFacility: async (facilityData) => {
    const res = await api.post('/facilities', facilityData);
    return res.data;
  },

  updateFacility: async (id, facilityData) => {
    const res = await api.put(`/facilities/${id}`, facilityData);
    return res.data;
  },

  deleteFacility: async (id) => {
    const res = await api.delete(`/facilities/${id}`);
    return res.data;
  }
};

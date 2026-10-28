import api from './api';

export const membershipService = {
  getPlans: async (params = {}) => {
    const res = await api.get('/memberships/plans', { params });
    return res.data;
  },

  createPlan: async (planData) => {
    const res = await api.post('/memberships/plans', planData);
    return res.data;
  },

  updatePlan: async (id, planData) => {
    const res = await api.put(`/memberships/plans/${id}`, planData);
    return res.data;
  },

  deletePlan: async (id) => {
    const res = await api.delete(`/memberships/plans/${id}`);
    return res.data;
  },

  getMyMembership: async () => {
    const res = await api.get('/memberships/my');
    return res.data;
  },

  getAllMemberships: async (params = {}) => {
    const res = await api.get('/memberships/all', { params });
    return res.data;
  },

  checkoutMembership: async (checkoutData) => {
    const res = await api.post('/memberships/checkout', checkoutData);
    return res.data;
  }
};

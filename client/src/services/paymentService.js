import api from './api';

export const paymentService = {
  getAllPayments: async (params = {}) => {
    const res = await api.get('/payments', { params });
    return res.data;
  },

  getMyPayments: async () => {
    const res = await api.get('/payments/my');
    return res.data;
  },

  getPaymentById: async (id) => {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  },

  demoCheckout: async (paymentData) => {
    const res = await api.post('/payments/demo-checkout', paymentData);
    return res.data;
  }
};

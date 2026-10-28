import api from './api';

export const contactService = {
  submitContact: async (messageData) => {
    const res = await api.post('/contact', messageData);
    return res.data;
  },

  getContacts: async () => {
    const res = await api.get('/contact');
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/contact/${id}/status`, { status });
    return res.data;
  }
};

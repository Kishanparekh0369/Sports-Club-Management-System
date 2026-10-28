import api from './api';

export const eventService = {
  getEvents: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data;
  },

  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },

  createEvent: async (eventData) => {
    const res = await api.post('/events', eventData);
    return res.data;
  },

  updateEvent: async (id, eventData) => {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  },

  deleteEvent: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },

  registerEvent: async (id) => {
    const res = await api.post(`/events/${id}/register`);
    return res.data;
  },

  cancelEventRegistration: async (id) => {
    const res = await api.delete(`/events/${id}/register`);
    return res.data;
  },

  exportParticipantsCSV: async (id) => {
    const res = await api.get(`/events/${id}/export`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `event-participants-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

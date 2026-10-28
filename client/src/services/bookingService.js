import api from './api';

export const bookingService = {
  getAllBookings: async (params = {}) => {
    const res = await api.get('/bookings', { params });
    return res.data;
  },

  getMyBookings: async (params = {}) => {
    const res = await api.get('/bookings/my', { params });
    return res.data;
  },

  createBooking: async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  },

  updateBookingStatus: async (id, status, rejectionReason = '') => {
    const res = await api.patch(`/bookings/${id}/status`, { status, rejectionReason });
    return res.data;
  },

  cancelBooking: async (id) => {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data;
  }
};

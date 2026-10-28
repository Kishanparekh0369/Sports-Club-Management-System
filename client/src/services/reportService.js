import api from './api';

export const reportService = {
  getDashboardStats: async () => {
    const res = await api.get('/reports/dashboard');
    return res.data;
  },

  getMemberReport: async (params = {}) => {
    const res = await api.get('/reports/members', { params });
    return res.data;
  },

  exportMembersCSV: async (params = {}) => {
    const res = await api.get('/reports/members', {
      params: { ...params, exportCsv: 'true' },
      responseType: 'blob'
    });
    downloadBlob(res.data, 'members-report.csv');
  },

  getBookingReport: async (params = {}) => {
    const res = await api.get('/reports/bookings', { params });
    return res.data;
  },

  exportBookingsCSV: async (params = {}) => {
    const res = await api.get('/reports/bookings', {
      params: { ...params, exportCsv: 'true' },
      responseType: 'blob'
    });
    downloadBlob(res.data, 'bookings-report.csv');
  },

  getPaymentReport: async (params = {}) => {
    const res = await api.get('/reports/payments', { params });
    return res.data;
  },

  exportPaymentsCSV: async (params = {}) => {
    const res = await api.get('/reports/payments', {
      params: { ...params, exportCsv: 'true' },
      responseType: 'blob'
    });
    downloadBlob(res.data, 'payments-report.csv');
  },

  getSportReport: async (params = {}) => {
    const res = await api.get('/reports/sports', { params });
    return res.data;
  },

  exportSportsCSV: async (params = {}) => {
    const res = await api.get('/reports/sports', {
      params: { ...params, exportCsv: 'true' },
      responseType: 'blob'
    });
    downloadBlob(res.data, 'sports-report.csv');
  }
};

const downloadBlob = (data, filename) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

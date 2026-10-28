import api from './api';

export const memberService = {
  getMembers: async (params = {}) => {
    const res = await api.get('/members', { params });
    return res.data;
  },

  getMemberById: async (id) => {
    const res = await api.get(`/members/${id}`);
    return res.data;
  },

  createMember: async (memberData) => {
    const res = await api.post('/members', memberData);
    return res.data;
  },

  updateMember: async (id, memberData) => {
    const res = await api.put(`/members/${id}`, memberData);
    return res.data;
  },

  updateMemberStatus: async (id, status) => {
    const res = await api.patch(`/members/${id}/status`, { status });
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/members/profile/me', profileData);
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  }
};
